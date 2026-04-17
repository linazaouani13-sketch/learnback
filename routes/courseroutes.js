const express = require('express');
const router = express.Router();
const { createCourse, listCourses,getcourse , unlockcourse,completecourse} = require('../controllers/coursescontroller');
const authMiddleware = require('../middlewares/authmiddleware');

// not tested
router.post('/create', authMiddleware, createCourse);
router.get('/list', authMiddleware, listCourses);
router.get('/:id', authMiddleware, getcourse);
router.post('/:id/unlock',authMiddleware,unlockcourse);
router.post('/:id/complete',authMiddleware,completecourse);
module.exports = router;