const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

//     Register a new user
//    POST /api/auth/register

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    //  check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    //  only @estin.dz is allowed
    if (!email.endsWith('@estin.dz')) {
      return res.status(400).json({ message: 'Only @estin.dz emails are allowed' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate a random verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create new user with verification token
    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role || 'student',
      verificationToken,
      tokenExpires: Date.now() + 24 * 60 * 60 * 1000  // 24 hours
    });

    // Save to database
    await newUser.save();

    // Build verification link and send email
    const verifyUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${verificationToken}`;

    await sendEmail(
      email,
      'Verify your LearnBack account',
      `<h2>Welcome to LearnBack, ${name}!</h2>
       <p>Please click the link below to verify your email:</p>
       <a href="${verifyUrl}">Click here to verify</a>
       <p>This link expires in 24 hours.</p>`
    );

    // Respond (NO JWT — user must verify email first)
    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//     Verify email
//    GET /api/auth/verify-email?token=xxx

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Find user with this token that hasn't expired
    const user = await User.findOne({
      verificationToken: token,
      tokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Mark as verified and clear token
    user.verified = true;
    user.verificationToken = undefined;
    user.tokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//     Login user
//    POST /api/auth/login

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// TODO: Password reset – "Forgot password" functionality.
// TODO: Logout – Invalidate tokens or clear sessions.
