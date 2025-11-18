import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  getAllGoodsSchema,
  goodIdSchema,
} from '../validations/goodsValidation.js';
import { getAllGoods, getGoodById } from '../controllers/goodsController.js';

const router = Router();

router.get('/api/goods', celebrate(getAllGoodsSchema), getAllGoods);

router.get('/api/goods/:goodId', celebrate(goodIdSchema), getGoodById);

export default router;


/**
 * @swagger
 * tags:
 *   name: Goods
 *   description: Операції з товарами
 */

/**
 * @swagger
 * /api/goods:
 *   get:
 *     summary: Отримати список товарів
 *     tags: [Goods]
 *     security: []
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
 *           default: 8
 *         description: Кількість товарів на сторінку
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           default: all
 *         description: ID категорії або "all"
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
 *         description: Розмір товару
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: ['all', 'women', 'men', 'unisex']
 *           default: "men"
 *         description: Стать для товарів
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *         description: Мінімальна ціна
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: Максимальна ціна
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: ['_id', 'price.value']
 *           default: '_id'
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: ['asc', 'desc']
 *           default: 'asc'
 *     responses:
 *       200:
 *         description: Список товарів
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
 *                 totalGoods:
 *                   type: integer
 *                 category:
 *                   type: string
 *                 size:
 *                   type: string
 *                 minPrice:
 *                   type: integer
 *                 maxPrice:
 *                   type: integer
 *                 sortBy:
 *                   type: string
 *                 sortOrder:
 *                   type: string
 *                 goods:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Good'
 */

/**
 * @swagger
 * /api/goods/{goodId}:
 *   get:
 *     summary: Отримати товар по ID
 *     tags: [Goods]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: goodId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товару (ObjectId)
 *     responses:
 *       200:
 *         description: Товар знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Good'
 *       404:
 *         description: Товар не знайдено
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         rate:
 *           type: number
 *         description:
 *           type: string
 *         author:
 *           type: string
 *         productId:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *
 *     Good:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         image:
 *           type: string
 *         price:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *             currency:
 *               type: string
 *         size:
 *           type: array
 *           items:
 *             type: string
 *         description:
 *           type: string
 *         prevDescription:
 *           type: string
 *         gender:
 *           type: string
 *           enum: ['women', 'men', 'unisex']
 *         characteristics:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *         feedbacks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Feedback'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
