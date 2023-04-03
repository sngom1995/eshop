import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

const api_url = process.env.API_URL;

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get(`${api_url}/products`, (req, res) => {
  const product = {
    id: 1,
    name: "Product 1",
    price: 100,
  };
  res.send(product);
});
app.post(`${api_url}/products`, (req, res) => {
  const product = req.body;
  console.log(product);
  res.send(product);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
