import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import products from '../routes/products.js';
import warehouses from '../routes/warehouses.js';
import receipts from '../routes/receipts.js';
import deliveries from '../routes/deliveries.js';
import transfers from '../routes/transfers.js';
import adjustments from '../routes/adjustments.js';
import ledger from '../routes/ledger.js';
import Product from '../models/Product.js';
import Warehouse from '../models/Warehouse.js';
import { bump } from '../lib/stock.js';

const PORT = Number(process.env.DEMO_PORT || 5022);
const mongod = await MongoMemoryServer.create();
await mongoose.connect(mongod.getUri());
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/products', products);
app.use('/api/warehouses', warehouses);
app.use('/api/receipts', receipts);
app.use('/api/deliveries', deliveries);
app.use('/api/transfers', transfers);
app.use('/api/adjustments', adjustments);
app.use('/api/ledger', ledger);

// Seed PDF demo flow
const wh = await Warehouse.create({ name: 'Main Warehouse', code: 'WH-01', locations: ['Main Store', 'Production Rack'] });
const steel = await Product.create({ name: 'Steel Rods', sku: 'STL-001', category: 'Raw', uom: 'kg', reorderLevel: 20 });
await Product.create({ name: 'Chairs', sku: 'CHR-010', category: 'Finished', uom: 'units', reorderLevel: 5 });
const ref = new mongoose.Types.ObjectId();
await bump(steel._id, wh._id, 'Main Store', 100, { type: 'Receipt', refId: ref, by: 'demo' });
await bump(steel._id, wh._id, 'Main Store', -30, { type: 'Transfer', refId: ref, by: 'demo' });
await bump(steel._id, wh._id, 'Production Rack', 30, { type: 'Transfer', refId: ref, by: 'demo' });

app.listen(PORT, () => console.log(`LIVE-DEMO api on :${PORT}, wh=${wh._id} steel=${steel._id}`));
