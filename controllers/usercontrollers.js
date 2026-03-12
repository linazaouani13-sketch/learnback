const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// get profile
exports.getprofile= async (req, res) => {
  try {


  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

}