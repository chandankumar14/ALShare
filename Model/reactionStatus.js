const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const ReactionSchema = new Schema({
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
    },
    code:{
        type:String,
    },
    name:{
        type:String
    }
})

module.exports = mongoose.model("reactionStatus", ReactionSchema)