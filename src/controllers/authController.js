import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

// 📱 Реєстрація нового користувача
export const registerUser = async (req, res, next) => {
  const { phone, password, username } = req.body;

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return next(createHttpError(400, 'Користувач з таким номером вже існує'));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    phone,
    password: hashedPassword,
    username,
  });

  const newSession = await createSession(newUser._id);
  setSessionCookies(res, newSession);

  res.status(201).json({
    message: 'Користувача успішно створено',
    user: {
      id: newUser._id,
      phone: newUser.phone,
      username: newUser.username,
    },
  });
};

// 🔑 Вхід користувача
export const loginUser = async (req, res, next) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user) {
    return next(createHttpError(401, 'Невірний номер телефону або пароль'));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(createHttpError(401, 'Невірний номер телефону або пароль'));
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Вхід успішний',
    user: {
      id: user._id,
      phone: user.phone,
      username: user.username,
    },
  });
};

// 🚪 Вихід користувача
export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
  res.status(204).send();
};

// 🔄 Оновлення сесії користувача
export const refreshUserSession = async (req, res, next) => {
  const session = await Session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  if (!session) {
    return next(createHttpError(401, 'Сесію не знайдено'));
  }

  const isExpired = new Date() > new Date(session.refreshTokenValidUntil);
  if (isExpired) {
    return next(createHttpError(401, 'Токен сесії прострочений'));
  }

  await Session.deleteOne({
    _id: session._id,
    refreshToken: req.cookies.refreshToken,
  });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({ message: 'Сесію оновлено' });
};

// 📱 Запит на скидання паролю через телефон
export const requestResetPhone = async (req, res, next) => {
  const { phone } = req.body;
  const user = await User.findOne({ phone });

  if (!user) {
    // не розкриваємо, чи користувача існує
    return res
      .status(200)
      .json({ message: 'Якщо користувач існує, SMS надіслано' });
  }

  const resetToken = jwt.sign(
    { sub: user._id, phone },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  // TODO: 🔧 Тут у продакшні буде інтеграція з SMS API (наприклад, Twilio)
  console.log(`🔐 SMS токен для ${phone}: ${resetToken}`);

  res.status(200).json({
    message: 'SMS із посиланням на відновлення паролю надіслано',
  });
};

// 🔐 Скидання паролю
export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return next(createHttpError(401, 'Недійсний або прострочений токен'));
  }

  const user = await User.findOne({ _id: payload.sub, phone: payload.phone });
  if (!user) {
    return next(createHttpError(404, 'Користувача не знайдено'));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();
  await Session.deleteMany({ userId: user._id });

  res.status(200).json({ message: 'Пароль успішно змінено' });
};
