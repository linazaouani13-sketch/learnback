const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  takenAt: { type: Date, default: Date.now }
});

quizResultSchema.index({ matchId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);