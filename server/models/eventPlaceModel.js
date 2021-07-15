const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An Event Place must have a name'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'An Event Place must have a description'],
  },
  capacity: {
    type: String,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'An Event place must have a price'],
  },
  location: String,
  booked: {
    type: Boolean,
    default: false,
  },
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
