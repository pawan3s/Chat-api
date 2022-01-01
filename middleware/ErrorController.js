const AppError = require("../utils/appError");

module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  //Mongoose Objectid not found
  if (err.name === "CastError") {
    const message = `Invalid ${error.path}:${error.value}`;
    error = new AppError(message, 404);
  }

  //// Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new AppError(message, 400);
  }
  // JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid Token, Please Log in again";
    error = new AppError(message, 400);
  }
  // Token Expired  error
  if (err.name === "TokenExpiredError") {
    const message = "Your token has expired! Please log in again.";
    error = new AppError(message, 400);
  }
  // Multer  error
  if (err.name === "MulterError") {
    const message = "Please enter valid image with field name as photo.";
    error = new AppError(message, 400);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};
