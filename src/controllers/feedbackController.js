// controllers/feedbackController.js
import createHttpError from 'http-errors';

import Feedback from '../models/feedback.js';

// 1. Приватний: СТВОРЕННЯ відгуку (POST /api/feedbacks)

export const createFeedback = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const defaultAuthor = req.user.username || req.user.email || 'Anonymous';

    const newFeedback = await Feedback.create({
      ...req.body,
      userId,
      date: req.body.date || Date.now(),
      author: req.body.author || defaultAuthor,
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
    const { page = 1, limit = 10, productId } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (productId) {
      filter.productId = productId;
    }

    const feedbacks = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email');

    const total = await Feedback.countDocuments(filter);

    res.status(200).json({
      feedbacks,
      total,
      page: +page,
      limit: +limit,
    });
  } catch (error) {
    next(error);
  }
};
