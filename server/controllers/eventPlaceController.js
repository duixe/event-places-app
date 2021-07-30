const Place = require('../models/eventPlaceModel');
const APIFeatures = require('../utils/placesAPIFeature');
const catchAsync = require('../utils/catchAsync');
const ErrorSetter = require('../utils/ErrorSetter');

exports.aliasTopPlaces = (req, res, next) => {
  req.query.limit = 10;
  req.query.sort = '-averageRatings,price';
  req.query.fields =
    'name,price,averageRatings,summary,location,booked,maxSize,location';
  next();
};

exports.getAllPlaces = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Place.find(), req.query)
    .filter()
    .sort()
    .specificFields()
    .paginate();
  const eventPlaces = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: eventPlaces.length,
    data: {
      eventPlaces,
    },
  });
});

exports.getPlace = catchAsync(async (req, res, next) => {
  const eventPlace = await Place.findById(req.params.id);

  if (!eventPlace) {
    return next(
      new ErrorSetter(
        "The event place you're looking for could not be found",
        404
      )
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      eventPlace,
    },
  });
});

exports.createPlace = catchAsync(async (req, res, next) => {
  const newEventPlace = await Place.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      places: newEventPlace,
    },
  });
});

exports.updatePlace = catchAsync(async (req, res, next) => {
  const updatedEventPlace = await Place.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedEventPlace) {
    return next(
      new ErrorSetter(
        "The event place you're looking for could not be found",
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedEventPlace,
    },
  });
});

exports.deletePlace = catchAsync(async (req, res, next) => {
  // not a good practise to send back the deleted doc
  const deletedPlace = await Place.findByIdAndDelete(req.params.id);

  if (!deletedPlace) {
    return next(
      new ErrorSetter(
        "The event place you're looking for could not be found",
        404
      )
    );
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getPlaceStats = catchAsync(async (req, res, next) => {
  const stats = await Place.aggregate([
    {
      $match: { averageRatings: { $gte: 4 } },
    },
    {
      $group: {
        // _id: null,
        _id: '$averageRatings',
        numOfPlaces: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$averageRatings' },
        avgPrice: { $avg: 'price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    // {
    //   $project: {
    //     _id: 0,
    //   },
    // },
    {
      // sort the aggregations by {avgPrice or avgRating..etc} key stated above in ascending order (1)
      // $sort: { avgRating: 1 },
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
