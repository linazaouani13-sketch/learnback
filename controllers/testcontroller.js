const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const Skill = require('../models/skill');
const SkillTest =  require('../models/SkillTest')


// GET /api/tests/:skillId
exports.getTestBySkill = async(req,res)=>{
    try{ 
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
        const { skillId } = req.params;
        const test = await SkillTest.findOne({ skillId: skillId })
        if(!test){
            return res.status(404).json({ success: false, error: "Test not found" })
        }
        res.status(200).json({success:true,data:test})

    }catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }

    

}