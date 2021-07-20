const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An Event Place must have a name'],
      unique: true,
    },
    maxSize: {
      type: Number,
      required: [true, 'Event place must maximum number of people'],
    },
    eventSuite: [String],
    description: {
      type: String,
      required: [true, 'An Event Place must have a description'],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'An Event Place must have a summarized description'],
      trim: true,
    },
    capacity: {
      type: String,
    },
    duration: {
      type: Number,
    },
    averageRatings: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'An Event place must have a price'],
    },
    discount: Number,
    location: String,
    booked: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
      required: [true, 'An event place must have a cover image'],
    },
    allImages: [String],
    created_at: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    start_date: Date,
    end_date: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

placeSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
