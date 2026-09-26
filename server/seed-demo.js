import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
dotenv.config();
import { connectDB } from './db.js';
import mongoose from 'mongoose';
import { seedDemo } from './seed-demo-data.mjs';

await connectDB(process.env.MONGO_URI);
const summary = await seedDemo();
console.log('demo seeded', summary);
await mongoose.disconnect();
process.exit(0);
