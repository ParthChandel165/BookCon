const Razorpay = require("razorpay");
const {
    validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
class RazorpayPayment {
    razorpay_instance = null;
    constructor() {
     
        this.razorpay_instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET_KEY,
            currency: "INR",
        });

    }
    async createRazorpayOrder(amount) {
        try {
        

            return this.razorpay_instance.orders.create({
                "amount": amount*100,
                "currency": "INR",
                "receipt": "receipt#1",
                "partial_payment": false,
                "notes": {
                  "key1": "value3",
                  "key2": "value2"
                }
              })
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create subscription: " + error.message);
        }
    }


}

module.exports = new RazorpayPayment();