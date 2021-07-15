const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
