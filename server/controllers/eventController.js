const Event = require("../models/Event");

// @desc    Get all events for logged-in user
// @route   GET /api/events
// @access  Private
exports.getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ userId: req.user._id }).sort({
      startTime: 1,
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res, next) => {
  try {
    const { title, startTime, endTime, status } = req.body;

    const event = await Event.create({
      userId: req.user._id,
      title,
      startTime,
      endTime,
      status: status || "BUSY",
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check ownership
    if (event.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check ownership
    if (event.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Don't allow deletion if in pending swap
    if (event.status === "SWAP_PENDING") {
      return res.status(400).json({
        message: "Cannot delete event with pending swap request",
      });
    }

    await event.deleteOne();

    res.json({ message: "Event removed" });
  } catch (error) {
    next(error);
  }
};
