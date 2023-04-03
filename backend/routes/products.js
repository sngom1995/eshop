import express from "express";
import Product from "../models/product.js";
import dotenv from "dotenv";
dotenv.config();

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});
productRouter.post("/", (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
    price: req.body.price,
  });
  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

export default productRouter;
