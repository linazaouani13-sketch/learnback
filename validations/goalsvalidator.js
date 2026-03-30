const Joi = require('joi');
const addgoalSchema = Joi.object({
  skillId: Joi.string().required(),
  
});

module.exports = addgoalSchema ;