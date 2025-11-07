import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const GENDER = ['all', 'man', 'women', 'unisex'];

export const getAllGoodsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(12),
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
