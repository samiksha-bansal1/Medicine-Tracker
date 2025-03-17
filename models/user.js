const mongoose = require("mongoose");

//schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

//model
const User = mongoose.model("User", userSchema);

module.exports = User;
