import { model, Schema } from 'mongoose';

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
    // ✅ Email лише для підписки — неунікальний, не обов’язковий
    email: {
      type: String,
      required: false,
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
      trim: true,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
    city: {
      type: String,
      trim: true,
    },
    postNumber: {
      type: String,
      trim: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

// Якщо не вказано ім’я — використовуємо номер телефону
userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = this.phone;
  }
  next();
});

// Видаляємо пароль при серіалізації
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
