import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); dotenv.config();
import { connectDB } from './db.js';
import Product from './models/Product.js';
import Warehouse from './models/Warehouse.js';
import Stock from './models/Stock.js';

await connectDB(process.env.MONGO_URI);
await Product.deleteMany({}); await Warehouse.deleteMany({}); await Stock.deleteMany({});
const wh = await Warehouse.create({ name: 'Main Warehouse', code: 'WH-01', locations: ['Main Store', 'Production Rack', 'Rack A', 'Rack B'] });
const wh2 = await Warehouse.create({ name: 'Warehouse 2', code: 'WH-02', locations: ['Main Store'] });
const steel = await Product.create({ name: 'Steel Rods', sku: 'STL-001', category: 'Raw', uom: 'kg', reorderLevel: 20 });
const chairs = await Product.create({ name: 'Chairs', sku: 'CHR-010', category: 'Finished', uom: 'units', reorderLevel: 5 });
await Stock.create({ product: steel._id, warehouse: wh._id, location: 'Main Store', qty: 0 });
await Stock.create({ product: chairs._id, warehouse: wh._id, location: 'Main Store', qty: 15 });
console.log('seeded', { wh: wh.code, products: 2 });
process.exit(0);
