const mongoose = require("mongoose")
const Schema = mongoose.Schema

const FollowingSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
},
    { timestamps: true }
)

module.exports = mongoose.model("Following", FollowingSchema)