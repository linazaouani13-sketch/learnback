const mongoose = require('mongoose');

const stepQuizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }
});

const roadmapStepSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stepNumber: { type: Number, required: true },
  description: { type: String, required: true },
  deadline: Date,
  quiz: {
    questions: { type: [stepQuizQuestionSchema], required: true },
    passingScore: { type: Number, required: true, min: 1, max: 100 }
  }
});

roadmapStepSchema.index({ matchId: 1, stepNumber: 1 }, { unique: true });

module.exports = mongoose.model('RoadmapStep', roadmapStepSchema);