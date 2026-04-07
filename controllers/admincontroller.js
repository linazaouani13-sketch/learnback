const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const ProfessionalCourse = require('../models/ProfessionalCourse');
const UserCourseUnlock = require('../models/userunlockcources');
const Skill = require('../models/skill');
const Match = require('../models/Match');
const UserSkill = require('../models/UserSkill');
const LearningGoal = require('../models/LearningGoal');
const StepProgress = require('../models/StepProgress');
const RoadmapStep = require('../models/RoadMapStep');
const UserSkillVerification = require('../models/Skillverification');
const MatchReview = require('../models/matchreviews');
const QuizResult = require('../models/QuizResult');


// // PUT /api/admin/upgrad/:userId
// exports.upgradeUser = async (req, res) => {
//     try {
//         if (!req.user || !req.user.id) {
//             return res.status(401).json({ success: false, error: "Unauthorized" })
//         }
//         const userId = req.params.userId
//         const user = await User.findById(userId)
//         if (!user) {
//             return res.status(404).json({ success: false, error: 'User not found' })
//         }
//         user.role = 'admin'
//         await user.save()
//         res.status(200).json({ success: true, data: user })
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             error: 'Failed to upgrade user',
//             message: error.message
//         });
//     }
// }

// // PUT /api/admin/downgrade/:userId (by admin )
// // IN CASE IF A USER GET THE ADMIN ROLE BY MISTAKE OR BY ANY OTHER REASON 
// exports.downgradeUser = async (req, res) => {
//     try {
//         if (!req.user || !req.user.id) {
//             return res.status(401).json({ success: false, error: "Unauthorized" })
//         }
//         const admin = await User.findById(req.user.id)
//         if (!admin || admin.role !== 'admin') {
//             return res.status(403).json({ success: false, error: 'Forbidden' })
//         }
//         const userId = req.params.userId
//         const user = await User.findById(userId)
//         if (!user) {
//             return res.status(404).json({ success: false, error: 'User not found' })
//         }
//         user.role = 'user'
//         await user.save()
//         res.status(200).json({ success: true, data: user })
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             error: 'Failed to downgrade user',
//             message: error.message
//         });
//     }
// }



// GET /api/admin/users
// lisr all users 
exports.getallusers = async (req,res)=>{
    try{
        if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" })
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Access denied. Only admin is allowed." })
    }
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });   

        } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to get all users',
            message: error.message
        });
    }
}

// GET /api/admin/users/:userId
exports.getuserbyid = async (req,res)=>{
try{
        if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" })
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Access denied. Only admin is allowed." })
    }
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, data: user });   

        } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to get all users',
            message: error.message
        });
    }
}

// GET /api/admin/skills/:skillId
exports.getskillbyid = async (req,res)=>{
try{
        if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" })
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Access denied. Only admin is allowed." })
    }
    const skill = await Skill.findById(req.params.skillId);
    if (!skill) {
        return res.status(404).json({ success: false, error: "Skill not found" });
    }
    res.status(200).json({ success: true, data: skill });   

        } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to get all skills',
            message: error.message
        });
    }
}


// GET /api/admin/courses
exports.getallcourses = async (req,res)=>{
    try{
        if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" })
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Access denied. Only admin is allowed." })
    }
    const courses = await ProfessionalCourse.find();
    res.status(200).json({ success: true, data: courses });   

        } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to get all courses ',
            message: error.message
        });
    }
}

// GET /api/admin/courses/:courseId
exports.getcoursebyid = async (req,res)=>{
try{
        if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" })
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Access denied. Only admin is allowed." })
    }
    const course = await ProfessionalCourse.findById(req.params.courseId);
    if (!course) {
        return res.status(404).json({ success: false, error: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });   

        } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to get course',
            message: error.message
        });
    }
}


// GET /api/admin/users/:userId/skills
exports.getuserskill = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: "Access denied" })
        }
        const skills = await UserSkill.find({ userId: req.params.userId }).populate('skillId', 'name category');
        res.status(200).json({ success: true, data: skills });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user skills',
            message: error.message
        });
    }
}

// GET /api/admin/matches
exports.getallmatches = async (req,res)=>{
    try{
        if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" })
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Access denied. Only admin is allowed." })
    }
    const matches = await Match.find();
    res.status(200).json({ success: true, data: matches });   

        } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to get all matches ',
            message: error.message
        });
    }
}

// GET /api/admin/matches/:matchId
exports.getmatchbyid = async (req,res)=>{
try{
        if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" })
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Access denied. Only admin is allowed." })
    }
    const match = await Match.findById(req.params.matchId);
    if (!match) {
        return res.status(404).json({ success: false, error: "Match not found" });
    }
    res.status(200).json({ success: true, data: match });   

        } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to get all matches',
            message: error.message
        });
    }
}
// DELETE /api/admin/users/:id 
exports.deleteuser = async (req,res)=>{
try{
        if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" })
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Access denied. Only admin is allowed." })
    }
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
    }
    
    await User.findByIdAndDelete(userId);
    await UserSkill.deleteMany({ userId });
    await LearningGoal.deleteMany({ userId });
    await MatchReview.deleteMany({ $or: [{ revieweeId: userId }, { reviewerId: userId }] });
    await Match.deleteMany({ $or: [{ userAId: userId }, { userBId: userId }] });
    await ProfessionalCourse.deleteMany({ postedBy: userId });
    await UserCourseUnlock.deleteMany({ userId });
    await StepProgress.deleteMany({ userId });
    await RoadmapStep.deleteMany({ targetUserId: userId });
    await UserSkillVerification.deleteMany({ userId });
    await QuizResult.deleteMany({ userId });
    
    res.status(200).json({ success: true, message: "User and all related data deleted successfully" });   

        } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to get all users',
            message: error.message
        });
    }
}

// PUT /api/admin/matches/:id – force update match status.
exports.forceupdatematch = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
        const admin = await User.findById(req.user.id)
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Forbidden' })
        }
        const matchId = req.params.matchId
        const match = await Match.findById(matchId)
        if (!match) {
            return res.status(404).json({ success: false, error: 'match not found' })
        }
        match.status = req.body.status;
        await match.save()
        res.status(200).json({ success: true, data: match })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to force update match',
            message: error.message
        });
    }
}
