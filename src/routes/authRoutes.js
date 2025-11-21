import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  registerUser,
  loginUser,
  logoutUser,
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
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User with this phone number already exists
 *
 * /api/auth/login:
 *   post:
 *     summary: Логін користувача
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid phone number or password
 *
 * /api/auth/logout:
 *   post:
 *     summary: Вихід користувача
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: Successfully logged out
 *
 * /api/auth/session:
 *   get:
 *     summary: Отримати поточного користувача / автоновий refresh
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Session info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 refreshed:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 * /api/auth/request-reset-phone:
 *   post:
 *     summary: Запит на скидання пароля через телефон
 *     tags: [Auth]
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
 *                 example: '+380501234567'
 *     responses:
 *       200:
 *         description: SMS with reset token sent (or generic success if user doesn't exist)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * /api/auth/reset-password:
 *   post:
 *     summary: Скидання пароля за токеном
 *     tags: [Auth]
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
 *                 description: JWT токен для скидання пароля
 *               password:
 *                 type: string
 *                 description: Новий пароль користувача
 *                 minLength: 8
 *                 maxLength: 128
 *     responses:
 *       200:
 *         description: Password successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 */
