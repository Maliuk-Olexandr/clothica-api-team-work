import { getFilterParamsCache } from "../utils/getFilterParamsCach.js";

export const getFilters = async (req, res) => {
  try {
    const meta = await getFilterParamsCache();
    res.status(200).json(meta);
  } catch (error) {
    console.error("Error fetching filter parameters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * tags:
 *   name: Filters
 *   description: Отримання категорій та цінових діапазонів для фільтрації товарів
 */

/**
 * @swagger
 * /filters:
 *   get:
 *     summary: Отримати параметри фільтрів товарів (категорії, мін/макс ціна)
 *     responses:
 *       200:
 *         description: Фільтри успішно отримано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                 minPrice:
 *                   type: number
 *                   example: 100
 *                 maxPrice:
 *                   type: number
 *                   example: 1000
 *       500:
 *         description: Внутрішня помилка сервера
 */
