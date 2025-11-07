import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const Subscription = model('Subscription', orderSchema);

export default Subscription;
