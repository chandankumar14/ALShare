const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavouriteSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    videoDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "videos"
    },
    videoOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
})

module.exports = mongoose.model("favourites", FavouriteSchema)