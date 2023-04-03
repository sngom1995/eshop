import express from "express";
import Product from "../models/product.js";
import dotenv from "dotenv";
import Category from "../models/category.js";
dotenv.config();

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const products = await Product.find(filter).populate("category");
  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    res.status(404).json({ success: false });
  }
  res.send(product);
});
productRouter.post("/", async (req, res) => {
  const category = Category.findById(req.body.category);
  if (!category) {
    res.status(400).json({ success: false, message: "Invalid Category" });
  }
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    description: req.body.description,
    richDescription: req.body.richDescription,
    countInStock: req.body.countInStock,
    price: req.body.price,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  const productCreated = await product.save();
  if (!productCreated) {
    res.status(400).json({ success: false, message: "Product not created" });
  }
  res.status(201).json(productCreated);
});

productRouter.put("/:id", async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    res.status(400).json({ success: false, message: "Invalid Category" });
  }
  Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: req.body.image,
      brand: req.body.brand,
      category: req.body.category,
      description: req.body.description,
      richDescription: req.body.richDescription,
      countInStock: req.body.countInStock,
      price: req.body.price,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  )
    .then((product) => {
      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
      }
      res.status(201).json(product);
    })
    .catch((err) => {
      res.status(400).json({ success: false, error: err });
    });
});

productRouter.delete("/:id", async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);
  if (!product) {
    res.status(404).json({ success: false });
  }
  res.status(200).json({ success: true, message: "Product deleted" });
});

productRouter.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments();
  if (!productCount) {
    res.status(400).json({ success: false, message: "Product not found" });
  }
  res.send({ productCount: productCount });
});

productRouter.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);
  if (!products) {
    res.status(400).json({ success: false, message: "Product not found" });
  }
  res.send(products);
});

export default productRouter;
