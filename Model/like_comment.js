const mongoose  = require("mongoose");
const Schema  = mongoose.Schema;
const LikeCommnetSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    videoDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "videos"
    },
    commentMsg: {
        type: String,
        default: `comment msg...`
    },
    like: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("like_commnents", LikeCommnetSchema)