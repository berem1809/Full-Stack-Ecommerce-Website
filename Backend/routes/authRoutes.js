const express = require('express');
const { registerUser,loginUser } = require('../controllers/authController');
const router = express.Router(); // Correctly call express.Router as a function

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

module.exports = router;