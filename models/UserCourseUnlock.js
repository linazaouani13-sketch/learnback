const mongoose = require('mongoose');

const unlockSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfessionalCourse', required: true },
  status: { type: String, enum: ['unlocked', 'enrolled', 'completed'], default: 'unlocked' },
  unlockedAt: { type: Date, default: Date.now },
  enrolledAt: Date,
  completedAt: Date
});

unlockSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('UserCourseUnlock', unlockSchema);