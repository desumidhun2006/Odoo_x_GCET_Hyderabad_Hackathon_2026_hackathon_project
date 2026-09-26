import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Ledger from '../models/StockLedger.js';
import Stock from '../models/Stock.js';
import Product from '../models/Product.js';
import Receipt from '../models/Receipt.js';
import Delivery from '../models/DeliveryOrder.js';
import Transfer from '../models/InternalTransfer.js';
const r = Router();
r.use(protect);

// Move history with dashboard filters: ?type=&productId=&warehouseId=&from=&to=
r.get('/', async (req, res) => {
  const f = {};
  if (req.query.type) f.type = req.query.type;
  if (req.query.productId) f.product = req.query.productId;
  if (req.query.warehouseId) f.warehouse = req.query.warehouseId;
  if (req.query.from || req.query.to) {
    f.createdAt = {};
    if (req.query.from) f.createdAt.$gte = new Date(req.query.from);
    if (req.query.to) f.createdAt.$lte = new Date(req.query.to);
  }
  res.json(await Ledger.find(f).populate('product warehouse').sort({ createdAt: -1 }).limit(300));
});
// Low-stock alerts: stock.qty <= product.reorderLevel
r.get('/low-stock', async (_req, res) => {
  const stocks = await Stock.find().populate('product warehouse');
  res.json(stocks.filter((s) => s.product && s.qty <= (s.product.reorderLevel ?? 10)).map((s) => ({
    product: s.product, warehouse: s.warehouse, location: s.location, qty: s.qty, reorderLevel: s.product.reorderLevel,
  })));
});
// Dashboard summary for M3: KPIs + pending counts
r.get('/dashboard-summary', async (_req, res) => {
  const [products, stocks, pReceipts, pDeliveries, schedTransfers] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Stock.find().populate('product'),
    Receipt.countDocuments({ status: { $in: ['Draft', 'Waiting', 'Ready'] } }),
    Delivery.countDocuments({ status: { $in: ['Draft', 'Waiting', 'Ready'] } }),
    Transfer.countDocuments({ status: { $in: ['Draft', 'Waiting', 'Ready'] } }),
  ]);
  const low = stocks.filter((s) => s.product && s.qty <= (s.product.reorderLevel ?? 10)).length;
  const out = stocks.filter((s) => s.qty <= 0).length;
  const totalUnits = stocks.reduce((a, s) => a + s.qty, 0);
  res.json({ totalProducts: products, totalUnits, lowStock: low, outOfStock: out, pendingReceipts: pReceipts, pendingDeliveries: pDeliveries, scheduledTransfers: schedTransfers });
});
export default r;
