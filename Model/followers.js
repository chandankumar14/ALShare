const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FollowerSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  followers: {
    type: Array,
  },
});

module.exports = mongoose.model("followers", FollowerSchema);
