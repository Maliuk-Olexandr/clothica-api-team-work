import createHttpError from 'http-errors';

import Feedback from '../models/feedback.js';

// 1. Публічний: СТВОРЕННЯ відгуку (POST /api/feedbacks)
export const createFeedback = async (req, res, next) => {
  try {
    const newFeedback = await Feedback.create({
      ...req.body,
      date: req.body.date || Date.now(),
      author: req.body.author,
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
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;
    const skip = (page - 1) * perPage;

    const [feedbacks, total] = await Promise.all([
      Feedback.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate('productId', 'name'),
      Feedback.countDocuments(),
    ]);
    res.status(200).json({
      feedbacks,
      total,
      page,
      perPage,
    });
  } catch (error) {
    next(error);
  }
};
