import createHttpError from 'http-errors';

import '../models/feedback.js'; //need delete after feedbacks implementation
import Good from '../models/good.js';

export const getAllGoods = async (req, res) => {
  // Отримуємо пара метри пагінації
  const {
    page = 1,
    perPage = 10,
    category,
    size,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  } = req.query;

  const skip = (page - 1) * perPage;

  const goodsQuery = Good.find();

  if (category && category !== 'all') {
    goodsQuery.where('category').equals(category);
  }

  if (size) {
    goodsQuery.where('size').equals(size);
  }

  if (minPrice) {
    goodsQuery.where('price.value').gte(minPrice);
  }

  if (maxPrice) {
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
    totalGoods,
    totalPages,
    category,
    size,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    goods,
  });
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
