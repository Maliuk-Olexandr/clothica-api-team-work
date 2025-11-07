import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestResetPhone,
  resetPassword,
} from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetPhoneSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';

const router = Router();

// 🔹 Реєстрація користувача (по телефону)
router.post('/auth/register', celebrate(registerUserSchema), registerUser);

// 🔹 Логін користувача (по телефону)
router.post('/auth/login', celebrate(loginUserSchema), loginUser);

// 🔹 Вихід користувача
router.post('/auth/logout', logoutUser);

// 🔹 Оновлення сесії
router.post('/auth/refresh', refreshUserSession);

// 🔹 Запит на скидання паролю через телефон (SMS)
router.post(
  '/auth/request-reset-phone',
  celebrate(requestResetPhoneSchema),
  requestResetPhone,
);

// 🔹 Скидання паролю
router.post(
  '/auth/reset-password',
  celebrate(resetPasswordSchema),
  resetPassword,
);

export default router;
