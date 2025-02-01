const Joi = require('joi');
const { BadRequestError } = require('./customErrors');

const userCreationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin', 'user').required(),
  password: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('admin', 'user').optional(),
  password: Joi.string().optional(),
});

function validateUserCreation(req, res, next) {
  const { error } = userCreationSchema.validate(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }
  next();
}

function validateUserUpdate(req, res, next) {
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }
  next();
}

module.exports = { validateUserCreation, validateUserUpdate };
