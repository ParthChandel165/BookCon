const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const razorpay_instance = require("./razorpayutils");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
router.use((req, res, next) => {
  next();
});
router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "Omprakash",
      },
    });
    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  })
);


router.post('/create-payment', async (req, res) => {
  try {

    const payment = await razorpay_instance.createRazorpayOrder(req.body.amount);
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
}
  
);
router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);

module.exports = router;
