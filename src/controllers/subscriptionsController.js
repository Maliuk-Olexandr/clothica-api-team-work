import createHttpError from 'http-errors';

import Subscription from '../models/subscription.js';

export const createSubscription = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return next(createHttpError(409, 'Email is already subscribed'));
    }

    const subscription = await Subscription.create({ email });
    res.status(201).json(subscription);
  } catch (error) {
    next(error);
  }
};
