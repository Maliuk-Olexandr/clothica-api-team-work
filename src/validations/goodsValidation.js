import { Joi, Segments } from 'celebrate';

import { objectIdValidator } from '../utils/objectIdValidator.js';
import { GENDER, SIZES } from '../constants/const.js';

export const getAllGoodsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1',
    }),
    perPage: Joi.number().integer().default(8).messages({
      'number.base': 'perPage must be a number',
      'number.integer': 'perPage must be an integer',
    }),
    category: Joi.string().default('all'),
    size: Joi.string().valid(...SIZES).optional().messages({
        'any.only': `Size must be one of the following: ${SIZES.join(', ')}`,
      }),
    minPrice: Joi.number().integer().min(0).optional().messages({
      'number.base': 'minPrice must be a number',
      'number.integer': 'minPrice must be an integer',
      'number.min': 'minPrice >= 0',
    }),
    maxPrice: Joi.number().integer().min(0).optional().messages({
      'number.base': 'maxPrice must be a number',
      'number.integer': 'maxPrice must be an integer',
      'number.min': 'maxPrice >= 0',
    }),
    gender: Joi.string().valid(...GENDER).default(GENDER[0]).messages({
        'any.only': `Gender must be one of the following: ${GENDER.join(', ')}`,
      }),
    sortBy: Joi.string().valid('_id', 'price.value').default('_id'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  }),
};

// Схема для перевірки параметра goodId
export const goodIdSchema = {
  [Segments.PARAMS]: Joi.object({
    goodId: Joi.string().custom(objectIdValidator).required().messages({
      'any.required': 'goodId is required',
      'string.custom': 'goodId must be a valid ObjectId',
    }),
  }),
};
