const mongoose = require('mongoose');
const slugify = require('slugify');

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An Event Place must have a name'],
      unique: true,
      maxLength: [50, 'An Event Place name must not exceed 50 characters'],
      minLength: [
        10,
        'An Event Place name must not be less than 10 characters',
      ],
    },
    slug: String,
    maxSize: {
      type: Number,
      required: [true, 'Event place must have maximum number'],
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
      min: [1, 'Rating cannot be less than 1'],
      max: [5, 'Ratings cannot exceed 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'An Event place must have a price'],
    },
    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          // nb: param val is the value that was entered
          return val < this.price;
        },
        message: 'Discount ({VALUE}) cannot be greater than the actual price',
      },
    },
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
    premiumPlace: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

placeSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

// NB: document middleware that run before the .save() and .create()
placeSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// placeSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//Using Query MiddleWare to detect premium Event Places for premium users
placeSchema.pre(/^find/, function (next) {
  // placeSchema.pre('find', function (next) {
  this.find({ premiumPlace: { $ne: true } });

  this.start = Date.now();
  next();
});

placeSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);

  next();
});

//middle before executing any aggregate query
placeSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { premiumPlace: { $ne: true } } });

  console.log(this.pipeline());
  next();
});
const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
