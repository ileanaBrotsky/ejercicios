import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  
products: {
    type:[
      { id:String,
        quantity: Number
      }
      ]
  }
});

export const CartModel = mongoose.model(cartCollection, cartSchema);
