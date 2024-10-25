const express = require("express");
const router = express.Router();
const busController = require("../controllers/busControllers");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Admin routes
router.post("/", authMiddleware, adminMiddleware, busController.createBus); // Create Bus
router.put("/:id", authMiddleware, adminMiddleware, busController.updateBus); // Update Bus
router.delete("/:id", authMiddleware, adminMiddleware, busController.deleteBus); // Delete Bus

// Routes accessible to authenticated users
router.get("/", authMiddleware, busController.getAllBuses); // Get all buses
router.get("/available", authMiddleware, busController.getBusesByRoute); // Browse available buses
router.get("/:id/availability", authMiddleware, busController.checkSeatAvailability); // Check seat availability
router.get("/routes/:id", authMiddleware, busController.getRouteById); // Get a route by ID
router.get("/routes", authMiddleware, busController.getAllRoutes); // Get all routes

module.exports = router;
