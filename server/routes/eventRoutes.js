const express = require("express");
const {
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getMyEvents).post(protect, createEvent);

router.route("/:id").put(protect, updateEvent).delete(protect, deleteEvent);

module.exports = router;
