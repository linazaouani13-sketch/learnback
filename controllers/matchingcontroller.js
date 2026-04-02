const UserSkill = require('../models/UserSkill');
const LearningGoal = require('../models/LearningGoal');
const Match = require('../models/Match');
const User = require('../models/User');
const Skill = require('../models/skill');


// POST /api/matches/find
exports.findMatch = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const { learnSkillId } = req.body;

    if (!learnSkillId) {
      return res.status(400).json({ success: false, error: 'learnSkillId is required' });
    }

    const isitgoal = await LearningGoal.findOne({ userId: currentUserId, skillId: learnSkillId });
    if (!isitgoal) {
      return res.status(400).json({ success: false, error: 'You do not have this skill in your learning goals' });
    }

    const  isitowned = await UserSkill.find({ userId: currentUserId }).select('skillId');
    if (isitowned.length === 0) {
      return res.status(400).json({ success: false, error: 'You have no skills to teach' });
    }
    const myOwnedIds = isitowned.map(s => s.skillId.toString());

    // 3. Find candidates who own learnSkillId and want to learn at least one of my owned skills
    // First, find users who own learnSkillId (excluding self and those with existing pending/active matches)
    const existingMatches = await Match.find({
      $or: [
        { userAId: currentUserId, status: { $in: ['pending', 'active'] } },
        { userBId: currentUserId, status: { $in: ['pending', 'active'] } }
      ]
    });
    const excludedUserIds = existingMatches.map(m => 
      m.userAId.toString() === currentUserId ? m.userBId.toString() : m.userAId.toString()
    );
    excludedUserIds.push(currentUserId);

    // Users who can teach me 
    const skillOwners = await UserSkill.find({ skillId: learnSkillId })
      .where('userId').nin(excludedUserIds)
      .select('userId');
    const candidateIds = [...new Set(skillOwners.map(s => s.userId.toString()))];

    if (candidateIds.length === 0) {
      return res.status(404).json({ success: false, error: 'No one can teach this skill right now' });
    }

    //  check if other users want to learn my skills
    let bestCandidate = null;
    let chosenTeachSkillId = null;

    for (const candidateId of candidateIds) {
      const candidateGoals = await LearningGoal.find({ userId: candidateId }).select('skillId');
      const candidateGoalIds = candidateGoals.map(g => g.skillId.toString());
      const commonSkill = myOwnedIds.find(id => candidateGoalIds.includes(id));
      if (commonSkill) {
        bestCandidate = candidateId;
        chosenTeachSkillId = commonSkill; 
        break;
      }
    }

    if (!bestCandidate) {
      return res.status(404).json({ success: false, error: 'No compatible match found' });
    }

    // Create match
    const newMatch = new Match({
      userAId: currentUserId,
      userBId: bestCandidate,
      teachSkillAId: chosenTeachSkillId,
      teachSkillBId: learnSkillId,
      status: 'pending',
      roadmapApprovedByA: false,
      roadmapApprovedByB: false,
      createdAt: new Date()
    });

    await newMatch.save();
    await newMatch.populate([
      { path: 'teachSkillAId', select: 'name description category' },
      { path: 'teachSkillBId', select: 'name description category' },
      { path: 'userAId', select: 'name email profile points role' },
      { path: 'userBId', select: 'name email profile points role' }
    ]);
    res.status(201).json({ success: true, data: newMatch });
  } catch (err) {
    console.error(err);
        res.status(500).json({
            success: false,
            error: 'Failed to find a match ',
            message: err.message
        });
  }
};