// library imports
import { Router } from 'express';
import { celebrate } from 'celebrate';

// import controller
import { getAllCategories } from '../controllers/categoriesController.js';
// import validation schema
import { getAllCategoriesSchema } from '../validations/categoriesValidation.js';

const router = Router();

router.get('/api/categories', celebrate(getAllCategoriesSchema), getAllCategories);

export default router;

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Операції з категоріями товарів
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Отримати всі категорії з пагінацією
 *     tags: [Categories]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Номер сторінки (за замовчуванням 1)
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 4
 *         description: Кількість категорій на сторінку (за замовчуванням 4)
 *     responses:
 *       200:
 *         description: Список категорій з пагінацією
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: Поточна сторінка
 *                 perPage:
 *                   type: integer
 *                   description: Кількість категорій на сторінку
 *                 totalCategories:
 *                   type: integer
 *                   description: Загальна кількість категорій
 *                 totalPages:
 *                   type: integer
 *                   description: Загальна кількість сторінок
 *                 categories:
 *                   type: array
 *                   description: Масив об’єктів категорій
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Помилка валідації параметрів запиту
 */
