const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your event product name!"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter your event product description!"],
    },
    category: {
      type: String,
      required: [true, "Please enter your event product category!"],
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    finishDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Running", "Completed", "Upcoming"], // ✅ better control
      default: "Running",
    },
    tags: {
      type: [String],
      default: [],
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discountPrice: {
      type: Number,
      required: [true, "Please enter your event product price!"],
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, "Please enter your event product stock!"],
      min: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
        comment: {
          type: String,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    shop: {
      type: Object,
      required: true,
    },
    soldOut: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
