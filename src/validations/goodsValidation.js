import { Joi, Segments } from 'celebrate';

import { SIZES } from '../constants/const.js';

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(12),
    size: Joi.string()
      .valid(...SIZES)
      .optional(),
    price: Joi.number().integer().min(0).max(2000),
    search: Joi.string().trim().allow(''),
  }),
};
