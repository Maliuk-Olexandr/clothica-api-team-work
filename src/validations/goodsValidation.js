import { Joi, Segments } from 'celebrate';

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(12),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
    search: Joi.string().trim().allow(''),
  }),
};
