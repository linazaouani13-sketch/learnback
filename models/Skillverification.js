const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillTest', required: true },
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  verifiedAt: { type: Date, default: Date.now }
});


verificationSchema.index({ userId: 1, skillId: 1, verifiedAt: -1 });

module.exports = mongoose.model('UserSkillVerification', verificationSchema);