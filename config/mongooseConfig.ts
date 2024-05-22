import mongoose from 'mongoose';
import Env from './Env';

export const connectDefaultConnectionToMongoDB = async (uri = Env.MONGO_URI) => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
};

export const disconnectDefaultFromMongoDB = async () => {
  await mongoose.disconnect();
};
