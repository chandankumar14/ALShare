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
    }
},
    { timestamps: true })


module.exports = mongoose.model("events", EventSchema)