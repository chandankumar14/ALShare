const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    inviteTo: {
        type: Boolean,
        default: false
    },
    award: [{
        firstPrize: {
            type: String
        },
        secondPrize: {
            type: String
        },
        thirdPrize: {
            type: String
        }
    }],
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date
    },
    entryFee:{
        type:String,
        default:"00.00"
    },
    eventStatus: {
        type: Boolean,
        default: false
    },
    participants: [{
        participantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    }]
},
 )


module.exports = mongoose.model("events", EventSchema)