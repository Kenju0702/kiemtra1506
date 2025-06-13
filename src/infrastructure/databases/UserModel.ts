import mongoose from 'mongoose';
import validator from 'validator';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return validator.isEmail(v);
        },
        message: (props: any) => `${props.value} is not a valid email!`
      }
    },
    password: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return validator.isMobilePhone(v, 'any', { strictMode: false });
        },
        message: (props: any) => `${props.value} is not a valid phone number!`
      }
    },
    avatar: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    role: { type: String, enum: ['student', 'admin'], required: true },
    isDeleted: { type: Boolean, default: false },
  },

  { timestamps: true }
);

// Mã hóa mật khẩu trước khi lưu vào MongoDB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);  // Hash mật khẩu với 10 rounds
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.comparePassword = async function (candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error('Password comparison failed');
  }
};

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.post('save', function (doc) {
  Logger.log(`User ${doc.email} has been saved successfully!`);
});

export default mongoose.model('User', userSchema);
