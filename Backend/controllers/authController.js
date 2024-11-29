const User = require("../models/userModel");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

// Register a user => /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  const token = user.getJWTToken();

  sendToken(user, 201, res);
});

// Login user => /api/v1/login
// exports.loginUser = catchAsyncError(async (req, res, next) => {
//   const { email, password } = req.body;

//   // Check if email and password is entered by user
//   if (!email || !password) {
//     return next(new ErrorHandler("Please enter email & password", 400));
//   }

//   // Finding user in database
//   const user = await User.findOne({ email }).select("+password");

//   // Check if user not found or password is incorrect
//   if (!user) {
//     return next(new ErrorHandler("Invalid Email or Password", 401));
//   }

//   // Check if password is correct
//   if (!(await user.isValidPassword(password))) {
//     return next(new ErrorHandler("Invalid Email or Password", 401));
//   }

//   sendToken(user, 201, res);
// });

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isValid = await user.isValidPassword(password);

  if (!isValid) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 201, res);
});

// Logout user => /api/v1/logout
exports.logoutUser = (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};


exports.changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(
      new ErrorHandler("Please enter both old and new password", 400)
    );
  }

  const user = await User.findById(req.user.id).select("+password");

  // Add debug log
  console.log("User found:", user._id);

  const isMatched = await user.isValidPassword(oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // Set new password
  user.password = newPassword;

  // Add debug log before save
  console.log("About to save new password");
  await user.save();
  console.log("Password saved successfully");

  sendToken(user, 200, res);
});


// Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Get reset token
  const resetToken = user.getResetToken();

  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIT Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpired = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpired: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpired = undefined;

  await user.save((validateBeforeSave = false));

  sendToken(user, 200, res);
});

//Get currently logged in user details => /api/v1/myProfile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id); //req.user.id is coming from the protect middleware
  res.status(200).json({
    success: true,
    user,
  });
});

// // Update / Change password => /api/v1/password/update
// exports.changePassword = catchAsyncError(async (req, res, next) => {
//   const user = await User.findById(req.user.id).select("+password");

//   // Check previous user password
//   const isMatched = await user.isValidPassword(req.body.oldPassword);

//   if (!isMatched) {
//     return next(new ErrorHandler("Old password is incorrect", 400));
//   }

//   res.status(200).json({
//     success: true,
//     user,
//   });
// });
exports.changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(
      new ErrorHandler("Please enter both old and new password", 400)
    );
  }

  // Find user and select password field
  const user = await User.findById(req.user.id).select("+password");

  // Verify old password
  const isMatched = await user.isValidPassword(oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // Important: Set new password and force the save to trigger password hashing
  user.password = newPassword;
  user.save({ validateBeforeSave: true }); // Force validation and hashing

  // Update the token and send response
  sendToken(user, 200, res);
});

// Update user profile => /api/v1/myProfile/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  // Update user profile
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Update avatar: TODO
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true, // Return updated new user details
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});



//---------------------------------------------------------Admin Routes------------------------------------------------------------


// Admin Routes - Admin can get all users => /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Admin: get specifoc user's details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);  //req.params.id is coming from the route

if(!user){
  return next(new ErrorHandler(`User does not found with id: ${req.params.id}`, 404));
}
  res.status(200).json({
    success: true,
    user,
  });
});

//Admin : Update user details => /api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Admin: Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id); //req.params.id is coming from the route

  if(!user){
    return next(new ErrorHandler(`User does not found with id: ${req.params.id}`, 404));
  }
  await User.deleteOne({ _id: req.params.id }); //req.params.id is coming from the route which has been passed from the frontend

  res.status(200).json({
    success: true,
    message: "User is deleted",
  });
});