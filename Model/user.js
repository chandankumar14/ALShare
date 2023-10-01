const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    Username: {
      type: String,
      unique: true,
    },
    Email: {
      type: String,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
