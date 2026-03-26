const express = require('express');
const { registerUser, loginUser, verifyEmail } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

//   POST /api/auth/register
router.post('/register', registerUser);

//   POST /api/auth/login
router.post('/login', loginUser);

//   GET /api/auth/verify-email?token=xxx
router.get('/verify-email', verifyEmail);

module.exports = router;
