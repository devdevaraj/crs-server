import pkg from "jsonwebtoken";

import ENV from "../config.js";

const { verify } = pkg;

export async function Auth(req, res, next) {
    try {
        const key = req.headers.authorization;
        if(!key) return res.status(401).send({ error: "Authentication failed" });
        const token = key.split(" ")[1];
        const decodedToken = await verify(token, ENV.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch(error) {
        console.log(error);
        return res.status(401).send({ error: "Authentication failed" });
    }
}

export async function Admin(req, res, next) {
    try {
        const { type } = req.user;
        if(type != "Admin") return res.status(401).send({ error: "Authorisation failed" });
        next();
    } catch(error) {
        console.log(error);
        return res.status(401).send({ error: "Authorisation failed" });
    }
}

export function localVariable(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next();
}