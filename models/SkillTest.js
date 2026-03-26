const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: {
        type: [String],
        validate: [arr => arr.length >= 2, 'Must have at least 2 options.']
    },
    correctAnswer: { type: String, required: true }
});

const skillTestSchema = new mongoose.Schema({
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    questions: {
        type: [questionSchema],
        validate: [array => array.length === 5, 'Skill test must have exactly 5 questions.'],
        required: true
    },
    passingScore: { type: Number, required: true, min: 1, max: 100 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SkillTest', skillTestSchema);