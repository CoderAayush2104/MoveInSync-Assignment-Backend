// busControllers.js
const Bus = require("../models/bus");
const Route = require("../models/route");
const mongoose = require('mongoose');
// Add bus
exports.createBus = async (req, res, next) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.status(201).json(bus);
  } catch (error) {
    next(error);
  }
};

// Update bus
exports.updateBus = async (req, res, next) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bus) return res.status(404).json({ message: "Bus not found." });
    res.status(200).json(bus);
  } catch (error) {
    next(error);
  }
};

// Delete bus
exports.deleteBus = async (req, res, next) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found." });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Get all buses
exports.getAllBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find().populate("routes", "origin destination");
    res.status(200).json(buses);
  } catch (error) {
    next(error);
  }
};

// Get buses based on source and destination
exports.getBusesByRoute = async (req, res, next) => {
  try {
    const { source, destination } = req.query;
    console.log("Incoming Query:", req.query); // Log incoming query parameters

    const routes = await Route.find({ origin: source, destination: destination });
    console.log("Routes Found:", routes); // Log found routes

    if (routes.length === 0) {
      return res.status(404).json({ message: "No routes found." });
    }

    const routeIds = routes.map(route => route._id.toString());
    console.log("Route IDs:", routeIds); // Log route IDs

    const buses = await Bus.find({ routes: { $in: routeIds } });
    console.log("Buses Found:", buses); // Log found buses

    if (buses.length === 0) {
      return res.status(404).json({ message: "No buses found for the specified route." });
    }

    res.status(200).json(buses);
  } catch (error) {
    console.error("Error occurred:", error); // Log errors
    next(error);
  }
};

exports.getAllRoutes = async(req, res) => {
  try {
    const routes = await Route.find();
    console.log(routes)
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRouteById = async (req, res) => {
  const { id } = req.params;
  try {
    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Check seat availability for a specific bus
exports.checkSeatAvailability = async (req, res, next) => {
  try {
    const busId = req.params.id;
    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found." });
    }

    const availableSeats = bus.totalSeats - bus.currentOccupancy;
    res.status(200).json({ availableSeats });
  } catch (error) {
    next(error);
  }
};
