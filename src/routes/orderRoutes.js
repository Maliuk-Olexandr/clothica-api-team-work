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
 *   description: Управління замовленнями
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Отримати всі замовлення користувача або всі замовлення (для admin)
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
 *         description: Номер сторінки
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Кількість замовлень на сторінку
 *     responses:
 *       200:
 *         description: Список замовлень із пагінацією
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 perPage:
 *                   type: integer
 *                 totalOrders:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Неавторизований доступ
 */

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Отримати замовлення за ID (користувач бачить тільки свої)
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
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Замовлення створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Некоректні дані
 */

/**
 * @swagger
 * /api/orders/{orderId}/status:
 *   patch:
 *     summary: Оновити статус замовлення (тільки admin)
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
 *         description: Статус замовлення змінено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       403:
 *         description: Доступ заборонено
 *       404:
 *         description: Замовлення не знайдено
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderInput:
 *       type: object
 *       required:
 *         - userName
 *         - userSurname
 *         - contactPhone
 *         - items
 *         - totalPrice
 *         - shippingAddress
 *       properties:
 *         userId:
 *           type: string
 *           nullable: true
 *         userName:
 *           type: string
 *         userSurname:
 *           type: string
 *         contactPhone:
 *           type: string
 *         userEmail:
 *           type: string
 *         orderNumber:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               goodId:
 *                 type: string
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               size:
 *                 type: string
 *               gender:
 *                 type: string
 *               price:
 *                 type: number
 *         deliveryCost:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *             currency:
 *               type: string
 *         totalPrice:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *             currency:
 *               type: string
 *         status:
 *           type: string
 *           enum: [Pending, Processing, Completed, Cancelled]
 *         shippingAddress:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             postNumber:
 *               type: string
 *         comment:
 *           type: string
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *           nullable: true
 *         userName:
 *           type: string
 *         userSurname:
 *           type: string
 *         contactPhone:
 *           type: string
 *         userEmail:
 *           type: string
 *         orderNumber:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               goodId:
 *                 type: string
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               size:
 *                 type: string
 *               gender:
 *                 type: string
 *               price:
 *                 type: number
 *         deliveryCost:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *             currency:
 *               type: string
 *         totalPrice:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *             currency:
 *               type: string
 *         status:
 *           type: string
 *         shippingAddress:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             postNumber:
 *               type: string
 *         comment:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
