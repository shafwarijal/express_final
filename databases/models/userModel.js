import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: [true, 'email already exists in database!'],
    lowercase: true,
    trim: true,
    required: [true, 'email not provided'],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: '{VALUE} is not a valid email!',
    },
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const userModel = mongoose.model('User', UserSchema);

export default userModel;
