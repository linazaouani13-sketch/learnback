const express = require('express');
const router = express.Router();
const {findMatch ,approvematch} = require('../controllers/matchingcontroller');
const {getRoadmap,submitStepQuiz} = require('../controllers/progresscontroller');
const authMiddleware = require('../middlewares/authMiddleware');




router.post('/find',authMiddleware,findMatch);
router.put('/:id/approve-match',authMiddleware,approvematch);
router.get('/:matchId/roadmap',authMiddleware,getRoadmap);
router.post('/steps/:stepId/submit-quiz',authMiddleware,submitStepQuiz);

module.exports = router;