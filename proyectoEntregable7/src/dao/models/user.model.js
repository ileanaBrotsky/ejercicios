import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, require: true },
 last_name: String,
  email: String,
  age: Number,
  password: String,
  rol:String
});

export const UserModel = mongoose.model(userCollection, userSchema);
 