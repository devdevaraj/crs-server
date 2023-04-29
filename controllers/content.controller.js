import contentModel from "../models/content.model.js";

export async function getContent(req, res) {
  try {
    const { cname } = req.query;
    contentModel
      .findOne({ cname: cname })
      .then((cont) => {
        if (!cont)
          return res.status(404).send({ error: "Couldn't find content" });
        return res.status(201).send(cont);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ error: "Faled to fetch content" });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Couldn't fetch content" });
  }
}

export async function setContent(req, res) {
  try {
    const { cname, content, props } = req.body;
    const contentExist = new Promise((resolve, reject) => {
      contentModel
        .findOne({ cname: cname })
        .then((name) => {
          if (name) reject({ error: "Content already in" });
          resolve();
        })
        .catch((error) => {
          reject(new Error(error));
        });
    });
    contentExist
      .then(() => {
        if (!content)
          return res.status(400).send({ error: "Content cannot be empty" });
        const cont = contentModel({
          cname: cname,
          content: content,
          props: props,
        });
        cont
          .save()
          .then(() => {
            return res
              .status(201)
              .send({ msg: "Content inserted successfully" });
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).send({ error: "Couldn't insert content" });
          });
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send(error);
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Some error occured..!" });
  }
}

export async function updateContent(req, res) {
  try {
    const body = req.body;
    if (body.cname) {
      contentModel
        .updateOne({ cname: body.cname }, body)
        .then(() => {
          return res.status(200).send({ msg: "Content updated successfully" });
        })
        .catch((error) => {
          console.log(error);
          return res.status(401).send({ error: "Unable to update content" });
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Couldn't update content" });
  }
}

export async function remove(req, res) {
  try {
    const { cname } = req.query;
    if (!cname) return res.status(400).send({ error: "Query cannot be empty" });
    contentModel
      .findOne({ cname: cname })
      .then((content) => {
        if (!content)
          return res.status(404).send({ error: "Content not found" });
        contentModel
          .deleteOne({ _id: content._id })
          .then(() => {
            return res
              .status(200)
              .send({ msg: "Content deleted successfully" });
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).send({ error: "Couldn't delete content" });
          });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ error: "Couldn't remove content" });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal server error" });
  }
}
