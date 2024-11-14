const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "developement") {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  if (process.env.NODE_ENV === "production") {
    let message = err.message;
    let error = { ...err };

    if (err.name === "ValidationError") {
      message = Object.values(err.errors).map((value) => value.message);
      error = new error(message, 400);
    }
    if(err.name =='castError'){
        message =`Resource Not Found ${err.path}` ;
        error = new Error(message)
    }

    res.status(err.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};