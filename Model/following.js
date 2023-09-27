const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FollowingSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  following: {
    type: Array,
  },
});

module.exports = mongoose.model("following", FollowingSchema);
