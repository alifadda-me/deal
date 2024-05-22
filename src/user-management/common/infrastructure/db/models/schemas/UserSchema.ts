import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    role: { type: String, required: true, enum: ['ADMIN', 'CLIENT', 'AGENT'], default: 'ADMIN' },
    status: { type: String, required: true, enum: ['ACTIVE', 'DELETED'], default: 'ACTIVE' },
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  },
);

export default mongoose.model('User', UserSchema);
