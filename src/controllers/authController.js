import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';
import User from '../models/user.js';

// 📱 Register a new user
export const registerUser = async (req, res, next) => {
  try {
    const { phone, password, username } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return next(
        createHttpError(400, 'User with this phone number already exists'),
      );
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
      message: 'User successfully registered',
      user: {
        _id: newUser._id,
        phone: newUser.phone,
        username: newUser.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 🔑 User login
export const loginUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return next(createHttpError(401, 'Invalid phone number or password'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(401, 'Invalid phone number or password'));
    }

    await Session.deleteOne({ userId: user._id });

    const newSession = await createSession(user._id);
    setSessionCookies(res, newSession);
    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        username: user.username,
        userSurname: user.userSurname,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        city: user.city,
        postNumber: user.postNumber,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 🚪 User logout
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;
    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// 🔄 Refresh user session
export const refreshUserSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      _id: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    const isExpired = new Date() > new Date(session.refreshTokenValidUntil);
    if (isExpired) {
      return next(createHttpError(401, 'Session token expired'));
    }

    await Session.deleteOne({
      _id: session._id,
      refreshToken: req.cookies.refreshToken,
    });

    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({ message: 'Session refreshed' });
  } catch (error) {
    next(error);
  }
};

// 📱 Request password reset via phone
export const requestResetPhone = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    // Do not reveal whether the user exists
    if (!user) {
      return res
        .status(200)
        .json({ message: 'If this user exists, an SMS has been sent' });
    }

    const resetToken = jwt.sign(
      { sub: user._id, phone },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    // TODO: 🔧 Integrate with SMS API (e.g., Twilio)
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      console.log(`🔐 SMS reset token for ${phone}: ${resetToken}`);
    }

    res.status(200).json({
      message: 'Password reset SMS sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

// 🔐 Reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next(createHttpError(401, 'Invalid or expired token'));
    }

    const user = await User.findOne({ _id: payload.sub, phone: payload.phone });
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    await Session.deleteMany({ userId: user._id });

    res.status(200).json({ message: 'Password successfully updated' });
  } catch (error) {
    next(error);
  }
};

