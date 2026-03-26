const mongoose = require('mongoose');

const learningGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  createdAt: { type: Date, default: Date.now }
});

learningGoalSchema.index({ userId: 1, skillId: 1 }, { unique: true });

module.exports = mongoose.model('LearningGoal', learningGoalSchema);