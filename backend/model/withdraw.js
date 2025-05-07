const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop", // Assuming the seller is a shop. Adjust if needed.
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount must be a positive number"],
  },
  status: {
    type: String,
    enum: ["Processing", "Completed", "Rejected"],
    default: "Processing",
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model("Withdraw", withdrawSchema);
