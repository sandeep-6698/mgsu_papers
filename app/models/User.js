const mongoose = require("mongoose");
let user = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Boolean, default: true },
  status: { type: Boolean, default: true }
},{timestamps:true});
module.exports = mongoose.model("User", user);