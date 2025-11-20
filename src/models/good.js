import { Schema, model } from 'mongoose';

import { GENDERS, SIZES } from '../constants/const.js';

const goodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      value: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
        default: 'грн',
      },
    },
    size:
      {
        type: [String],
        enum: SIZES,
        required: false,
      },
    
    description: {
      type: String,
      required: false,
      trim: true,
    },
    feedbacks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Feedback',
      },
    ],
    prevDescription: {
      type: String,
      required: false,
      trim: true,
    },
    gender: {
      type: String,
      enum: GENDERS,
      required: true,
      trim: true,
    },
    characteristics: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

const Good = model('Good', goodSchema);

export default Good;
