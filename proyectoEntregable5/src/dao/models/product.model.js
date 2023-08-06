import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    require: true 
  },
  description: String,
  price: Number,
  thumbnail: {
    type: Array,
    default: [],
  },
  code: { type: String, require: true },
  stock: Number,
  category: String,
  status: Boolean,
});

export const ProductModel = mongoose.model(productCollection, productSchema);
