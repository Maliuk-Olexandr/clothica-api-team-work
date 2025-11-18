import { Router } from 'express';
import { celebrate } from 'celebrate';

import { authenticate } from '../middleware/authenticate.js';
import {
  getCurrentUser,
  updateUser,
  // updateUserAvatar,
} from '../controllers/userController.js';
import { updateUserSchema } from '../validations/userValidation.js';
// import { upload } from '../middleware/multer.js';

const router = Router();

router.use(authenticate);

// router.patch(
//   '/users/me/avatar',
//   upload.single('avatar'),
//   updateUserAvatar,
// );

router.get('/api/users/me', getCurrentUser);
router.patch('/api/users/me', celebrate(updateUserSchema), updateUser);

export default router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Роутери користувачів
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Отримати інформацію про поточного користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Дані користувача
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Неавторизовано
 *
 *   patch:
 *     summary: Оновити дані поточного користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateInput'
 *     responses:
 *       200:
 *         description: Дані користувача оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Користувача не знайдено
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserUpdateInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         userSurname:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         city:
 *           type: string
 *         postNumber:
 *           type: string
 *         avatar:
 *           type: string
 *       description: Дані, які можна оновити

 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         userSurname:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *           nullable: true
 *         avatar:
 *           type: string
 *         role:
 *           type: string
 *           enum: ['User', 'Admin']
 *         city:
 *           type: string
 *           nullable: true
 *         postNumber:
 *           type: string
 *           nullable: true
 *         orders:
 *           type: array
 *           items:
 *             type: string
 *         feedbacks:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
