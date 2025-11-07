import { Joi, Segments } from 'celebrate';

// Формат міжнародного номера телефону (E.164)
// Наприклад: +380501234567
const phoneRegex = /^\+[1-9]\d{1,14}$/;

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().max(32).required().messages({
      'string.max': 'Ім’я користувача не може перевищувати 32 символи',
      'string.empty': 'Ім’я користувача є обов’язковим',
      'any.required': 'Ім’я користувача є обов’язковим',
    }),

    phone: Joi.string().pattern(phoneRegex).required().messages({
      'string.pattern.base':
        'Невірний формат номера телефону. Використовуйте формат +380501234567',
      'string.empty': 'Номер телефону є обов’язковим',
      'any.required': 'Номер телефону є обов’язковим',
    }),

    password: Joi.string().min(8).max(128).required().messages({
      'string.min': 'Пароль має містити мінімум 8 символів',
      'string.max': 'Пароль не може перевищувати 128 символів',
      'string.empty': 'Пароль є обов’язковим',
      'any.required': 'Пароль є обов’язковим',
    }),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    phone: Joi.string().pattern(phoneRegex).required().messages({
      'string.pattern.base':
        'Невірний формат номера телефону. Використовуйте формат +380501234567',
      'string.empty': 'Номер телефону є обов’язковим',
    }),

    password: Joi.string().min(8).max(128).required().messages({
      'string.min': 'Пароль має містити мінімум 8 символів',
      'string.max': 'Пароль не може перевищувати 128 символів',
      'string.empty': 'Пароль є обов’язковим',
    }),
  }),
};

export const requestResetPhoneSchema = {
  [Segments.BODY]: Joi.object({
    phone: Joi.string().pattern(phoneRegex).required().messages({
      'string.pattern.base':
        'Невірний формат номера телефону. Використовуйте формат +380501234567',
      'string.empty': 'Номер телефону є обов’язковим',
    }),
  }),
};

export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'Токен є обов’язковим',
      'string.empty': 'Токен є обов’язковим',
    }),

    password: Joi.string().min(8).max(128).required().messages({
      'string.min': 'Пароль має містити мінімум 8 символів',
      'string.max': 'Пароль не може перевищувати 128 символів',
      'string.empty': 'Пароль є обов’язковим',
      'any.required': 'Пароль є обов’язковим',
    }),
  }),
};
