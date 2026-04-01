const User = require('../models/User');
const Skill = require('../models/skill');
const SkillTest = require('../models/SkillTest');
const UserSkill = require('../models/UserSkill');
const UserSkillVerification = require('../models/Skillverification');
const takeTestSchema = require('../validations/answervalidator');

// GET /api/tests/:skillId
exports.getTestBySkill = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
        const { skillId } = req.params;
        const test = await SkillTest.findOne({ skillId: skillId }).select('-questions.correctAnswer');

        if (!test) {
            return res.status(404).json({ success: false, error: "Test not found" })
        }
        res.status(200).json({ success: true, data: test })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to get test',
            message: error.message
        });


    }
}

// POST /api/tests/:testId/take
exports.takeTest = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
        const { testId } = req.params
        const userId = req.user.id

        const { error, value } = takeTestSchema.validate(req.body);
        if (error) {
            const errors = error.details.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return res.status(400).json({ success: false, error: errors });
        }

        const test = await SkillTest.findById(testId);
        if (!test) {
            return res.status(404).json({ success: false, error: "Test not found" })
        }

        const { answers } = value;
        if (answers.length !== test.questions.length) {
            return res.status(400).json({ success: false, error: 'Incorrect number of answers' });
        }

        let correctCount = 0;
        for (let i = 0; i < test.questions.length; i++) {
            if (answers[i] === test.questions[i].correctAnswer) {
                correctCount++;
            }
        }

        const score = (correctCount / test.questions.length) * 100;
        const passed = score >= test.passingScore;

        const verification = new UserSkillVerification({
            userId,
            skillId: test.skillId,
            testId,
            score,
            passed,
            verifiedAt: new Date()
        });
        await verification.save();

        if (passed) {
            const existingSkill = await UserSkill.findOne({ userId, skillId: test.skillId });
            if (!existingSkill) {
                const newSkill = new UserSkill({
                    userId,
                    skillId: test.skillId,
                    level: test.level,
                    source: 'verified',
                    addedAt: new Date()
                });
                await newSkill.save();
            } else if (existingSkill.source !== 'verified') {
                existingSkill.source = 'verified';
                await existingSkill.save();
            }
        }

        res.status(200).json({
            success: true,
            data: {
                score,
                passed,
                verification: verification._id
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to process test submission',
            message: error.message
        });
    }
}

// GET /api/tests/resultverifications
exports.getverifications = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
        const userId = req.user.id;

        const verifications = await UserSkillVerification.find({ userId })
      .populate('skillId', 'name description category') 
      .populate('testId', 'level passingScore')         
      .sort({ verifiedAt: -1 });                         
    res.status(200).json({ success: true, data: verifications });

 } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch verifications',
            message: error.message
        });
    }
}