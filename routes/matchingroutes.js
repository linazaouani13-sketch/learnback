const express = require('express');
const router = express.Router();
const {findMatch ,approvematch} = require('../controllers/matchingcontroller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/find',authMiddleware,findMatch);
router.put('/:id/approve-match',authMiddleware,approvematch);


module.exports = router;