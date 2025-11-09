import { Router } from 'express';
import { celebrate } from 'celebrate';

import { createSubscriptionSchema } from '../validations/subscriptionsValidation.js';
import { createSubscription } from '../controllers/subscriptionsController.js';

const router = Router();

router.post('/api/subscriptions', celebrate(createSubscriptionSchema), createSubscription);

export default router;

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Операції з підписками на email
 */

/**
 * @swagger
 * /subscriptions:
 *   post:
 *     tags: [Subscriptions]
 *     security: []
 *     summary: Створити нову підписку на email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: Підписка успішно створена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       409:
 *         description: Email вже підписаний
 *       500:
 *         description: Внутрішня помилка сервера
 */
