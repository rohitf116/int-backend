import { Schema, model } from "mongoose";

const userSchema = new Schema({
  auth: String,
  name: String,
  access_token: String,
});

export default model("User", userSchema);
