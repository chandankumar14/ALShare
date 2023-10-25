const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StripCustomer = new Schema({
    customerId: {
        type: String,
        default: "customerId"
    },
    cardId:{
        type:String,
        default:"cardId"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    email: {
        type: String,
        default: "email"
    },
    phone: {
        type: String,
        default: "phone"
    },
    cardNo: {
        type: String,
        default: "card"
    },
    exp_month: {
        type: String,
        default: "exp_month"
    },
    exp_year: {
        type: String,
        default: "exp_date"
    },
    card_cvc: {
        type: String,
        default: "cvc_no"
    }
},
    { timestamps: true })

module.exports = mongoose.model("strip_customers", StripCustomer)