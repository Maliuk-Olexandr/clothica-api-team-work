import { Schema, model } from 'mongoose';

import { GENDER, SIZES } from '../constants/const.js';

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    orderNumber: { type: String, required: false, trim: true },
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
          enum: GENDER,
          required: false,
          trim: true,
        },
      },
    ],
    deliveryCost: {
      type: {
        value: { type: Number, required: true },
        currency: { type: String, required: true, default: 'грн' },
      },
      required: false,
    },
    totalPrice: {
      type: {
        value: { type: Number, required: true },
        currency: { type: String, required: true, default: 'грн' },
      },
      required: true,
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
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Order = model('Order', orderSchema);

export default Order;
