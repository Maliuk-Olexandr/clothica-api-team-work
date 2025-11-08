import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const CATEGORIES = [
  'all',
  '690c9ce6a6276289c98fc006',
  '690c9ce6a6276289c98fc007',
  '690c9ce6a6276289c98fc008',
  '690c9ce6a6276289c98fc009',
  '690c9ce6a6276289c98fc00a',
  '690c9ce6a6276289c98fc00b',
  '690c9ce6a6276289c98fc00c',
  '690c9ce6a6276289c98fc00d',
];

import { GENDER, SIZES } from '../constants/const.js';
export const getAllGoodsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(8),
    category: Joi.string()
      .valid(...CATEGORIES)
      .default('all'),
    size: Joi.string()
      .valid(...SIZES)
      .optional(),
    minPrice: Joi.number().integer().min(0).max(5299).default(0),
    maxPrice: Joi.number().integer().min(0).max(5299).default(5299),
    gender: Joi.string()
      .valid(...GENDER)
      .default(GENDER[0]),
    sortBy: Joi.string().valid('_id', 'price.value').default('_id'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  }),
};

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// Схема для перевірки параметра studentId
export const goodIdSchema = {
  [Segments.PARAMS]: Joi.object({
    goodId: Joi.string().custom(objectIdValidator).required(),
  }),
};
