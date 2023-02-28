const express = require('express');
const {
  registerUser,
  authUser,
  getAllUsers,
} = require('../controllers/userControllers');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser);
router.route('/').get(protect, getAllUsers);
router.route('/login').post(authUser);

module.exports = router;
