import pkg from "jsonwebtoken";
import bcrypt from "bcryptjs";

import userModel from "../models/user.model.js";
import ENV from "../config.js";

const { verify, sign } = pkg;

export async function authenticate(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;
    const exist = await userModel.findOne({ username: username });
    if (!exist) return res.status(404).send({ error: "User not found" });
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error });
  }
}

export async function register(req, res) {
  try {
    const { type, username, password, image, extra } = req.body;
    if (!username)
      return res.status(501).send({ error: "username cannot be empty" });
    if (!password)
      return res.status(501).send({ error: "password cannot be empty" });
    const userExist = new Promise((resolve, reject) => {
      userModel
        .findOne({ username })
        .then((user) => {
          if (user) reject({ error: "User already exists" });
          resolve();
        })
        .catch((error) => {
          if (error) reject(new Error(error));
        });
    });
    userExist
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashPassword) => {
              const user = userModel({
                type: type,
                username: username,
                password: hashPassword,
                image: image,
                extra: extra,
              });
              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: "Registration successful" })
                )
                .catch((error) => res.status(500).send({ error: error }));
            })
            .catch((error) => {
              console.log(error);
              return res.status(500).send({ error: error });
            });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ error: error });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    userModel
      .findOne({ username: username })
      .select("+password")
      .then((user) => {
        if (!user)
          return res
            .status(404)
            .send({ error: "Icorrect username or password" });
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res
                .status(400)
                .send({ error: "Incorrect password or username" });
            const token = sign(
              {
                userId: user._id,
                username: user.username,
                type: user.type,
              },
              ENV.JWT_SECRET,
              {
                expiresIn: "24h",
                // allowInsecureKeySizes: true
              }
            );
            return res.status(200).send({
              msg: "Login successful...!",
              type: user.type,
              username: user.username,
              token,
            });
          })
          .catch((error) => {
            console.log(error);
            return res
              .status(400)
              .send({ error: "Incorrect username or password" });
          });
      })
      .catch((error) => {
        console.log(error);
        return res.status(501).send({ error: error });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error });
  }
}

export async function fetchUsers(req, res) {
  try {
    const query = req.query;
    userModel
      .find(query)
      .then((users) => {
        if (!users) return res.status(404).send({ error: "No users found" });
        return res.status(200).send(users);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ error: "Internal server error" });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

export async function profile(req, res) {
  try {
    const { username } = req.user;
    userModel
      .findOne({ username: username })
      .then((user) => {
        if (!user) return res.status(501).send({ error: "Couldn't find user" });
        const { password, ...rest } = Object.assign({}, user.toJSON());
        return res.status(201).send(rest);
      })
      .catch((error) => {
        console.log(error);
        return res.status(404).send({ error: "User not found" });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Unable to fetch profilr" });
  }
}

export async function reset(req, res) {
  try {
    const { username, password } = req.body;
    if (!password)
      return res.status(404).send({ error: "Password cannot be empty" });
    try {
      userModel
        .findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashePassword) => {
              userModel
                .updateOne(
                  { username: user.username },
                  { password: hashePassword }
                )
                .then(() => {
                  return res
                    .status(201)
                    .send({ msg: "Password updated successfully..!" });
                })
                .catch((error) => {
                  console.log(error);
                  return res
                    .status(501)
                    .send({ error: "Couldn't update password" });
                });
            })
            .catch((error) => {
              console.log(error);
              return res
                .status(500)
                .send({ error: "Unable to update password" });
            });
        })
        .catch((error) => {
          console.log(error);
          return res.status(404).send({ error: "Username not found" });
        });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Database error" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: "Request error" });
  }
}

export async function update(req, res) {
  try {
    const { userId } = req.user;
    if (userId) {
      const { _id, password, type, username, ...body } = req.body;
      userModel
        .updateOne({ _id: userId }, body)
        .then(() => {
          return res.status(201).send({ msg: "User updated successfully..!" });
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).send({ error: "Couldn't update user" });
        });
    } else {
      return res.status(401).send({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Unable to update user" });
  }
}

export async function updateUsers(req, res) {
  try {
    const { userId } = req.params;
    const { _id, password, username, ...body } = req.body;
    userModel
      .updateOne({ _id: userId }, body)
      .then(() => {
        return res
          .status(201)
          .send({ error: "User details updated successfully" });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ error: "Internal server error" });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

export async function remove(req, res) {
  try {
    const { username } = req.query;
    if (!username)
      return res.status(501).send({ error: "Request cannot be empty" });
    userModel
      .findOne({ username: username })
      .then((user) => {
        if (!user) return res.status(404).send({ error: "Couldn't find user" });
        userModel
          .deleteOne({ _id: user._id })
          .then(() => {
            return res
              .status(200)
              .send({ msg: "User removed successfully..!" });
          })
          .catch((error) => {
            console.log(error);
            return res.status(400).send({ error: "Deletion failed" });
          });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ error: "Internal server error" });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { password } = req.body;
    const { username } = req.user;
    try {
      userModel
        .findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              userModel
                .updateOne(
                  { username: user.username },
                  { password: hashedPassword }
                )
                .then(() => {
                  return res.status(201).send({ msg: "Record updated....!" });
                })
                .catch((error) => {
                  return res
                    .status(500)
                    .send({ error: "Unable to hash password" });
                });
            })
            .catch((e) => {
              return res.status(500).send({ error: "Unable to hash password" });
            });
        })
        .catch((error) => {
          return res.status(404).send({ error: "Username not found" });
        });
    } catch (error) {
      return res.status(500).send({ error: "Database error" });
    }
  } catch (error) {
    return res.status(401).send({ error: "REquest errror" });
  }
}
