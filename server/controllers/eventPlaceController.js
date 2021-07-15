const Place = require('../models/eventPlaceModel');

exports.getAllPlaces = async (req, res) => {
  try {
    const eventPlaces = await Place.find();
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
      message: 'Invalid data sent',
    });
  }
};

exports.updatePlace = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      place: '<Updated Place Here...>',
    },
  });
};

exports.deletePlace = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
