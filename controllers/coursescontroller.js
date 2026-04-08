const User = require('../models/user');
const authMiddleware = require('../middlewares/authmiddleware');
const ProfessionalCourse = require('../models/professionalcourse');
const UserCourseUnlock = require('../models/userunlockcourses');
const createCourseSchema = require('../validations/createcoursevalidator');
const Skill = require('../models/skill');


// GET /api/courses/list
exports.listCourses = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" })
    }
    const courses = await ProfessionalCourse.find()
    res.status(200).json({ success: true, data: courses })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to list courses',
      message: error.message
    });
  }
}



// POST /api/courses/create (by admin)
exports.createCourse = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Access denied. Only admin is allowed." })
    }
    const { error, value } = createCourseSchema.validate(req.body);
    if (error) {
      const errors = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({ success: false, error: errors });
    }
    const { title, description, requiredPoints, content, difficulty } = value;

    const existingCourse = await ProfessionalCourse.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } });
    if (existingCourse) {
      return res.status(409).json({ success: false, error: 'Course already exists' });
    }
    const course = new ProfessionalCourse({
      title,
      description,
      requiredPoints,
      content,
      difficulty: difficulty || 'Beginner',
      postedBy: req.user.id,
      createdAt: new Date()
    });

    await course.save();
    res.status(201).json({ success: true, data: course });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to create course',
      message: error.message
    });
  }

}

// GET /api/courses/:id
exports.getcourse = async(req,res)=>{
  try {
     if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
    const course = await ProfessionalCourse.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
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

// POST /api/courses/:id/unlock
exports.unlockcourse = async(req,res)=>{
  try {
     if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
    const course = await ProfessionalCourse.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    const isUnlocked = await UserCourseUnlock.findOne({ userId: req.user.id, courseId: course._id });
    if (isUnlocked) {
      return res.status(400).json({ success: false, error: 'Course already unlocked' });
    }
    const user = await User.findById(req.user.id);    
    if (user.points < course.requiredPoints) {
      return res.status(400).json({ success: false, error: 'Insufficient points' });
    }
    user.points -= course.requiredPoints;
    await user.save();
    const userCourseUnlock = new UserCourseUnlock({
      userId: req.user.id,
      courseId: course._id,
      status: 'unlocked',
      unlockedAt: new Date()
    });
    await userCourseUnlock.save();
    res.status(200).json({ success: true, data: userCourseUnlock });
    } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to unlock course',
      message: error.message
    });
  }
}

// PUT /api/courses/:id/complete (mark course as completed)
exports.completecourse = async(req,res)=>{
try{
  if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
         const course = await ProfessionalCourse.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    const isUnlocked = await UserCourseUnlock.findOne({ userId: req.user.id, courseId: course._id });
    if (!isUnlocked) {
      return res.status(400).json({ success: false, error: 'Course not unlocked yet' });
    }
     if(isUnlocked.status === 'completed'){   
         return res.status(400).json({ success: false, error: 'Course already completed' });
}

  isUnlocked.status = 'completed';
  isUnlocked.completedAt = new Date();
  await isUnlocked.save();

  await User.findByIdAndUpdate(req.user.id, { $inc: { points: 100 } });

  res.status(200).json({ success: true, data: isUnlocked });
    
}catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark course as completed',
      message: error.message
    });
  }
}

// GET /api/users/courses
exports.getusercourses = async(req,res)=>{
  try {
     if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" })
        }
    const usercourses = await UserCourseUnlock.find({ userId: req.user.id });
    if (!usercourses) {
      return res.status(404).json({ success: false, error: 'User courses not found' });
    }
    res.status(200).json({ success: true, data: usercourses });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to get  user courses',
      message: error.message
    });
  }
}
