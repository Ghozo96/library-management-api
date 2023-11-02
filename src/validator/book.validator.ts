import Joi from 'joi';

const MinShelfLocation = 1;
const MaxShelfLocation = 10;

export const bookValidator = Joi.object({
  isbn: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),
  title: Joi.string().required(),
  author: Joi.string().required(),
  availableQuantity: Joi.number().integer().required(),
  shelfLocation: Joi.number().integer().min(MinShelfLocation).max(MaxShelfLocation).required()
});
