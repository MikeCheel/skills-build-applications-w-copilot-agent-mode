import mongoose from 'mongoose';

export const connectionString =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(connectionString);
  console.log('Connected to octofit_db');
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
}

export default db;
