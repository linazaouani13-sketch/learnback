const express = require('express');
const router = express.Router();
const {findMatch } = require('../controllers/matchingcontroller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/find',authMiddleware,findMatch);


module.exports = router;