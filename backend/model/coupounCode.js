const mongoose = require("mongoose");

const couponCodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your coupon code name!"],
      unique: true,
      trim: true,
      index: true, // ✅ Index for faster searches
    },
    value: {
      type: Number,
      required: true,
      min: 0, // ✅ Ensures only valid discount values
    },
    minAmount: {
      type: Number,
      default: 0, // ✅ Provides a fallback
      min: 0,
    },
    maxAmount: {
      type: Number,
      min: 0,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId, // ✅ Better for referencing documents
      required: true,
      ref: "Shop",
      index: true, // ✅ Improves shop-based lookups
    },
    selectedProduct: {
      type: mongoose.Schema.Types.ObjectId, // ✅ Improve product linkage
      ref: "Product",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // ✅ Adds updatedAt for tracking changes
);

module.exports = mongoose.model("CouponCode", couponCodeSchema);
