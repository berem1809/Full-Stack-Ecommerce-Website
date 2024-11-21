const express = require('express');
const { registerUser,loginUser , logoutUser} = require('../controllers/authController');
const router = express.Router(); // Correctly call express.Router as a function

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

module.exports = router;