import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  getSession,
  requestResetPhone,
  resetPassword,
} from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetPhoneSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

//public routes
router.post('/api/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/api/auth/login', celebrate(loginUserSchema), loginUser);
router.post('/api/auth/request-reset-phone', celebrate(requestResetPhoneSchema), requestResetPhone);
router.post('/api/auth/reset-password', celebrate(resetPasswordSchema), resetPassword);
router.get('/api/auth/session', getSession);
//protected routes
router.post('/api/auth/logout', authenticate, logoutUser);
router.post('/api/auth/refresh', authenticate, refreshUserSession);
router.post('/api/auth/session', authenticate, refreshUserSession);

export default router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Операції з автентифікацією користувачів
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - phone
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Олександр"
 *               phone:
 *                 type: string
 *                 example: "+380501234567"
 *               password:
 *                 type: string
 *                 example: "mysecurepassword"
 *     responses:
 *       201:
 *         description: Користувач успішно зареєстрований
 *       400:
 *         description: Користувач з таким номером уже існує
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вхід користувача
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+380501234567"
 *               password:
 *                 type: string
 *                 example: "mysecurepassword"
 *     responses:
 *       200:
 *         description: Успішний вхід
 *       401:
 *         description: Невірний номер або пароль
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Вихід користувача (очищення cookie)
 *     tags: [Auth]
 *     responses:
 *       204:
 *         description: Успішний вихід
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Оновлення сесії користувача
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Сесію оновлено
 *       401:
 *         description: Сесія не знайдена або прострочена
 */

/**
 * @swagger
 * /api/auth/request-reset-phone:
 *   post:
 *     summary: Запит на скидання пароля через телефон
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+380501234567"
 *     responses:
 *       200:
 *         description: Якщо користувач існує — SMS з токеном надіслано
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Скидання пароля користувача
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *               password:
 *                 type: string
 *                 example: "newsecurepassword"
 *     responses:
 *       200:
 *         description: Пароль оновлено
 *       401:
 *         description: Токен недійсний або прострочений
 *       404:
 *         description: Користувач не знайдений
 */
