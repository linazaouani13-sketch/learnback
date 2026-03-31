const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { generateSkillTest  } = require('../controllers/generateskilltestcontroller');
const {getTestBySkill}= require('../controllers/testcontroller');


router.post('/generate', authMiddleware , generateSkillTest);
router.get('/:skillId',authMiddleware,getTestBySkill);





module.exports = router;