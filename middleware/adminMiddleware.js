const HttpError = require("../models/http-error.js")
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
      return next(new HttpError("Access denied", 403));
    }
    next();
  };
  module.exports =  adminMiddleware;