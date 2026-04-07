const UserSkill = require('../models/UserSkill');
const LearningGoal = require('../models/LearningGoal');
const Match = require('../models/Match');
const User = require('../models/User');
const Skill = require('../models/skill');
const MatchReview = require('../models/matchreviews');
const { generateRoadmapForMatch } = require('../services/roadmapservice');


// POST /api/matches/find
exports.findMatch = async (req, res, next) => {
  try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
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
      matchApprovedByA: false,
      matchApprovedByB: false,
      createdAt: new Date()
    });

    await newMatch.save();
    await newMatch.populate([
      { path: 'teachSkillAId', select: 'name description category' },
      { path: 'teachSkillBId', select: 'name description category' },
      { path: 'userAId', select: 'name email profile points role' },
      { path: 'userBId', select: 'name email profile points role' },
      
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

// PUT /api/matches/:id/approve-match
exports.approvematch = async(req,res)=>{
 try {
        const matchId =req.params.id;
        const currentuserId = req.user.id;
        const match = await Match.findById(matchId);
        if(!match){
            return res.status(404).json({ success: false, error: "Match not found" })
        }
        if (match.userAId.toString() === currentuserId) {
            match.matchApprovedByA = true;
            if (match.matchApprovedByB) {
                match.status = 'active';
                match.activatedAt = new Date();
                await generateRoadmapForMatch(match._id);
            }
        } else if (match.userBId.toString() === currentuserId) {
            match.matchApprovedByB = true;
            if (match.matchApprovedByA) {
                match.status = 'active';
                match.activatedAt = new Date();
                await generateRoadmapForMatch(match._id);
            }
        } else {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }

        await match.save();

        await match.populate([
            { path: 'teachSkillAId', select: 'name description category' },
            { path: 'teachSkillBId', select: 'name description category' },
            { path: 'userAId', select: 'name email profile points role' },
            { path: 'userBId', select: 'name email profile points role' }
        ]);

        return res.status(200).json({ success: true, data: match });


     } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve proposal',
      message: error.message
    });
  }   
}

// GET /api/matches/my-matches
exports.getMyMatches = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
    const currentUserId = req.user.id;
    const matches = await Match.find({
      $or: [
        { userAId: currentUserId },
        { userBId: currentUserId }
      ]
    }).populate([
      { path: 'teachSkillAId', select: 'name category' },
      { path: 'teachSkillBId', select: 'name category' },
      { path: 'userAId', select: 'name email profile points role' },
      { path: 'userBId', select: 'name email profile points role' }
    ]);
    res.status(200).json({ success: true, data: matches });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to get matches',
      message: error.message
    });
  }
}

// GET /api/matches/requests
exports.getRequests = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
    const currentUserId = req.user.id;
    const requests = await Match.find({
   userBId: currentUserId,
   status: 'pending'
    }).populate([
      { path: 'teachSkillAId', select: 'name category' },
      { path: 'teachSkillBId', select: 'name category' },
      { path: 'userAId', select: 'name email profile points role' },
      { path: 'userBId', select: 'name email profile points role' },
    ]);
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to get requests',
      message: error.message
    });
  }
}
// POST /api/matches/:matchId/review
exports.reviewMatch = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" })
    }
    const matchId = req.params.matchId;
    const currentUserId = req.user.id;
    const { rating, review, comment } = req.body;
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ success: false, error: "Match not found" })
    }
    if (match.status !== 'completed') {
      return res.status(400).json({ success: false, error: "Match must be completed to be reviewed" })
    }
    if (match.userAId.toString() !== currentUserId && match.userBId.toString() !== currentUserId) {
      return res.status(403).json({ success: false, error: "Unauthorized" })
    }
    if(rating<1||rating>5){
            return res.status(400).json({ success: false, error: "review must be between 1 and 5" })

    }

    const newReview = new MatchReview({matchId,
      reviewerId: currentUserId,
      revieweeId: match.userAId.toString() === currentUserId ? match.userBId : match.userAId,
      rating,
      review,
      comment
    });
    await newReview.save();
    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to review match',
      message: error.message
    });
  }
}

// GET /api/matches/:matchId/review
exports.getMatchReview = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" })
    }
    const matchId = req.params.matchId;
    const currentUserId = req.user.id;
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ success: false, error: "Match not found" })
    }
    if (match.status !== 'completed') {
      return res.status(400).json({ success: false, error: "Match must be completed to be reviewed" })
    }
    if (match.userAId.toString() !== currentUserId && match.userBId.toString() !== currentUserId) {
      return res.status(403).json({ success: false, error: "Unauthorized" })
    }
    const matchReview = await MatchReview.find({matchId});
    res.status(200).json({ success: true, data: matchReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to get match review',
      message: error.message
    });
  }
}
