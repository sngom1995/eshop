import Category from "../models/category.js";
import express from "express";

const categoryRouter = express.Router();

categoryRouter.get("/", async (req, res) => {
  const categories = await Category.find();
  if (!categories) {
    res.status(500).json({ success: false });
  }
  res.send(categories);
});

categoryRouter.get("/:id", (req, res) => {
  const category = Category.findById(req.params.id)
    .then((category) => {
      if (category) {
        res.status(200).send(category);
      } else {
        res
          .status(404)
          .json({ success: false, message: "category not found!" });
      }
    })
    .catch((err) => {
      res.status(404).json({ success: false, error: err });
    });
});

categoryRouter.post("/", async (req, res) => {
  const category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  const categoryCreated = await category.save();
  if (!categoryCreated) {
    res.status(500).json({ success: false });
  }
  res.status(201).json(categoryCreated);
});

categoryRouter.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },

    { new: true }
  );
  if (!category) {
    res.status(404).json({ success: false });
  }
  res.status(201).json(category);
});

categoryRouter.delete("/:id", (req, res) => {
  const category = Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "The category is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "category not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

export default categoryRouter;
