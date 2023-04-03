import mongoose from "mongoose";
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  richDescription: { type: String, default: "" },
  image: { type: String, default: "" },
  images: [{ type: String }],
  countInStock: { type: Number, required: true, min: 0, max: 255 },
  brand: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
