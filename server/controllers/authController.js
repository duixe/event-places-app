const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const ErrorSetter = require('../utils/ErrorSetter');
const sendEmail = require('../utils/emailHandler');

// eslint-disable-next-line arrow-body-style
const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    confirm_password: req.body.confirm_password,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

//login function
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorSetter('please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new ErrorSetter('Invalid email or password', 401));
  }

  const token = generateToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});

//forgot password handler
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get user per email sent through a POST req.
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorSetter('Sorry, no user is associated with this email', 404)
    );
  }

  //Generate a random reset Token
  const resetToken = user.makePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //Generate a reset Password URL and send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `There was a password reset request for this email. To reset your password kindly click on this link: ${resetURL}.\n
  If you didn't request a password reset, ignore this message`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'password reset url sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordRestExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorSetter(
        // 'We could not send the email at this moment, try agin later',
        error,
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Extract user based on token from the request
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorSetter('Token has Expired or Invalid', 400));
  }
  user.password = req.body.password;
  user.confirm_password = req.body.confirm_password;
  user.passwordResetToken = undefined;
  user.passwordExpired = undefined;
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  //extract user from collection using id from the req NB: req.user.id is
  //extracted from the guard.guardroutes middleware
  const user = await User.findById(req.user.id).select('+password');

  //compare previous passwords
  if (!(await user.checkPassword(req.body.current_password, user.password))) {
    return next(new ErrorSetter('Your current password is wrong', 401));
  }

  //update password if comparison returns true
  user.password = req.body.password;
  user.confirm_password = req.body.confirm_password;
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
