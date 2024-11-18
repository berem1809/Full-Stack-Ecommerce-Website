const User = require('../models/userModel');
const catchAsyncError = require('../middlewares/catchAsyncError');

// Register a user => /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    const token = user.getJWTToken();



    res.status(201).json({
        success: true,
        user,
        token
    });
});