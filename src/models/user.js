import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
    },
    userSername: {
      type: String,
      trim: true,
      required: false,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    avatar: {
      type: String,
      required: false,
      trim: true,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
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

userSchema.pre('save', function (next) {
  if(!this.username) {
    this.username = this.email;
  }
  next();
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
