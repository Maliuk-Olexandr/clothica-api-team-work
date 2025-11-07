import { Joi, Segments } from 'celebrate';

import { PHONE_REGEX } from '../constants/const.js';

export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string(),
    surName: Joi.string(),
    phone: Joi.string().regex(PHONE_REGEX),
    city: Joi.string(),
    postOfficeNumber: Joi.number(),
  }).min(1),
};
