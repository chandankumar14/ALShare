const mongoose = require("mongoose");
const schema = mongoose.Schema;
const EventVideoSchema = new schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    
    description: {
        type: String,
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
    videoStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    thumbnail: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        default: `00`
    },
    avgRating: {
        type: String,
        default: "0.00"
    },
    ratingUserCount: {
        type: Number,
        default: 0
    },
    reaction: [{
        NAME: {
          type: String,
        },
        CODE: {
          type: String,
        },
        COUNT: {
          type: Number,
        },
        EMOOJI: {
          type: String,
        }
      }],
      tags: {
        type: Array,
        required: true,
      },
    
},
    { timestamps: true });

module.exports = mongoose.model("event_videos", EventVideoSchema);
