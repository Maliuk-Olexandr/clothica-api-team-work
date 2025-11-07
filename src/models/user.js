import { model, Schema } from 'mongoose';

import { ROLE } from '../constants/const.js';

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    userSurname: {
      type: String,
      trim: true,
      required: false,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128,
    },
    avatar: {
      type: String,
      required: false,
      trim: true,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: ROLE,
      default: 'User',
    },
    city: {
      type: String,
      required: false,
      trim: true,
    },
    postNumber: {
      type: String,
      required: false,
      trim: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: false,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false,
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
