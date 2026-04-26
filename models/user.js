const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: ''
  },
  profile: {
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  points: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationToken: { type: String },
  tokenExpires: { type: Date }
}, {
  timestamps: true 

}
);

module.exports = mongoose.model('User', UserSchema);