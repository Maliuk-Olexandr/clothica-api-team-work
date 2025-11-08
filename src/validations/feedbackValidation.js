import { Joi, Segments } from 'celebrate';

export const feedbackValidationSchema = {
  [Segments.BODY]: Joi.object().keys({
    productId: Joi.string()
      .required()
      .messages({ 'any.required': 'Product ID is required' }),

    rate: Joi.number().integer().min(1).max(5).required().messages({
      'number.base': 'Rate must be a number',
      'any.required': 'Rate is required',
    }),

    description: Joi.string().min(10).max(500).required().messages({
      'any.required': 'Description text is required',
      'string.min': 'Description should have a minimum length of 10',
    }),

    author: Joi.string()
      .trim()
      .required()
      .messages({ 'any.required': 'Author name is required' }),

    category: Joi.string().optional(),
    date: Joi.date().optional(),
  }),
};
