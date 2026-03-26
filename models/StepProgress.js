const mongoose = require('mongoose');

const stepProgressSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  stepId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoadmapStep', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['locked', 'available', 'completed'],
    default: 'locked'
  },
  quizResult: {
    score: { type: Number },
    passed: { type: Boolean },
    takenAt: { type: Date }
  },
});

stepProgressSchema.index({ matchId: 1, stepId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('StepProgress', stepProgressSchema);
