import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  createFeedback,
  getFeedbacks,
} from '../controllers/feedbackController.js';
import { feedbackValidationSchema } from '../validations/feedbackValidation.js';

const router = Router();

router.get('/api/feedbacks', getFeedbacks);
router.post('/api/feedbacks', celebrate(feedbackValidationSchema), createFeedback);

export default router;

/**
 * @swagger
 * tags:
 *   name: Feedbacks
 *   description: Управління відгуками користувачів
 */

/**
 * @swagger
 * /api/feedbacks:
 *   get:
 *     summary: Отримати список відгуків
 *     tags: [Feedbacks]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Фільтр по конкретному продукту
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер сторінки
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Кількість відгуків на сторінку
 *     responses:
 *       200:
 *         description: Список відгуків з пагінацією
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 perPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalFeedbacks:
 *                   type: integer
 *                 productId:
 *                   type: string
 *                 feedbacks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feedback'
 *       500:
 *         description: Внутрішня помилка сервера
 */

/**
 * @swagger
 * /api/feedbacks:
 *   post:
 *     summary: Створити новий відгук
 *     tags: [Feedbacks]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FeedbackInput'
 *     responses:
 *       201:
 *         description: Відгук створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Некоректні дані
 *       500:
 *         description: Внутрішня помилка сервера
 */
