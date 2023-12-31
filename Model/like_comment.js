const mongoose  = require("mongoose");
const Schema  = mongoose.Schema;
const LikeCommnetSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "videos"
    },
    reactionStatus: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("like_commnents", LikeCommnetSchema)