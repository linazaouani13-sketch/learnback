const express = require('express');
const router = express.Router();
const { getprofile, putprofile, getpoints, adduserskill,getuserskill,getuserreviews } = require('../controllers/usercontrollers');
const {getusercourses} = require('../controllers/coursescontroller');
const authMiddleware = require('../middlewares/authmiddleware');

router.get('/profile', authMiddleware, getprofile);
router.put('/profile', authMiddleware, putprofile);
router.get('/points',authMiddleware,getpoints);
router.post('/addskill',authMiddleware,adduserskill);
router.get('/getskill', authMiddleware ,getuserskill);
router.get('/getusercourses', authMiddleware ,getusercourses);
router.get('/:userId/userreviews',authMiddleware,getuserreviews);
module.exports = router;
