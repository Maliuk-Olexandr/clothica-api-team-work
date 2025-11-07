import { Joi, Segments } from 'celebrate';

// for GET /categories route, to validate query string parameters:
export const getAllCategoriesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.min': 'Page must be at least 1',
      'number.integer': 'Page must be an integer',
    }),
    perPage: Joi.number().integer().min(1).default(4).messages({
      'number.min': 'PerPage must be at least 1',
      'number.integer': 'PerPage must be an integer',
    }),
  }),
};
