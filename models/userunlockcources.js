const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfessionalCourse', required: true },
  status: { type: String, enum: ['unlocked', 'locked','completed'], default: 'locked' },
  unlockedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model('UserCourseUnlock', UserSchema);