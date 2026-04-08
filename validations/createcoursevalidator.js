const Joi = require('joi');
const createCourseSchema = Joi.object({
  title: Joi.string().required().min(1).max(100),
  description: Joi.string().optional().max(500),
  requiredPoints: Joi.number().required().min(0),
  content: Joi.string().required(),
  difficulty: Joi.string().required().valid('Beginner', 'Intermediate', 'Advanced')
});

module.exports = createCourseSchema;

