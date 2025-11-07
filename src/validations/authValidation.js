import { Joi, Segments } from 'celebrate';

// E.164 international phone format, e.g. +380501234567
const phoneRegex = /^\+380\d{9}$/;

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().max(32).required().messages({
      'string.max': 'Username must be no longer than 32 characters',
      'string.empty': 'Username is required',
      'any.required': 'Username is required',
    }),

    phone: Joi.string().pattern(phoneRegex).required().messages({
      'string.pattern.base':
        'Invalid phone number format. Use format +380501234567',
      'string.empty': 'Phone number is required',
      'any.required': 'Phone number is required',
    }),

    password: Joi.string().min(8).max(128).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    phone: Joi.string().pattern(phoneRegex).required().messages({
      'string.pattern.base':
        'Invalid phone number format. Use format +380501234567',
      'string.empty': 'Phone number is required',
      'any.required': 'Phone number is required',
    }),

    password: Joi.string().min(8).max(128).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  }),
};

export const requestResetPhoneSchema = {
  [Segments.BODY]: Joi.object({
    phone: Joi.string().pattern(phoneRegex).required().messages({
      'string.pattern.base':
        'Invalid phone number format. Use format +380501234567',
      'string.empty': 'Phone number is required',
      'any.required': 'Phone number is required',
    }),
  }),
};

export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    token: Joi.string().required().messages({
      'string.empty': 'Token is required',
      'any.required': 'Token is required',
    }),

    password: Joi.string().min(8).max(128).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  }),
};
