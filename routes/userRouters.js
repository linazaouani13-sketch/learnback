const express = require('express');
const router = express.Router();
const { getprofile, putprofile, getpoints, adduserskill,getuserskill } = require('../controllers/usercontrollers');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, getprofile);
router.put('/profile', authMiddleware, putprofile);
router.get('/points',authMiddleware,getpoints);
router.post('/addskill',authMiddleware,adduserskill);
router.get('/getskill', authMiddleware ,getuserskill)
module.exports = router;
