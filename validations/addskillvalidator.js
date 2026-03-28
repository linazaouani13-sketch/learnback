const Joi = require('joi');
const adduserskillSchema = Joi.object({
     skillId: Joi.string().required(),
     level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').default('Beginner')
    });
    
    module.exports = adduserskillSchema ;