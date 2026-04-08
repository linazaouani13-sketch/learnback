const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const { generateSkillTest  } = require('../controllers/generateskilltestcontroller');
const {getTestBySkill,takeTest,getverifications}= require('../controllers/testcontroller');


router.post('/generate', authMiddleware , generateSkillTest);
router.get('/verification',authMiddleware,getverifications);
router.get('/:skillId',authMiddleware,getTestBySkill);
router.post('/:testId/take',authMiddleware, takeTest);



module.exports = router;