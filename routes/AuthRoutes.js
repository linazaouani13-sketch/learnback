const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyEmail } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');



router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email', verifyEmail);

module.exports = router;
