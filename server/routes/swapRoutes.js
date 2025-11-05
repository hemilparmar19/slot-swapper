const express = require("express");
const {
  getSwappableSlots,
  createSwapRequest,
  respondToSwapRequest,
  getSwapRequests,
} = require("../controllers/swapController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/swappable-slots", protect, getSwappableSlots);
router.post("/swap-request", protect, createSwapRequest);
router.post("/swap-response/:requestId", protect, respondToSwapRequest);
router.get("/swap-requests", protect, getSwapRequests);

module.exports = router;
