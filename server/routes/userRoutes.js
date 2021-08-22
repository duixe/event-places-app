const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const guard = require('../middleware/guardRoutes');

const router = express.Router();

//Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.patch(
  '/change-password',
  guard.guardRoute,
  authController.changePassword
);

router.patch('/update-profile', guard.guardRoute, userController.updateProfile);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
