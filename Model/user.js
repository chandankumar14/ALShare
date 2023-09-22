const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  Username: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    default: `Email`,
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
    default:`sdsgscsycywewfyw`
  }
});

module.exports = mongoose.model("users", userSchema);
