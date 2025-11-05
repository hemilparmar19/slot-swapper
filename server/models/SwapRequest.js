const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    requesterSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Event",
    },
    receiverSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Event",
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SwapRequest", swapRequestSchema);
