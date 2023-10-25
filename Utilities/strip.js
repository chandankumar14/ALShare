const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const StripCustomerModel = require("../Model/stripCustomer")
const STRIP_PUBLIC_KEY = process.env.STRIP_PUBLIC_KEY;
const STRIP_SECRET_KEY = process.env.STRIP_SECRET_KEY;
const stripe = require("stripe")(STRIP_SECRET_KEY);
function StripePayment(req, res, next) {
    const userId = req.body.userId;
    const cardHolderName = req.body.cardHolderName;
    const email = req.body.email;
    const phone = req.body.phone;
    const cardNo = req.body.cardNo;
    const exp_month = req.body.exp_month;
    const exp_year = req.body.exp_year;
    const card_cvc = req.body.card_cvc;
    const amount = req.body.amount;
    //***** Checking User is exist or not***********/
    StripCustomerModel.find({ userId: userId }).then(result => {
        if (result.length > 0 && result[0].customerId != "customerId" && result[0].cardId != "cardId") {
            stripe.charges.create({
                receipt_email: email,
                amount: parseInt(amount) * 100,
                currency: 'INR',
                card: result[0].customerId,
                customer: result[0].cardId
            }).then(payment => {
                res.status(200).json({
                    statusCode: 200,
                    message: "payment is successfull..",
                    payment_details: payment
                })
            }).catch(err => {
                res.status(401).json({
                    statusCode: 401,
                    message: `something going wrong , please check and err is ${err}`
                })
            })
        } else {
            //********** Creating Customer Here******* */
            stripe.customers.create({
                name: cardHolderName,
                email: email,
            }).then(customer => {
                //***** Adding payment Resouces */
                stripe.tokens.create({
                    card: {
                        name: cardHolderName,
                        number: cardNo,
                        exp_year: exp_year,
                        exp_month: exp_month,
                        cvc: card_cvc
                    }
                }).then(card_resource => {
                    //*********customer resources************
                    stripe.customers.createSource(customer.id, {
                        source: `${card_resource.id}`
                    }).then(resource => {
                        //************Creating charges****** */
                        stripe.charges.create({
                            receipt_email: email,
                            amount: parseInt(amount) * 100, //amount*100
                            currency: 'INR',
                            card: resource.id,
                            customer: customer.id
                        }).then(payment => {
                            const StripCustomerPayLoad = new StripCustomerModel({
                                customerId: customer.id,
                                cardId: resource.id,
                                userId: userId,
                                email: email,
                                phone: phone,
                                cardNo: cardNo,
                                exp_month: exp_month,
                                exp_year: exp_year,
                                card_cvc: card_cvc,
                            })
                            StripCustomerPayLoad.save().then(result => {
                                res.status(200).json({
                                    statusCode: 200,
                                    message: `payment is successfull..`,
                                    payment_details: payment
                                })
                            }).catch(err => {
                                res.status(401).json({
                                    statusCode: 401,
                                    message: `something going wrong , please check and err is ${err}`
                                })
                            })
                        }).catch(err => {
                            res.status(401).json({
                                statusCode: 401,
                                message: `something going wrong , please check and err is ${err}`
                            })
                        })

                    }).catch(err => {
                        res.status(401).json({
                            statusCode: 401,
                            message: `something going wrong , please check and err is ${err}`
                        })
                    })

                }).catch(err => {
                    res.status(401).json({
                        statusCode: 401,
                        message: `something going wrong , please check and err is ${err}`
                    })
                })
                //******Adding resource is ending here****** */
            }).catch(err => {
                res.status(401).json({
                    statusCode: 401,
                    message: `something going wrong , please check and err is ${err}`
                })
            })
        }
        //*******Ending Here**********/
    }).catch(err => {
        res.status(401).json({
            statusCode: 401,
            message: `something going wrong , please check and err is ${err}`
        })
    })

}
module.exports = {
    StripePayment
}