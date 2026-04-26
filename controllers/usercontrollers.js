const User = require('../models/user');
const Skill = require('../models/skill');
const UserSkill = require('../models/userskill');
const MatchReview = require('../models/matchreviews');

const updateProfileSchema = require('../validations/uppfvalidator')
const adduserskillSchema = require('../validations/addskillvalidator');




// GET /api/users/profile
// get profile
exports.getprofile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }

        const user = await User.findById(req.user.id).select('-passwordHash')
        if (!user) {
            return res.status(404).json({  success: false, error: "user not found" })
        }
        res.status(200).json({ success: true, data: user });


    } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get profile',
      message: error.message  });
  }


}
// PUT /api/users/profile
// updateprofile
exports.putprofile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({  success: false, error: "Unauthorized" })
        }

        const user = await User.findById(req.user.id).select('-passwordHash')
        if (!user) {
            return res.status(404).json({  success: false, error: "user not found" })
        }

        const { error, value } = updateProfileSchema.validate(req.body);
        if (error) {
            const errors = error.details.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return res.status(400).json({ success: false, error: errors });
        }

        if (value.name) {
            user.name = value.name;
        }

        if (value.phoneNumber) {
            user.phoneNumber = value.phoneNumber;
        }

        if (value.profile) {
            // Merge the new profile fields into existing ones
            user.profile = {
                ...user.profile.toObject(),
                ...value.profile
            };
        }

        await user.save();

        // Return without password
        const updatedUser = user.toObject();
        delete updatedUser.passwordHash;

        res.status(200).json({
            success: true,
            data: updatedUser
        });

    } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update profile',
      message: error.message  });
  }

}
//  GET /API/USERS/POINTS
    exports.getpoints = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({  success: false, error: "Unauthorized" })
        }
        const user = await User.findById(req.user.id).select('points')
        if (!user) {
            return res.status(404).json({ success: false, error: "user not found" })
        }
        res.status(200).json({ success: true, data: { points: user.points }})


    } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch points',
      message: error.message  });
  }

}

// POST/API/USERS/SKILL 
    exports.adduserskill = async (req, res) => {
         try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
     const { error, value } =adduserskillSchema.validate(req.body);
        if (error) {
            const errors = error.details.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return res.status(400).json({ success: false, error: errors });
        }
          const userId = req.user.id;
          const { skillId, level } = value;


          const SkillResult = await Skill.findById(skillId);
          if (!SkillResult) {
            return res.status(404).json({ success: false, error: "Skill not found" });
          }

          const existingskill = await UserSkill.findOne({ userId, skillId });
          if (existingskill) {
            return res.status(400).json({ success: false, error: "User already has this skill" });
          }
           const userSkill = new UserSkill({
            userId,
            skillId,
            level,
            source: 'self-reported',
            addedAt: new Date(),
           })
             await userSkill.save();
    
            // Award points for first skill
            const skillCount = await UserSkill.countDocuments({ userId });
            if (skillCount === 1) {
                await User.findByIdAndUpdate(userId, { $inc: { points: 5 } });
            }
    
           res.status(201).json({success:true,data:userSkill})
    } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add user skill',
      message: error.message  });
  }

        }

 
// GET/API/USERS/SKILL        
exports.getuserskill = async (req,res)=>{
    try{
        if (!req.user || !req.user.id) {
            return res.status(401).json({  success: false, error: "Unauthorized" })
        }
        const userId = req.user.id
        const skills = await UserSkill.find({ userId }).populate('skillId','name category');
        res.status(200).json({success:true,data:skills})
    } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user skills',
      message: error.message  });
  }


}
// GETT/API/USERS/:userId/reviews
exports.getuserreviews = async (req,res)=>{
    try{
        if (!req.user || !req.user.id) {
            return res.status(401).json({  success: false, error: "Unauthorized" })
        }
        const userId = req.params.userId
        const reviews = await MatchReview.find({ revieweeId: userId }).populate('matchId','userAId userBId teachSkillAId teachSkillBId');
        res.status(200).json({success:true,data:reviews})
    } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user reviews',
      message: error.message  });
  }
}


// GET /api/users/:userId/contact
exports.getContactInfo = async (req, res) =>{
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('email phoneNumber');

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        res.status(200).json({
            success: true,
            data: {
                email: user.email,
                phoneNumber: user.phoneNumber || "Not provided"
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch contact info',
            message: error.message
        });
    }
}
