const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const STRIP_PUBLIC_KEY = process.env.STRIP_PUBLIC_KEY;
const STRIP_SECRET_KEY = process.env.STRIP_SECRET_KEY;
const stripe = require("stripe")(STRIP_SECRET_KEY);

function createCustomer(req, res, next) {
    stripe.customers.create({
        email: "chandan.kumar@acelucid.com",
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    }).then(result => {
        res.send(result)

    }).catch(err => {
        res.send(err)
    })
}


function saveCardDetails(){

}


function createCharge(){

}

module.exports ={
    createCustomer  
}