import createHttpError from 'http-errors';

import Order from '../models/order.js';
import User from '../models/user.js';

/**
 * GET /api/orders
 * Отримати всі замовлення користувача (з пагінацією)
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;
    const skip = (page - 1) * perPage;

    const filter = req.user.role?.toLowerCase() === 'admin' ? {} : { userId: req.user._id };

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage).exec(),
      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalOrders / perPage);

    res.status(200).json({
      page,
      perPage,
      totalOrders,
      totalPages,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/:orderId
 * Отримати замовлення за ID
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, userId: req.user._id });
    if (!order) {
      return next(createHttpError(404, 'Order not found'));
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/orders
 * Оформити нове замовлення
 */
export const createOrder = async (req, res, next) => {
  try {
    const order = await Order.create({ ...req.body, userId: req.body.userId || null });
    if (order.userId)
  await User.findByIdAndUpdate(order.userId, { $push: { orders: order._id } });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/orders/:orderId/status
 * Змінити статус замовлення (тільки Admin)
 */

export const updateOrderStatus = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return next(createHttpError(403, 'Access denied'));
    }

    const { orderId } = req.params;
    console.log('REQ BODY:', req.body);
    const order = await Order.findOneAndUpdate({ _id: orderId }, req.body, {
      new: true,
    });

    if (!order) {
      return next(createHttpError(404, 'Order not found'));
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};
