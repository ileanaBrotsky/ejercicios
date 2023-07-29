import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: {
    type: Array,
    default: [],
  },
  code: String,
  stock: Number,
  category: String,
  status: Boolean,
});

export const productModel = mongoose.model(productCollection, productSchema);
