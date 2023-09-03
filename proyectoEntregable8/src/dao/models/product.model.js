import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    index: true
  },
  description: String,
  price: Number,
  thumbnail: {
    type: Array,
    default: [],
  },
  code: { type: String, require: true, index: true },
  stock: Number,
  category: String,
  status: Boolean,
});
productSchema.plugin(mongoosePaginate)
export const ProductModel = mongoose.model(productCollection, productSchema);

