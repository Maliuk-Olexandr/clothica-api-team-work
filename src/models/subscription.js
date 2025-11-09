import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true },

);

const Subscription = model('Subscription', orderSchema);

export default Subscription;
