const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  Username: {
    type: String,
    required: true,
    unique: true
  },
  Email: {
    type: String,
    required: true,
  },
  Avatar: {
    type: String,
    default: `Avatar`,
  },
  About: {
    type: String,
    default: `About`,
  },
  DOB: {
    type: String,
    default: `24-04-1999`,
  },
  password:{
    type:String,
    default:`null`
  }
});

module.exports = mongoose.model("users", userSchema);
