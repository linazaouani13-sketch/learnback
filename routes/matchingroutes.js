const express = require('express');
const router = express.Router();
const {findMatch ,approvematch,getMyMatches,getRequests,reviewMatch,getMatchReview, updateSourceLink} = require('../controllers/matchingcontroller');
const {getRoadmap,submitStepQuiz,getMatchProgress} = require('../controllers/progresscontroller');
const authMiddleware = require('../middlewares/authmiddleware');



router.get('/:matchId/progress',authMiddleware,getMatchProgress);
router.post('/find',authMiddleware,findMatch);
router.put('/:id/approve-match',authMiddleware,approvematch);
router.get('/:matchId/roadmap',authMiddleware,getRoadmap);
router.post('/steps/:stepId/submit-quiz',authMiddleware,submitStepQuiz);
router.get('/my-matches',authMiddleware,getMyMatches);
router.get('/requests',authMiddleware,getRequests);
router.post('/:matchId/review',authMiddleware,reviewMatch);
router.get('/:matchId/review',authMiddleware,getMatchReview);
router.put('/:matchId/source-link', authMiddleware, updateSourceLink);

module.exports = router;