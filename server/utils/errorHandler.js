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
    console.error('Error', err);
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
  } else if (process.env.NODE_ENV === 'development') {
    sendProdErrors(err, res);
  }
};
