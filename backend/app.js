import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import productRouter from "./routes/products.js";
import categoryRouter from "./routes/categories.js";
import userRouter from "./routes/users.js";

dotenv.config();

const api_url = process.env.API_URL;

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("tiny"));

app.use(cors());
app.options("*", cors());

app.use(`${api_url}/products`, productRouter);
app.use(`${api_url}/categories`, categoryRouter);
app.use(`${api_url}/users`, userRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "e-shop-db",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("Server started on port 3000!");
});
