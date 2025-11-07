import { Schema, model } from 'mongoose';

import { SIZES } from '../constants/const.js';

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        goodId: { type: Schema.Types.ObjectId, ref: 'Good', required: true },
        quantity: { type: Number, required: true, min: 1 },
        size: {
          type: String,
          enum: SIZES,
          required: false,
        },
        gender: {
          type: String,
          enum: ['Всі', 'Чоловічий', 'Жіночий', 'Унісекс'],
          required: false,
          trim: true,
        },
      },
    ],
    deliveryCost: {
      required: false,
      value: { type: Number, required: true },
      currency: { type: String, required: true, default: 'грн' },
    },
    totalPrice: {
      value: { type: Number, required: true },
      currency: { type: String, required: true, default: 'грн' },
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
      trim: true,
    },
    shippingAddress: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Order = model('Order', orderSchema);

export default Order;
