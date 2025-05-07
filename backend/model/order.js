const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      }
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
      phoneNo: { type: String, required: true },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    paymentInfo: {
      id: { type: String },
      status: { type: String },
      type: { type: String },
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
