import Joi from 'joi';

export const borrowerValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  age: Joi.number().required()
});
