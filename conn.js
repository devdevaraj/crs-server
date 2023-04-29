import mongoose from "mongoose";
import ENV from "./config.js";

async function connect() {
    const URI = ENV.DATA_DB_URI+ENV.DATA_NS;
    mongoose.set("strictQuery",true);
    const db = await mongoose.connect(URI);
    console.log("Database connected");
    return db;
}
export default connect;