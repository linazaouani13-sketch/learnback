const express = require('express');
const router = express.Router();
const { getprofile, putprofile, getpoints } = require('../controllers/usercontrollers');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, getprofile);
router.put('/profile', authMiddleware, putprofile);
router.get('/points',authMiddleware,getpoints);
module.exports = router;
