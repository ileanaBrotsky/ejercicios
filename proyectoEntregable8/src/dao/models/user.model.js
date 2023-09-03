import mongoose from "mongoose";


const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: {type: String, unique: true },
  email: String,
  age: Number,
  password: {type: String, required: true},
  cart:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"carts"
        },
  rol: { 
        type: String, 
        default: "usuario",
        }
});

export const UserModel = mongoose.model(userCollection, userSchema);
 