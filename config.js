import dotenv from "dotenv";

dotenv.config();
const config = process.env;
export default {
  DATA_DB_URI: config.DATA_DB_URI,
  DATA_NS: config.DATA_NS,
  PORT: config.PORT,
  JWT_SECRET: config.JWT_SECRET,
  EMAIL: config.EMAIL,
  PASSWORD: config.PASSWORD
};