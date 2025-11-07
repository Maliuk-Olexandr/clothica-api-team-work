import { Schema, model } from 'mongoose';

const feedbackSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    author: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, required: true, trim: true },
    rate: { type: Number, required: true, min: 1, max: 5 },
    category: { type: String, required: false, trim: false },
    good: { type: Schema.Types.ObjectId, ref: 'Good', required: false },
  },
  { timestamps: true },
);

const Feedback = model('Feedback', feedbackSchema);

export default Feedback;
