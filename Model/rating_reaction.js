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
    },
    ratingStatus: {
        type: Boolean,
        default: false
    },
    reactionType: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model("rating_reactions", RatingSchema)