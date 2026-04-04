const UserSkill = require('../models/UserSkill');
const LearningGoal = require('../models/LearningGoal');
const Match = require('../models/Match');
const User = require('../models/User');
const Skill = require('../models/skill');
const RoadmapStep = require('../models/RoadMapStep');
const StepProgress = require('../models/StepProgress');
const { generateRoadmapForMatch } = require('../services/roadmapservice');

// GET /api/matches/:matchId/roadmap
exports.getRoadmap = async(req,res)=>{
    try {
        const currentUserId = req.user.id;
        const matchId = req.params.matchId;
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ success: false, error: "Match not found" });
        }
        if (currentUserId !== match.userAId.toString() && currentUserId !== match.userBId.toString()) {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }
        if (match.status !== 'active') {
            return res.status(400).json({ success: false, error: "Match is not active" });
        }
        const roadmap = await RoadmapStep.find({ matchId }).sort({ stepNumber: 1 });
        if (!roadmap || roadmap.length === 0) {
            return res.status(404).json({ success: false, error: "Roadmap not found" });
        }

        const safeRoadmap = roadmap.map(step => {
            const stepObj = step.toObject();
            if (stepObj.quiz && stepObj.quiz.questions) {
                stepObj.quiz.questions = stepObj.quiz.questions.map(q => {
                    const { correctAnswer, ...rest } = q;
                    return rest;
                });
            }
            return stepObj;
        });

        return res.status(200).json({ success: true, data: safeRoadmap });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to get roadmap',
            message: error.message
        });
    }
}


// POST /api/steps/:stepId/submit-quiz
exports.submitStepQuiz = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { stepId } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, error: 'Answers array is required' });
    }

    const step = await RoadmapStep.findById(stepId);
    if (!step) {
      return res.status(404).json({ success: false, error: 'Step not found' });
    }

    if (step.targetUserId.toString() !== currentUserId) {
      return res.status(403).json({ success: false, error: 'This step is not assigned to you' });
    }


    const match = await Match.findById(step.matchId);
    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }
    if (currentUserId !== match.userAId.toString() && currentUserId !== match.userBId.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }


    if (match.status !== 'active') {
      return res.status(400).json({ success: false, error: 'Match is not active' });
    }

    
    const totalQuestions = step.quiz.questions.length;
    if (answers.length !== totalQuestions) {
      return res.status(400).json({
        success: false,
        error: `Expected ${totalQuestions} answers, got ${answers.length}`
      });
    }

    if (step.stepNumber > 1) {
      const previousStep = await RoadmapStep.findOne({
        matchId: step.matchId,
        stepNumber: step.stepNumber - 1
      });
      if (previousStep) {
        const previousProgress = await StepProgress.findOne({
          stepId: previousStep._id,
          userId: previousStep.targetUserId,
          passed: true
        });
        if (!previousProgress) {
          return res.status(400).json({
            success: false,
            error: `The previous step (#${previousStep.stepNumber}) must be completed by the other user first`
          });
        }
      }
    }

    let correctCount = 0;
    for (let i = 0; i < totalQuestions; i++) {
      if (answers[i] === step.quiz.questions[i].correctAnswer) {
        correctCount++;
      }
    }
    const score = (correctCount / totalQuestions) * 100;
    const passed = score >= step.quiz.passingScore;

    try {
      const progress = new StepProgress({
        matchId: step.matchId,
        stepId: step._id,
        userId: currentUserId,
        score: score,
        passed: passed,
        completedAt: new Date()
      });
      await progress.save();
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ success: false, error: 'You have already submitted this step' });
      }
      throw err;
    }

    res.status(200).json({
      success: true,
      data: { score, passed, stepCompleted: passed }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit quiz',
      message: error.message
    });
  }
};