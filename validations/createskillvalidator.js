const Joi = require('joi');
const createSkillSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  description: Joi.string().optional().max(500),
  category: Joi.string().optional().max(50)
});

module.exports = createSkillSchema ;