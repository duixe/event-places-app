const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught exception, shutting down...');
  process.exit(1);
});

const app = require('./app');
// configure path dotenv file
dotenv.config({ path: './config.env' });

//mongoose configuration
const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connected successfully !'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection, Shutting down...');
  //giving the server more time to handle pending requests before
  //it finally shuts down
  server.close(() => {
    process.exit(1);
  });
  process.exit(1);
});
