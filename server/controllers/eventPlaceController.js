const Place = require('../models/eventPlaceModel');
const APIFeatures = require('../utils/placesAPIFeature');

exports.aliasTopPlaces = (req, res, next) => {
  req.query.limit = 10;
  req.query.sort = '-averageRatings,price';
  req.query.fields =
    'name,price,averageRatings,summary,location,booked,maxSize,location';
  next();
};

exports.getAllPlaces = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getPlace = async (req, res) => {
  try {
    const eventPlace = await Place.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        eventPlace,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createPlace = async (req, res) => {
  try {
    const newEventPlace = await Place.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        places: newEventPlace,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updatePlace = async (req, res) => {
  const updatedEventPlace = await Place.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  try {
    res.status(200).json({
      status: 'success',
      data: {
        updatedEventPlace,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deletePlace = async (req, res) => {
  // not a good practise to send back the deleted doc
  await Place.findByIdAndDelete(req.params.id);
  try {
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(204).json({
      status: 'fail',
      message: err,
    });
  }
};
