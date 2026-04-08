const express = require('express');
const router = express.Router();
const {addGoal,getUserGoal} = require('../controllers/learninggoalscontroller');
const authMiddleware = require('../middlewares/authmiddleware');


router.post('/newgoal',authMiddleware,addGoal);
router.get('/usergoal',authMiddleware,getUserGoal);



module.exports = router;
