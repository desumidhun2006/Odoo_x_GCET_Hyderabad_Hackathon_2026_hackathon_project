import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Warehouse from '../models/Warehouse.js';
import Stock from '../models/Stock.js';
import Ledger from '../models/StockLedger.js';
import { bump, getQty } from '../lib/stock.js';

const mongod = await MongoMemoryServer.create();
await mongoose.connect(mongod.getUri());
const assert = (c, m) => { if (!c) { console.error('FAIL:', m); process.exit(1); } };

const wh = await Warehouse.create({ name: 'Main Warehouse', code: 'WH-01', locations: ['Main Store', 'Production Rack'] });
const steel = await Product.create({ name: 'Steel Rods', sku: 'STL-001', category: 'Raw', uom: 'kg', reorderLevel: 20 });
const fakeRef = new mongoose.Types.ObjectId();

// 1. Receipt +100
await bump(steel._id, wh._id, 'Main Store', 100, { type: 'Receipt', refId: fakeRef, by: 'e2e' });
assert(await getQty(steel._id, wh._id, 'Main Store') === 100, 'receipt +100');
// 2. Transfer 30 Main Store -> Production Rack (total unchanged)
await bump(steel._id, wh._id, 'Main Store', -30, { type: 'Transfer', refId: fakeRef, by: 'e2e' });
await bump(steel._id, wh._id, 'Production Rack', 30, { type: 'Transfer', refId: fakeRef, by: 'e2e' });
assert(await getQty(steel._id, wh._id, 'Main Store') === 70, 'transfer source');
assert(await getQty(steel._id, wh._id, 'Production Rack') === 30, 'transfer dest');
// 3. Delivery -20
await bump(steel._id, wh._id, 'Production Rack', -20, { type: 'Delivery', refId: fakeRef, by: 'e2e' });
assert(await getQty(steel._id, wh._id, 'Production Rack') === 10, 'delivery -20');
// 4. Adjustment: counted 7 (recorded 10, diff -3 damaged)
const cur = await Stock.findOne({ product: steel._id, warehouse: wh._id, location: 'Production Rack' });
const diff = 7 - cur.qty;
await Stock.findOneAndUpdate({ product: steel._id, warehouse: wh._id, location: 'Production Rack' }, { $set: { qty: 7 } });
await Ledger.create({ type: 'Adjustment', refId: fakeRef, product: steel._id, warehouse: wh._id, location: 'Production Rack', delta: diff, balanceAfter: 7, by: 'e2e' });
assert(await getQty(steel._id, wh._id, 'Production Rack') === 7, 'adjustment set 7');
// 5. Ledger has 5 entries, low-stock triggers (7 <= 20)
const n = await Ledger.countDocuments({ product: steel._id });
assert(n === 5, `ledger count 5, got ${n}`);
const stocks = await Stock.find().populate('product');
const low = stocks.filter((s) => s.qty <= s.product.reorderLevel);
assert(low.length >= 1, 'low-stock alert fires');
console.log('E2E PASS: receipt/transfer/delivery/adjust/ledger/low-stock all green');
await mongoose.disconnect();
await mongod.stop();
