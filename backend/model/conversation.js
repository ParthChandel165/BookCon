const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    groupTitle: {
      type: String,
      required: true,
      unique: true,
      index: true, // ✅ Index for faster search & duplication check
    },
    members: {
      type: [String], // ✅ Use String array instead of generic Array
      required: true,
      index: true,     // ✅ Index for efficient filtering
    },
    lastMessage: {
      type: String,
    },
    lastMessageId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
