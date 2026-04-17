const Joi = require('joi');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const allowedDomain = '@estin.dz';

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters'
  }),
  email: Joi.string().email().required().custom((value, helpers) => {
    if (!value.endsWith(allowedDomain)) {
      return helpers.error('any.invalid', { message: `Only ${allowedDomain} emails are allowed` });
    }
    return value;
  }).messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    'string.pattern.base': 'Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&)',
    'any.required': 'Password is required'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match'
  }),
  role: Joi.string().valid('student', 'teacher').default('student')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };