const express = require('express');
const router = express.Router();
const { createSkill, listSkill } = require('../controllers/skillscontroller');
const authMiddleware = require('../middlewares/authmiddleware');


router.post('/create', authMiddleware, createSkill);
router.get('/list', authMiddleware, listSkill);


module.exports = router;