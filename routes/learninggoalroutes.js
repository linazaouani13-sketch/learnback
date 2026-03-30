const express = require('express');
const router = express.Router();
const {addGoal,getusergoal} = require('../controllers/learninggoalscontroller');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/newgoal',authMiddleware,addGoal);
router.get('/usergoal',authMiddleware,getusergoal);


module.exports = router;
