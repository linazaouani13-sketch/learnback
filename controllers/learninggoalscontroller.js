const User = require('../models/user');
const Skill = require('../models/skill');
const UserSkill = require('../models/userskill');
const addgoalSchema = require('../validations/goalsvalidator');
const LearningGoal = require('../models/learninggoal');


// POST /api/goals/add
exports.addGoal = async (req,res)=>{
        try{
        if (!req.user || !req.user.id) {
            return res.status(401).json({success: false, error : "Unauthorized" })
        }
     const { error, value } =addgoalSchema.validate(req.body);
        if (error) {
            const errors = error.details.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return res.status(400).json({ success: false, error: errors });
        }
        
          const { skillId} = value;
          const userId = req.user.id;
          const SkillResult = await Skill.findById(skillId);
          if (!SkillResult){
             return res.status(404).json({ success: false, error: "Skill not found" });
          }

          const existinggoal = await LearningGoal.findOne({skillId,userId });
          if(existinggoal){
            return res.status(400).json({ success: false, error: "Goal already exists" })
          }
           const learningGoal = new LearningGoal({
            userId,
            skillId,
           })
             await learningGoal.save();
    
           res.status(201).json({success:true,data:learningGoal})
           
    } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add learning goal',
      message: error.message  });
  }

}

// GET /api/goals/usergoal
 exports.getUserGoal = async (req,res)=>{
        try{
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
        const userId = req.user.id;
        const learningGoal = await LearningGoal.find({userId}).populate('skillId','name');
        res.status(200).json({success:true,data:learningGoal})
         
    } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch learning goals',
      message: error.message  });
  }

}