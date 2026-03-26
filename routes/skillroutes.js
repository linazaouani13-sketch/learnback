const express = require('express');
const router = express.Router();
const { createSkill, listSkill } = require('../controllers/Skillscontroller');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/create', authMiddleware, createSkill);
router.get('/list', authMiddleware, listSkill);


module.exports = router;