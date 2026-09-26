import Product from './models/Product.js';
import Warehouse from './models/Warehouse.js';
import Stock from './models/Stock.js';
import Receipt from './models/Receipt.js';
import DeliveryOrder from './models/DeliveryOrder.js';
import InternalTransfer from './models/InternalTransfer.js';
import Adjustment from './models/Adjustment.js';
import Ledger from './models/StockLedger.js';
import User from './auth/User.js';
import { bump } from './lib/stock.js';

// Working demo data for show-and-tell. Everything is written through the
// same collections/lib the live API uses, so every screen (dashboard,
// receipts, stock, settings KPIs, ledger, charts) computes from real data.
// No hardcoded UI mocks — re-run anytime to reset the demo.
export async function seedDemo() {
  await Promise.all([
    Product.deleteMany({}), Warehouse.deleteMany({}), Stock.deleteMany({}),
    Receipt.deleteMany({}), DeliveryOrder.deleteMany({}),
    InternalTransfer.deleteMany({}), Adjustment.deleteMany({}), Ledger.deleteMany({}),
    User.deleteMany({}),
  ]);

  // Demo login identity (used across the whole app — no personal mail IDs).
  await User.create({
    name: 'Demo Manager', email: 'demo@stocksense.io',
    password: 'Demo@1234', role: 'admin', isVerified: true,
  });

  const main = await Warehouse.create({ name: 'Main DC', code: 'WH-01', locations: ['Main Store', 'Production Rack'] });
  const north = await Warehouse.create({ name: 'North Hub', code: 'WH-02', locations: ['Staging Floor A'] });

  const steel = await Product.create({ name: 'Structural Steel Rods 12mm', sku: 'STL-ROD-012', category: 'Metals', uom: 'Units', cost: 65, reorderLevel: 25 });
  const bolts = await Product.create({ name: 'High-Strength Hex Bolts M12', sku: 'BLT-M12-050', category: 'Hardware', uom: 'Box (100 pcs)', cost: 850, reorderLevel: 30 });
  const chairs = await Product.create({ name: 'Ergonomic Task Chairs', sku: 'CHR-ERG-09', category: 'Furniture', uom: 'Units', cost: 4200, reorderLevel: 10 });
  const seal = await Product.create({ name: 'Thermal Silicone Sealant', sku: 'ADH-SIL-01', category: 'Consumables', uom: 'Tubes', cost: 180, reorderLevel: 20 });

  // 1. Validated inbound receipt: +125 steel, +85 bolts
  const rec1 = await Receipt.create({
    supplier: 'Metallo Industrial Supplies Ltd.', warehouse: main._id,
    lines: [{ product: steel._id, qty: 125 }, { product: bolts._id, qty: 85 }],
    status: 'Done', createdBy: 'seed-demo',
  });
  await bump(steel._id, main._id, 'Main Store', 125, { type: 'Receipt', refId: rec1._id, by: 'seed-demo' });
  await bump(bolts._id, main._id, 'Main Store', 85, { type: 'Receipt', refId: rec1._id, by: 'seed-demo' });

  // 2. Pending inbound receipt (shows in KPIs + receipts list as Ready)
  await Receipt.create({
    supplier: 'ErgoParts Supply', warehouse: north._id,
    lines: [{ product: chairs._id, qty: 20 }],
    status: 'Ready', createdBy: 'seed-demo',
  });

  // 3. Validated delivery: -20 steel
  const del1 = await DeliveryOrder.create({
    customer: 'Apex Builders', warehouse: main._id,
    lines: [{ product: steel._id, qty: 20 }],
    status: 'Done', createdBy: 'seed-demo',
  });
  await bump(steel._id, main._id, 'Main Store', -20, { type: 'Delivery', refId: del1._id, by: 'seed-demo' });

  // 4. Waiting delivery (pending, insufficient chairs on hand)
  await DeliveryOrder.create({
    customer: 'TechHub Hyderabad', warehouse: north._id,
    lines: [{ product: chairs._id, qty: 10 }],
    status: 'Waiting', createdBy: 'seed-demo',
  });

  // 5. Validated internal transfer: 10 steel Main Store -> Production Rack
  const trf = await InternalTransfer.create({
    fromWarehouse: main._id, fromLocation: 'Main Store',
    toWarehouse: main._id, toLocation: 'Production Rack',
    lines: [{ product: steel._id, qty: 10 }],
    status: 'Done', createdBy: 'seed-demo',
  });
  await bump(steel._id, main._id, 'Main Store', -10, { type: 'Transfer', refId: trf._id, by: 'seed-demo' });
  await bump(steel._id, main._id, 'Production Rack', 10, { type: 'Transfer', refId: trf._id, by: 'seed-demo' });

  // 6. Adjustment audit: bolts counted 83 (diff -2)
  const adj = await Adjustment.create({
    product: bolts._id, warehouse: main._id, location: 'Main Store',
    recordedQty: 85, countedQty: 83, diff: -2, reason: 'seed-demo audit', status: 'Done',
  });
  await Stock.findOneAndUpdate(
    { product: bolts._id, warehouse: main._id, location: 'Main Store' },
    { $set: { qty: 83 } }, { upsert: true, new: true },
  );
  await Ledger.create({ type: 'Adjustment', refId: adj._id, product: bolts._id, warehouse: main._id, location: 'Main Store', delta: -2, balanceAfter: 83, by: 'seed-demo' });

  // Final: steel 95 + 10 = 105 · bolts 83 · chairs 0 (pending) · sealant 0
  return { warehouses: 2, products: 4, users: 1, ledger: await Ledger.countDocuments() };
}
