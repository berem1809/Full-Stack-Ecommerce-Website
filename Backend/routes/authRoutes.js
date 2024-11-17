const express = require('express');
const { registerUser } = require('../controllers/authController');
const router = express.Router(); // Correctly call express.Router as a function

router.route('/register').post(registerUser);

module.exports = router;