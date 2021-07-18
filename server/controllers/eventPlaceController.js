const Place = require('../models/eventPlaceModel');

exports.getAllPlaces = async (req, res) => {
  try {
    // BUILD QUERY
    const queryObj = { ...req.query };
    const excludedStrings = ['page', 'sort', 'limit', 'fields'];
    excludedStrings.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    const query = Place.find(JSON.parse(queryStr));

    // EXECUTE QUERY
    const eventPlaces = await query;

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
