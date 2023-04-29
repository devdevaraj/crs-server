import express from "express";
import cors from "cors";
import morgan from "morgan";

import ENV from "./config.js";
import connect from "./conn.js";
import router from "./router.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({
    limit: "50mb",
    extended: true
}));
app.use(morgan("tiny"));
app.use(cors());
app.disable("x-powered-by");
app.disable('etag');
app.get("/",(req, res) => {
    res.status(200).json("GET root");
});

app.use("/api",router);

connect().then(() => {
    try {
        app.listen(ENV.PORT,() => {
            console.log(`server started on port ${ENV.PORT}`)
        });
    } catch(error) {
        console.log(error);
    }
}).catch((error) => {
    console.log(error);
});