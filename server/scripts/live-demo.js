import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import products from '../routes/products.js';
import warehouses from '../routes/warehouses.js';
import receipts from '../routes/receipts.js';
import deliveries from '../routes/deliveries.js';
import transfers from '../routes/transfers.js';
import adjustments from '../routes/adjustments.js';
import ledger from '../routes/ledger.js';
import authRoutes from '../auth/authRoutes.js';
import { seedDemo } from '../seed-demo-data.mjs';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  process.env.JWT_SECRET = 'stocksense-demo-dev-secret-min-32-chars!!';
}

const PORT = Number(process.env.DEMO_PORT || 5022);
const mongod = await MongoMemoryServer.create();
await mongoose.connect(mongod.getUri());
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/products', products);
app.use('/api/warehouses', warehouses);
app.use('/api/receipts', receipts);
app.use('/api/deliveries', deliveries);
app.use('/api/transfers', transfers);
app.use('/api/adjustments', adjustments);
app.use('/api/ledger', ledger);
app.use('/api/auth', authRoutes);
for (const m of ['dashboard', 'login', 'receipts', 'stock', 'settings']) app.use('/' + m, express.static(new URL('../..' + '/' + m, import.meta.url).pathname));
app.get('/', (_req, res) => res.redirect('/login/'));

// Full working demo dataset (skip with EMPTY_SEED=1 for a fully erased site)
if (process.env.EMPTY_SEED !== '1') {
  const summary = await seedDemo();
  console.log(`LIVE-DEMO api on :${PORT}`, summary);
} else {
  console.log(`LIVE-DEMO api on :${PORT} (EMPTY — all data erased)`);
}
app.listen(PORT, () => console.log(`listening on :${PORT}`));
