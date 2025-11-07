import createHttpError from "http-errors";

import Order from "../models/order.js";

/**
 * GET /api/orders
 * Отримати всі замовлення користувача (з пагінацією)
 */
export const getAllOrders = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.perPage) || 10;
  const skip = (page - 1) * perPage;

  const [orders, totalOrders] = await Promise.all([
    Order.find({ userId: req.user._id }).skip(skip).limit(perPage).exec(),
    Order.countDocuments({ userId: req.user._id }),
  ]);

  const totalPages = Math.ceil(totalOrders / perPage);

  res.status(200).json({
    page,
    perPage,
    totalOrders,
    totalPages,
    orders,
  });
};

/**
 * GET /api/orders/:orderId
 * Отримати замовлення за ID
 */
export const getOrderById = async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ _id: orderId, userId: req.user._id });
  if (!order) {
    return next(createHttpError(404, "Замовлення не знайдено"));
  }
  res.status(200).json(order);
};

/**
 * POST /api/orders
 * Оформити нове замовлення
 */
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, userId: req.user._id });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при створенні замовлення" });
  }
};

/**
 * PATCH /api/orders/:orderId/status
 * Змінити статус замовлення (тільки admin)
 */

export const updateOrderStatus = async (req, res, next) => {
  try {
  if (req.user.role !== "admin") {
    return next(createHttpError(403, "Доступ заборонено"));
  }

  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findOneAndUpdate(
    { _id: orderId, userId: req.user._id },
    { status },
    { new: true }
  );

  if (!order) {
    return next(createHttpError(404, "Замовлення не знайдено"));
  }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при оновленні статусу замовлення" });
  }
};


