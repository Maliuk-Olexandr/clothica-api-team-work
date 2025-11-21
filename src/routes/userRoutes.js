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


// router.patch(
//   '/users/me/avatar',
//   upload.single('avatar'),
//   updateUserAvatar,
// );

router.get('/api/users/me', authenticate, getCurrentUser);
router.patch('/api/users/me', authenticate, celebrate(updateUserSchema), updateUser);

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
 *     responses:
 *       200:
 *         description: Дані користувача
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id: { type: string }
 *                 username: { type: string }
 *                 userSurname: { type: string }
 *                 phone: { type: string }
 *                 city: { type: string }
 *                 postNumber: { type: integer }
 *                 email: { type: string }
 *                 role: { type: string }
 *     security:
 *       - BearerAuth: []
 *
 *   patch:
 *     tags: [Users]
 *     summary: Оновити дані поточного користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               userSurname: { type: string }
 *               phone: { type: string }
 *               city: { type: string }
 *               postNumber: { type: integer }
 *     responses:
 *       200:
 *         description: Дані користувача оновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id: { type: string }
 *                 username: { type: string }
 *                 userSurname: { type: string }
 *                 phone: { type: string }
 *                 city: { type: string }
 *                 postNumber: { type: integer }
 *                 email: { type: string }
 *                 role: { type: string }
 *       404:
 *         description: Користувач не знайдений
 *     security:
 *       - BearerAuth: []
 */
