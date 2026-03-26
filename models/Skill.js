const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    trim: true,
    default: 'General',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', SkillSchema);