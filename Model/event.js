const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    eventType: {
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model("events", EventSchema)