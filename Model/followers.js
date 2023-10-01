const mongoose = require("mongoose")
const Schema = mongoose.Schema

const FollowersSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    followers:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
})

module.exports = mongoose.model("Followers", FollowersSchema)