import express from "express";
import "dotenv/config";
import connectDb from "./Config/db.js";

const app = express();

app.listen(process.env.PORT, () => {
  connectDb();
  console.log(`Server running on : http://localhost:${process.env.PORT}`);
});
