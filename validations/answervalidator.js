const Joi = require('joi');

const takeTestSchema = Joi.object({
  answers: Joi.array().items(Joi.string().required()).required()
});

    module.exports = takeTestSchema ;