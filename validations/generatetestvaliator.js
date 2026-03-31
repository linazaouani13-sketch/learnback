const Joi = require('joi');

const generateTestSchema = Joi.object({
  skillId: Joi.string().hex().length(24).required(),
  skillName: Joi.string().required(),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').required()
});

module.exports = generateTestSchema ;