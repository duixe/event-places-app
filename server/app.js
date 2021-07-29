const express = require('express');
const morgan = require('morgan');

const ErrorSetter = require('./utils/ErrorSetter');
const globalErrorHander = require('./utils/errorHandler');
//Export routers
const eventPlaceRouter = require('./routes/eventPlaceRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/places', eventPlaceRouter);

//handle routes that does not match any of the defined routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `unable to locate ${req.originalUrl} on this server`,
  // });
  // const err = new Error(`unable to locate ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);
  //👇 better approach using the ErrorHanler class
  next(
    new ErrorSetter(`unable to locate ${req.originalUrl} on this server`, 404)
  );
});

//Global Error Handling middleware
app.use(globalErrorHander);

//START SERVER
module.exports = app;
