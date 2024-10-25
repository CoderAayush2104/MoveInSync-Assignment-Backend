const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error.js")
const User = require("../models/User");

// Middleware to check for authentication
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  
  if (!token) {
    return next(new HttpError("Authentication failed", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new HttpError("Authentication failed", 401));
    }

    req.user = user; // Attach user info to the request
    next();
  } catch (error) {
    next(new HttpError("Authentication failed", 401));
  }
};

// Middleware to check for admin role


module.exports =  authMiddleware;
