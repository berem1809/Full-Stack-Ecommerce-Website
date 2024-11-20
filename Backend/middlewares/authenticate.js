const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('./catchAsyncError');

// Check if user is authenticated
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new ErrorHandler('Please login to access this resource', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
});