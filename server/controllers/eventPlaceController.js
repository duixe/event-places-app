const Place = require('../models/eventPlaceModel');

exports.aliasTopPlaces = (req, res, next) => {
  req.query.limit = 10;
  req.query.sort = '-averageRatings,price';
  req.query.fields =
    'name,price,averageRatings,summary,location,booked,maxSize,location';
  next();
};

exports.getAllPlaces = async (req, res) => {
  try {
    // BUILD QUERY
    //FILTERING
    const queryObj = { ...req.query };
    const excludedStrings = ['page', 'sort', 'limit', 'fields'];
    excludedStrings.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Place.find(JSON.parse(queryStr));

    //SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-created_at');
    }

    //SPECIFIC FIELDS
    if (req.query.fields) {
      const specificFields = req.query.fields.split(',').join(' ');
      query = query.select(specificFields);
    } else {
      // Select everything except the '__v' field
      query = query.select('-__v');
    }

    //PAGINATION
    const pageNum = +req.query.page || 1;
    const limitValue = +req.query.limit || 50;
    const skipValue = (pageNum - 1) * limitValue;

    query = query.skip(skipValue).limit(limitValue);

    if (req.query.page) {
      const totalPlaces = await Place.countDocuments();
      if (skipValue >= totalPlaces) throw new Error('Page limit exceeded');
    }

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
