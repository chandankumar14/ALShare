const mongoose = require("mongoose");
const schema = mongoose.Schema;
const videoDetails = new schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  videoType: {
    type: String,
    required: true,
    default: "like short || clip || full length",
  },
  videoSource: {
    type: String,
    required: true,
    default: "like youtube || Instagram || others",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  publish:{
    type:Boolean,
    required:true,
    default:false
  }
});

module.exports = mongoose.model("videos", videoDetails);
