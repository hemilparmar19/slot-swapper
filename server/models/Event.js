const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, "Please add a start time"],
    },
    endTime: {
      type: Date,
      required: [true, "Please add an end time"],
    },
    status: {
      type: String,
      enum: ["BUSY", "SWAPPABLE", "SWAP_PENDING"],
      default: "BUSY",
    },
  },
  {
    timestamps: true,
  }
);

// Validation: endTime must be after startTime
eventSchema.pre("save", function (next) {
  if (this.endTime <= this.startTime) {
    next(new Error("End time must be after start time"));
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);
