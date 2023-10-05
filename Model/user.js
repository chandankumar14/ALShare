const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    Username: {
      type: String,
     },
    Email: {
      type: String,
      default:`Email Addres..`
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
    phone: {
      type: String,
      default: `+9199999999`,
    },
    password: {
      type: String,
      default: `null`,
    },
    otpVerification:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
