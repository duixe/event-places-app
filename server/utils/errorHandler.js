const ErrorSetter = require('./ErrorSetter');

const sanitizeCastErrorByDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new ErrorSetter(message, 400);
};

const sanitizeDuplicateFieldsByDB = (error) => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Dupliate field value: ${value}, kindly use a different value`;
  return new ErrorSetter(message, 400);
};

const sanitizeValidationErrorByDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ErrorSetter(message, 400);
};

const sanitizeErrorByJwt = () =>
  new ErrorSetter('Invalid Token, kindly login again', 401);

const sanitizeExpiredErrorByJwt = () =>
  new ErrorSetter('Your token has expired, kindly login again', 401);

const sendDevErrors = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdErrors = (err, res) => {
  // error caused by a client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // error cause by a bug
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // amount of errors to expose based on the env
  if (process.env.NODE_ENV === 'development') {
    sendDevErrors(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Handle mongoDB err
    let error = err;
    if (error.name === 'ValidationError')
      error = sanitizeValidationErrorByDB(error);
    if (error.name === 'CastError') error = sanitizeCastErrorByDB(error);
    if (error.name === 'JsonWebTokenError') error = sanitizeErrorByJwt();
    if (error.name === 'TokenExpiredError') error = sanitizeExpiredErrorByJwt();
    if (error.code === 11000) error = sanitizeDuplicateFieldsByDB(error);

    sendProdErrors(error, res);
  }
};
