const Joi = require('joi');
const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    profile: Joi.object({
        avatar: Joi.string().uri().optional(),
        bio: Joi.string().max(100).optional(),
       
    }).optional(),
   
});

module.exports = updateProfileSchema;