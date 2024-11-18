const User = require('../models/userModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');


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


    sendToken(user,201,res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
const {email,password}=req.body


// Check if email and password is entered by user
if(!email || !password){
    return next(new ErrorHandler('Please enter email & password',400))
}

// Finding user in database
const user = await User.findOne({email}).select('+password');


// Check if user not found or password is incorrect
if(!user){
    return next(new ErrorHandler('Invalid Email or Password',401));
}

// Check if password is correct
if(!await user.isValidPassword(password)){
    return next(new ErrorHandler('Invalid Email or Password',401));
}

sendToken(user,201,res);

});