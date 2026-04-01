const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const createSkillSchema = require('../validations/creatskillvalidator');
const Skill = require('../models/skill');


// POST /api/Skills/create (by admin)
 exports.createSkill = async (req, res) => {
    try {
    if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: "Access denied. Only admin is allowed." })
        }
        const { error, value } = createSkillSchema.validate(req.body);
        if (error) {
            const errors = error.details.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return res.status(400).json({ success: false, error: errors });
        }
        const {name,description,category}=value;

  const existingSkill = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingSkill) {
      return res.status(409).json({ success: false, error: 'Skill already exists' });
    } 
    const skill = new Skill({
      name,
      description: description || '',
      category: category || 'General'
    });

    await skill.save();
    res.status(201).json({ success: true, data: skill });

    } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create skill',
      message: error.message  });
  }

}


//GET/api/Skills/list 
exports.listSkill = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
        const skills =await Skill.find() 
        res.status(200).json({success:true,data:skills})
     } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to list skills',
      message: error.message  });
  }
  
}



