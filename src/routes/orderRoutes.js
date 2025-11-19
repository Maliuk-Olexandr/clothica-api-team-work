import { Router } from 'express';
import { celebrate } from 'celebrate';

import { createOrder, getAllOrders, getOrderById,updateOrderStatus } from '../controllers/orderController.js';
import {
  getOrderByIdSchema,
  createOrderSchema,
  updateOrderStatusSchema,
  getAllOrdersSchema,
} from '../validations/orderValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();


//public routes
router.post('/api/orders', celebrate(createOrderSchema), createOrder);

//protected routes
router.use(authenticate);
router.get('/api/orders', celebrate(getAllOrdersSchema), getAllOrders);
router.get('/api/orders/:orderId', celebrate(getOrderByIdSchema), getOrderById);
router.patch('/api/orders/:orderId/status', celebrate(updateOrderStatusSchema), updateOrderStatus);

export default router;

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Роутери замовлень
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Отримати всі замовлення користувача
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Processing, Completed, Cancelled]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Список замовлень
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page: { type: integer }
 *                 perPage: { type: integer }
 *                 totalOrders: { type: integer }
 *                 totalPages: { type: integer }
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Отримати замовлення за ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID замовлення
 *     responses:
 *       200:
 *         description: Замовлення знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Замовлення не знайдено
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Створити нове замовлення
 *     tags: [Orders]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Замовлення створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /api/orders/{orderId}/status:
 *   patch:
 *     summary: Оновити статус замовлення (тільки Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID замовлення
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Processing, Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Статус оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       403:
 *         description: Доступ заборонено
 *       404:
 *         description: Замовлення не знайдено
 */
