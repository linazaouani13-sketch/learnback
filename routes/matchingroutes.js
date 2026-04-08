const express = require('express');
const router = express.Router();
const {findMatch ,approvematch,getMyMatches,getRequests,reviewMatch,getMatchReview} = require('../controllers/matchingcontroller');
const {getRoadmap,submitStepQuiz,getMatchProgress} = require('../controllers/progresscontroller');
const authMiddleware = require('../middlewares/authmiddleware');



router.get('/:matchId/progress',authMiddleware,getMatchProgress);
router.post('/find',authMiddleware,findMatch);
router.put('/:id/approve-match',authMiddleware,approvematch);
router.get('/:matchId/roadmap',authMiddleware,getRoadmap);
router.post('/steps/:stepId/submit-quiz',authMiddleware,submitStepQuiz);
router.get('/my-matches',authMiddleware,getMyMatches);// not tested
router.get('/requests',authMiddleware,getRequests);// not tested
router.post('/:matchId/review',authMiddleware,reviewMatch);// not tested
router.get('/:matchId/review',authMiddleware,getMatchReview);// not tested

module.exports = router;