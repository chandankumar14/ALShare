const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const participantSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "events"
    },
    paymentStatus: {
        type: Boolean,
        default: false
    },
    transId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payments"
    }
})

module.exports = mongoose.model("participants", participantSchema)