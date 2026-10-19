import express from "express";
import "dotenv/config";
import connectDb from "./Config/db.js";
import userRouter from "./Routes/userRoute.js";

const app = express();

// Middleware
app.use(express.json())

app.use('/api/user',userRouter)

app.get("/", (req, res) => {
  res.send("Welcome To FoodHub dataBase ");
});

app.listen(process.env.PORT, () => {
  connectDb();
  console.log(`Server running on : http://localhost:${process.env.PORT}`);
});
