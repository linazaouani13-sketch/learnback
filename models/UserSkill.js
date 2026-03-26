const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    addedAt: { type: Date, default: Date.now },
    source: { type: String, enum: ['self-reported', 'verified', 'match-completion'], default: 'self-reported' }
});

userSkillSchema.index({ userId: 1, skillId: 1 }, { unique: true });

module.exports = mongoose.model('UserSkill', userSkillSchema);