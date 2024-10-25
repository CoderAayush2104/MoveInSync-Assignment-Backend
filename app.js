const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const busRoutes = require("./routes/busRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
require('dotenv').config(); 

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);
mongoose.set('debug', true);

app.use("/api/users", userRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

module.exports = app;
