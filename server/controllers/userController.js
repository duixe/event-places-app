const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const ErrorSetter = require('../utils/ErrorSetter');

const filterObj = (obj, ...allowedParams) => {
  const sanitizedObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedParams.includes(el)) sanitizedObj[el] = obj[el];
  });

  return sanitizedObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: "This endpoint has'nt been created",
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: "This endpoint has'nt been created",
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: "This endpoint has'nt been created",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: "This endpoint has'nt been created",
  });
};

exports.updateProfile = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirm_password) {
    return next(
      new ErrorSetter(
        'Sorry, this route is not meant for password reset or update',
        400
      )
    );
  }

  // Update user DOC
  const filteredParams = filterObj(
    req.body,
    'first_name',
    'last_name',
    'email'
  );
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredParams,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deactivateAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
