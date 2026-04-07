const express = require('express');
const router = express.Router();
const { getskillbyid,getuserskill,getallmatches,getmatchbyid,getallcourses,getcoursebyid,deleteuser, getallusers, forceupdatematch} = require('../controllers/admincontroller');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/skills/:skillId',authMiddleware,getskillbyid);
router.get('/users/:userId/skills',authMiddleware,getuserskill);
router.get('/users',authMiddleware,getallusers);
router.get('/matches',authMiddleware,getallmatches);
router.get('/matches/:matchId',authMiddleware,getmatchbyid);
router.get('/courses',authMiddleware,getallcourses);
router.get('/courses/:courseId',authMiddleware,getcoursebyid);
router.delete('/users/:userId',authMiddleware,deleteuser);
router.put('/matches/:matchId/force-update',authMiddleware,forceupdatematch);

module.exports = router;
