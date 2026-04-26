const Joi = require('joi');
const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    phoneNumber: Joi.string().pattern(/^\+?[0-9\s-]{8,20}$/).optional().messages({
        'string.pattern.base': 'Please provide a valid phone number'
    }),
    profile: Joi.object({
       avatar: Joi.string().pattern(/^[a-zA-Z0-9_\-\/]+\.(png|jpg|jpeg|webp)$/).optional(),
        bio: Joi.string().max(100).optional(),
       
    }).optional(),
   
});

module.exports = updateProfileSchema;