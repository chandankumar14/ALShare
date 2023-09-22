const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
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
});
