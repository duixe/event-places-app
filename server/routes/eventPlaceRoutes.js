const express = require('express');
const eventPlaceController = require('./../controllers/eventPlaceController');

const router = express.Router();

//val param actually holds the 'id' parameter
router.param('id', eventPlaceController.checkId);

router
  .route('/')
  .get(eventPlaceController.getAllPlaces)
  .post(eventPlaceController.checkBody, eventPlaceController.createPlace);
router
  .route('/:id')
  .get(eventPlaceController.getPlace)
  .patch(eventPlaceController.updatePlace)
  .delete(eventPlaceController.deletePlace);

module.exports = router;
