import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

import { getFilterParams } from '../utils/getFilterParams.js';
import { GENDER, SIZES } from '../constants/const.js';

export const getAllGoodsSchema = async () => {
  const {categoryIds, minPrice, maxPrice} = await getFilterParams();
  return {
    [Segments.QUERY]: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      perPage: Joi.number().integer().min(5).max(20).default(8),
      category: Joi.string()
        .valid(...categoryIds)
        .default('all'),
      size: Joi.string()
        .valid(...SIZES)
        .optional(),
      minPrice: Joi.number().integer().min(minPrice).max(maxPrice).default(minPrice),
      maxPrice: Joi.number().integer().min(0).max(maxPrice).default(maxPrice),
      gender: Joi.string()
        .valid(...GENDER)
        .default(GENDER[0]),
      sortBy: Joi.string().valid('_id', 'price.value').default('_id'),
      sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
    }),
  };
};

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// Схема для перевірки параметра goodId
export const goodIdSchema = {
  [Segments.PARAMS]: Joi.object({
    goodId: Joi.string().custom(objectIdValidator).required(),
  }),
};
