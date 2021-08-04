const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const ErrorSetter = require('../utils/ErrorSetter');

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
