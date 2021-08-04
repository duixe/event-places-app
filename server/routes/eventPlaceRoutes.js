const express = require('express');
const eventPlaceController = require('../controllers/eventPlaceController');
const guard = require('../middleware/guardRoutes');

const router = express.Router();

//val param actually holds the 'id' parameter
// router.param('id', eventPlaceController.checkId);

router
  .route('/top-5-places')
  .get(eventPlaceController.aliasTopPlaces, eventPlaceController.getAllPlaces);

router.route('/place-stats').get(eventPlaceController.getPlaceStats);

router
  .route('/')
  .get(guard.guardRoute, eventPlaceController.getAllPlaces)
  .post(eventPlaceController.createPlace);

router
  .route('/:id')
  .get(eventPlaceController.getPlace)
  .patch(eventPlaceController.updatePlace)
  .delete(eventPlaceController.deletePlace);

module.exports = router;
