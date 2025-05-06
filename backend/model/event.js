const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please enter your event product name!"] },
  description: { type: String, required: [true, "Please enter your event product description!"] },
  category: { type: String, required: [true, "Please enter your event product category!"] },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: "Running" },
  tags: { type: String },
  originalPrice: { type: Number },
  discountPrice: { type: Number, required: [true, "Please enter your event product price!"] },
  stock: { type: Number, required: [true, "Please enter your event product stock!"] },
  images: [{ type: String }],
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number },
      comment: { type: String },
      productId: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  ratings: { type: Number },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  sold_out: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Event", eventSchema);
