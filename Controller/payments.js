const paymentsModel = require("../Model/payment");
const participantsModel = require("../Model/participants");
const eventModel = require("../Model/event");
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const razorPay = require("razorpay");
//*********Create Order for payment********** */
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpaySecretKey = process.env.RAZORPAY_SECRET_KEY;
exports.CreateOrder = async (req, res, next) => {
    const eventId = req.body.eventId;
    const userId = req.body.userId;
    const amount = req.body.amount;
    const receiptEmail = req.body.receiptEmail;
    var razorPayInstance = new razorPay({
        key_id: razorpayKeyId,
        key_secret: razorpaySecretKey
    })
    var payload = {
        amount: amount * 100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: receiptEmail
    }
    razorPayInstance.orders.create(payload).then(result => {
        const paymentsModelPayload = new paymentsModel({
            eventId: eventId,
            userId: userId,
            amount: amount,
            orderId: result.id
        })
        //*********updating payment collection****** */
        paymentsModelPayload.save().then(result1 => {
            res.status(200).json({
                statusCode: 200,
                message: `razorpay order is created ..`,
                keyId: razorpayKeyId,
                result: result
            })
        }).catch(err => {
            res.status(401).json({
                statusCode: 401,
                message: `something going wrong and err is ${err}`
            })
        })

    }).catch(err => {
        res.status(401).json({
            statusCode: 401,
            message: `something going wrong and err is ${err}`
        })
    })
}
//***********update payments status******** */
exports.updatePaymentStatus = async (req, res, next) => {
    const paymentMethod = req.body.paymentMethod;
    const transId = req.body.transId;
    const paymentStatus = req.body.paymentStatus;
    const userId = req.body.userId;
    const eventId = req.body.eventId;
    paymentsModel.findOneAndUpdate({ eventId: eventId, userId: userId },
        { paymentMethod: paymentMethod, transId: transId, paymentStatus: paymentStatus })
        .then(result => {
            //*********updating participants details ******** */
            participantsPayLoad = new participantsModel({
                eventId: eventId,
                userId: userId,
                paymentStatus: paymentStatus,
                transId: transId
            })
            participantsPayLoad.save().then(result1 => {
                eventModel.findByIdAndUpdate(eventId, {
                    $push: {
                        participants: {
                            participantId: userId,
                            videoPostStaus: false
                        }
                    }
                }).then(result2 => {
                    res.status(200).json({
                        statusCode: 200,
                        message: `you are successFully joined event`
                    })
                }).catch(err => {
                    res.status(401).json({
                        statusCode: 401,
                        message: `something going wrong and err is ${err}`
                    })
                })
            }).catch(err => {
                res.status(401).json({
                    statusCode: 401,
                    message: `something going wrong and err is ${err}`
                })
            })
        }).catch(err => {
            res.status(401).json({
                statusCode: 401,
                message: `something going wrong and err is ${err}`
            })
        })
}


