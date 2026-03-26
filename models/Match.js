const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  userAId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userBId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teachSkillAId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  teachSkillBId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' },
  roadmapApprovedByA: { type: Boolean, default: false },
  roadmapApprovedByB: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  activatedAt: Date,
  completedAt: Date
});

module.exports = mongoose.model('Match', matchSchema);