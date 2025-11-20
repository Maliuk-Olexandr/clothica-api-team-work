import { Schema, model } from 'mongoose';

import { GENDERS, SIZES } from '../constants/const.js';

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    userName: { type: String, required: true, trim: true },
    userSurname: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    userEmail: { type: String, required: false, trim: true },
    orderNumber: { type: String, required: false, trim: true },
    items: [
      {
        _id: false, // ← вимикаємо автоматичний _id у піддокументів
        goodId: { type: Schema.Types.ObjectId, ref: 'Good', required: true },
        name: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 1 },
        size: { type: String, enum: SIZES, required: false },
        gender: { type: String, enum: GENDERS, required: false, trim: true },
        price: { type: Number, required: true },
      },
    ],
    deliveryCost: {
      type: {
        _id: false, // ← вимикаємо автоматичний _id у піддокументі
        value: { type: Number, required: true },
        currency: { type: String, required: true, default: 'грн' },
      },
      required: false,
    },
    totalPrice: {
      type: {
        _id: false, // ← вимикаємо автоматичний _id у піддокументі
        value: { type: Number, required: true },
        currency: { type: String, required: true, default: 'грн' },
      },
      required: true,
    },
    status: { type: String, required: true, default: 'Pending', trim: true },
    shippingAddress: {
      type: {
        _id: false, // ← вимикаємо автоматичний _id у піддокументі
        city: { type: String, required: true, trim: true },
        postNumber: { type: Number, required: true, trim: true },
      },
      required: true,
    },
    comment: { type: String, required: false, trim: true },
  },
  { timestamps: true, versionKey: false },
);

const Order = model('Order', orderSchema);
export default Order;
