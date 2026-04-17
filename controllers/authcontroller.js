const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendemail');
const { getVerificationEmailTemplate } = require('../utils/emailTemplates');
const { registerSchema, loginSchema } = require('../validations/authValidator');

  // Register a new user
//    POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({ success: false, errors });
    }

    const { name, email, password, role } = value;

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role || 'student',
      verificationToken,
      tokenExpires: Date.now() + 24 * 60 * 60 * 1000  // 24 hours
    });

    await newUser.save();

    const verifyUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${verificationToken}`;
    await sendEmail(
      email,
      'Verify your LearnBack account',
      getVerificationEmailTemplate(name, verifyUrl, process.env.CLIENT_URL)
    );

    res.status(201).json({
      success: true,
      data: 'Registration successful! Please check your email to verify your account.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: error.message
    });
  }
};

//     Verify email
//    GET /api/auth/verify-email?token=xxx

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({  success: false, error: 'Token is required' });
    }

    const user = await User.findOne({
      verificationToken: token,
      tokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({  success: false, error: 'Invalid or expired token' });
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.tokenExpires = undefined;
    await user.save();

    res.status(200).json({success: true, data: 'Email verified successfully! You can now log in.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Verification failed',
      message: error.message  });
  }

};


//    Login user
//   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {

    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }
    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid email or password' });
    }

   
    if (!user.verified) {
      return res.status(403).json({ success: false, error: 'Please verify your email before logging in' });
    }

   
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

   
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
};



// TODO: Password reset – "Forgot password" functionality.
// TODO: Logout – Invalidate tokens or clear sessions.
