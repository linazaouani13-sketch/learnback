const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// get profile
exports.getprofile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        
        const user = await User.findById(req.user.id).select('-passwordHash')
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        res.status(200).json(user)


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}