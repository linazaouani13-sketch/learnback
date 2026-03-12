const express = require('express');
const router = express.Router();
const { getprofile } = require('../controllers/usercontrollers');
const authMiddleware = require('../middlewares/authMiddleware');

//  GET /profile → getProfile (protected)
router.get('/profile', authMiddleware, getprofile);

module.exports = router;
