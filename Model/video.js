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
});

module.exports = mongoose.model("videos", videoDetails);
