import { Joi, Segments } from 'celebrate';

import {
  SIZES,
  CURRENCIES,
  ORDER_STATUSES,
  GENDERS,
} from '../constants/const.js';
import { objectIdValidator } from '../utils/objectIdValidator.js';

export const getOrderByIdSchema = {
  [Segments.PARAMS]: Joi.object({
    orderId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const createOrderSchema = {
  [Segments.BODY]: Joi.object({
    userId: Joi.string().custom(objectIdValidator).optional().allow(null),
    userName: Joi.string().required(),
    userSurname: Joi.string().required(),
    userEmail: Joi.string().email().optional().allow(null, ''),
    orderNumber: Joi.string().optional().allow(null, ''),

    items: Joi.array()
      .items(
        Joi.object({
          _id: Joi.string().custom(objectIdValidator).optional(),
          goodId: Joi.string().custom(objectIdValidator).required(),
          name: Joi.string().required(),
          quantity: Joi.number().integer().min(1).required(),
          size: Joi.string()
            .valid(...SIZES)
            .optional(),
          gender: Joi.string()
            .valid(...GENDERS)
            .optional(),
          price: Joi.number().required(),
        }),
      )
      .required(),
    deliveryCost: Joi.object({
      value: Joi.number().optional().allow(null),
      currency: Joi.string()
        .valid(...CURRENCIES)
        .default('грн'),
    }).optional(),

    totalPrice: Joi.object({
      value: Joi.number().required(),
      currency: Joi.string()
        .valid(...CURRENCIES)
        .default('грн'),
    }).required(),

    status: Joi.string()
      .valid(...ORDER_STATUSES)
      .default('Pending'),

    shippingAddress: Joi.object({
      city: Joi.string().required(),
      postNumber: Joi.string().required(),
    }).required(),

    contactPhone: Joi.string().required(),
    comment: Joi.string().optional().allow(null, ''),
  }),
};

export const updateOrderStatusSchema = {
  [Segments.PARAMS]: Joi.object({
    orderId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    status: Joi.string()
      .valid(...ORDER_STATUSES)
      .required(),
  }),
};

export const getAllOrdersSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().default(10),
    status: Joi.string()
      .valid(...ORDER_STATUSES)
      .optional(),
    userId: Joi.string().custom(objectIdValidator).optional(),
  }),
};
