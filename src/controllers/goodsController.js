import createHttpError from 'http-errors';

import Good from '../models/good.js';
import { getFilterParamsCache } from '../utils/getFilterParamsCach.js';

export const getAllGoods = async (req, res, next) => {
  try {
    const {
      categories,
      minPrice: dbMinPrice,
      maxPrice: dbMaxPrice,
    } = await getFilterParamsCache();
    const categoryIds = categories.map((cat) => cat._id.toString());
    const {
      category,
      size,
      gender,
      sortBy = '_id',
      sortOrder = 'asc',
      minPrice,
      maxPrice,
    } = req.query;

    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 8;
    const skip = (page - 1) * perPage;

    const goodsQuery = Good.find();

    if (category && category !== 'all' && categoryIds.includes(category)) {
      goodsQuery.where('category').equals(category);
    }
    if (size) {
      goodsQuery.where('size').equals(size);
    }
    if (minPrice !== undefined) {
      goodsQuery.where('price.value').gte(minPrice);
    }
    if (maxPrice !== undefined) {
      goodsQuery.where('price.value').lte(maxPrice);
    }
    if (gender && gender !== 'all') {
      goodsQuery.where('gender').equals(gender);
    }

    // Виконуємо одразу два запити паралельно
    const [totalGoods, goods] = await Promise.all([
      goodsQuery.clone().countDocuments(),
      goodsQuery
        .skip(skip)
        .limit(perPage)
        .sort({ [sortBy]: sortOrder })
        .populate('category', 'name')
        .populate('feedbacks', 'rate description author productId date')
        .exec(),
    ]);

    // Обчислюємо загальну кількість «сторінок»
    const totalPages = Math.ceil(totalGoods / perPage);
    res.status(200).json({
      page,
      perPage,
      totalPages,
      totalGoods,
      category,
      size,
      minPrice: minPrice ?? dbMinPrice,
      maxPrice: maxPrice ?? dbMaxPrice,
      sortBy,
      sortOrder,
      goods,
    });
  } catch (error) {
    next(error);
  }
};

export const getGoodById = async (req, res, next) => {
  const { goodId } = req.params;
  const good = await Good.findById(goodId)
    .populate('category', 'name')
    .populate('feedbacks', 'rate description author productId date')
    .exec();
  if (!good) {
    next(createHttpError(404, 'Good not found'));
    return;
  }
  res.status(200).json(good);
};
