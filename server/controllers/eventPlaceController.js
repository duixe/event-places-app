const fs = require('fs');

const places = JSON.parse(
  fs.readFileSync(`${__dirname}/../test-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  console.log(`Event Place id is: ${val}`);
  if (req.params.id * 1 > places.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing Name of Price',
    });
  }
  next();
};

exports.getAllPlaces = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requested_at: req.requestTime,
    results: places.length,
    data: {
      places,
    },
  });
};

exports.getPlace = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      place,
    },
  });
};

exports.createPlace = (req, res) => {
  const newId = places[places.length - 1].id + 1;
  const newPlaces = Object.assign({ id: newId }, req.body);

  places.push(newPlaces);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(places),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          places: newPlaces,
        },
      });
    }
  );
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
  if (req.params.id * 1 > places.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
