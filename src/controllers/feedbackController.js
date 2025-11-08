import createHttpError from 'http-errors';

import Feedback from '../models/feedback.js';

// 1. Публічний: СТВОРЕННЯ відгуку (POST /api/feedbacks)
export const createFeedback = async (req, res, next) => {
  try {
    const { rate, description, author, productId, date } = req.body;
    const newFeedback = await Feedback.create({
      rate,
      author,
      description,
      productId,
      date: date || Date.now(),
      userId: req.user ? req.user._id : null,
    });
    res.status(201).json(newFeedback);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(createHttpError(400, error.message));
    }
    next(error);
  }
};

// 2. Публічний: ОТРИМАННЯ списку відгуків (GET /api/feedbacks)

export const getFeedbacks = async (req, res, next) => {
  try {
    const { productId } = req.query;
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;
    const skip = (page - 1) * perPage;

    const filter = {};
    if (productId) {
      filter.productId = productId;
    }
    const [feedbacks, totalFeedbacks] = await Promise.all([
      Feedback.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate('productId', 'name')
        .populate('userId', 'username'),
      Feedback.countDocuments(filter),
    ]);
    // calculate total pages
    const totalPages = Math.ceil(totalFeedbacks / perPage);
    res
      .status(200)
      .json({
        page,
        perPage,
        totalPages,
        productId,
        totalFeedbacks,
        feedbacks,
      });
  } catch (error) {
    next(error);
  }
};
