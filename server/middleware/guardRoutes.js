const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const ErrorSetter = require('../utils/ErrorSetter');

exports.guardRoute = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //CHECK IF TOKEN DO EXIST
  if (!token) {
    return next(
      new ErrorSetter('unathourized, kindly login to get access', 401)
    );
  }

  //VERIFY TOKEN - 👇 this will throw an error if the token has been tampered with
  // the error is thereby handled by the Global error handler '/utils/errorHandler.js'
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //CHECK IF USER STILL EXIST
  const extractedUser = await User.findById(decoded.id);
  if (!extractedUser) {
    return next(
      new ErrorSetter('The user with this token does not exist', 401)
    );
  }

  //CHECK IF USER CHANGED THE PASSWORD AFTER TOKEN WAS ISSUED
  const isPassChangedAfterTokenIssued = extractedUser.PasswordchangedAfter(
    decoded.iat
  );
  if (isPassChangedAfterTokenIssued) {
    return next(
      new ErrorSetter(
        "Looks like you've changed your password, kindly login again",
        401
      )
    );
  }

  //CONTINUE BY GRANTING ACCESS TO THE NEXT ROUTE
  req.user = extractedUser;
  next();
});
