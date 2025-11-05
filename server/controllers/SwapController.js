const Event = require("../models/Event");
const SwapRequest = require("../models/SwapRequest");
const mongoose = require("mongoose");

// @desc    Get all swappable slots (excluding user's own)
// @route   GET /api/swappable-slots
// @access  Private
exports.getSwappableSlots = async (req, res, next) => {
  try {
    const events = await Event.find({
      userId: { $ne: req.user._id },
      status: "SWAPPABLE",
    })
      .populate("userId", "name email")
      .sort({ startTime: 1 });

    res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Create swap request
// @route   POST /api/swap-request
// @access  Private
exports.createSwapRequest = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { mySlotId, theirSlotId } = req.body;

    // Verify both slots exist
    const mySlot = await Event.findOne({
      _id: mySlotId,
      userId: req.user._id,
    }).session(session);

    const theirSlot = await Event.findById(theirSlotId).session(session);

    if (!mySlot) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Your slot not found" });
    }

    if (!theirSlot) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Requested slot not found" });
    }

    // Verify both are swappable
    if (mySlot.status !== "SWAPPABLE") {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Your slot must be in SWAPPABLE status",
      });
    }

    if (theirSlot.status !== "SWAPPABLE") {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Requested slot is no longer available",
      });
    }

    // Create swap request
    const swapRequest = await SwapRequest.create(
      [
        {
          requesterId: req.user._id,
          receiverId: theirSlot.userId,
          requesterSlotId: mySlotId,
          receiverSlotId: theirSlotId,
          status: "PENDING",
        },
      ],
      { session }
    );

    // Update both slots to SWAP_PENDING
    mySlot.status = "SWAP_PENDING";
    theirSlot.status = "SWAP_PENDING";

    await mySlot.save({ session });
    await theirSlot.save({ session });

    await session.commitTransaction();

    res.status(201).json(swapRequest[0]);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Respond to swap request (accept/reject)
// @route   POST /api/swap-response/:requestId
// @access  Private
exports.respondToSwapRequest = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { accept } = req.body;
    const swapRequest = await SwapRequest.findOne({
      _id: req.params.requestId,
      receiverId: req.user._id,
      status: "PENDING",
    }).session(session);

    if (!swapRequest) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Swap request not found" });
    }

    // Get both slots
    const requesterSlot = await Event.findById(
      swapRequest.requesterSlotId
    ).session(session);
    const receiverSlot = await Event.findById(
      swapRequest.receiverSlotId
    ).session(session);

    if (!requesterSlot || !receiverSlot) {
      await session.abortTransaction();
      return res.status(404).json({ message: "One or both slots not found" });
    }

    if (accept) {
      // ACCEPT: Swap the ownership
      const tempUserId = requesterSlot.userId;
      requesterSlot.userId = receiverSlot.userId;
      receiverSlot.userId = tempUserId;

      requesterSlot.status = "BUSY";
      receiverSlot.status = "BUSY";
      swapRequest.status = "ACCEPTED";
    } else {
      // REJECT: Revert to swappable
      requesterSlot.status = "SWAPPABLE";
      receiverSlot.status = "SWAPPABLE";
      swapRequest.status = "REJECTED";
    }

    await requesterSlot.save({ session });
    await receiverSlot.save({ session });
    await swapRequest.save({ session });

    await session.commitTransaction();

    res.json({
      message: accept ? "Swap accepted" : "Swap rejected",
      swapRequest,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Get swap requests (incoming and outgoing)
// @route   GET /api/swap-requests
// @access  Private
exports.getSwapRequests = async (req, res, next) => {
  try {
    // Incoming requests (where user is receiver)
    const incoming = await SwapRequest.find({
      receiverId: req.user._id,
      status: "PENDING",
    })
      .populate("requesterId", "name email")
      .populate("requesterSlotId")
      .populate("receiverSlotId");

    // Outgoing requests (where user is requester)
    const outgoing = await SwapRequest.find({
      requesterId: req.user._id,
    })
      .populate("receiverId", "name email")
      .populate("requesterSlotId")
      .populate("receiverSlotId");

    res.json({ incoming, outgoing });
  } catch (error) {
    next(error);
  }
};
