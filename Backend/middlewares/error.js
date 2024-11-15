module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV == "Development") {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
  if (process.env.NODE_ENV == "Production") {
    let message = err.message;
    let error = new Error(message);

    //1. Validation Errors
//These errors occur when the data provided by the user does not meet the validation rules defined in your Mongoose schemas.
   
if (err.name == "ValidationError") {
      message = Object.values(err.errors).map((value) => value.message);
      error = new Error(message);
      err.statusCode = 400;
    }

    //2. Cast Errors
//These errors occur when an invalid ObjectId is provided, such as when querying the database with an invalid ID format.
    if (err.name == "CastError") {
      message = `Resource not found: ${err.path}`;
      error = new Error(message);
      err.statusCode = 400;
    }

    res.status(err.statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};