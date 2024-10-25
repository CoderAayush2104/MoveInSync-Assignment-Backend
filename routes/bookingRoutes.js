const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware")

router.post("/", authMiddleware, bookingController.createBooking);
router.delete("/:id",authMiddleware, bookingController.cancelBooking);
router.get("/:id", authMiddleware, bookingController.getBookingsByUserId); 
module.exports = router;
