const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paymentsSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "events"
    },
    amount: {
        type: String,
        default: "0.00"
    },
    paymentMethod: {
        type: String,
        default: "payment_method"
    },
    transId: {
        type: String,
        default: "tansId"
    },
    paymentStatus: {
        type: Boolean,
        default: false
    },
    orderId:{
        type:String,
        default:"orderId"
    }

},
    { timestamps: true })

module.exports = mongoose.model("payments", paymentsSchema)