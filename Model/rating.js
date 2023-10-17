const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "videos"
    },
    rating: {
        type: String,
        default: "0.00"
    }
})

module.exports = mongoose.model("ratings", RatingSchema)