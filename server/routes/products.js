import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Product from '../models/Product.js';
import Stock from '../models/Stock.js';
const r = Router();
r.use(protect);

// list with filters ?category=&q=&status not needed here
r.get('/', async (req, res) => {
  const { category, q } = req.query;
  const f = {};
  if (category) f.category = category;
  if (q) f.$or = [{ name: new RegExp(q, 'i') }, { sku: new RegExp(q, 'i') }];
  res.json(await Product.find(f).sort({ name: 1 }).limit(200));
});
r.get('/search', async (req, res) => {
  const q = req.query.q || '';
  res.json(await Product.find({ $or: [{ name: new RegExp(q, 'i') }, { sku: new RegExp(q, 'i') }] }).limit(50));
});
r.get('/:id/stock', async (req, res) => {
  res.json(await Stock.find({ product: req.params.id }).populate('warehouse'));
});
r.post('/', async (req, res) => {
  try {
    const p = await Product.create(req.body);
    // optional initial stock
    const { warehouseId, location, initialQty } = req.body;
    if (warehouseId && initialQty > 0) {
      await Stock.create({ product: p._id, warehouse: warehouseId, location: location || 'Main Store', qty: initialQty });
    }
    res.status(201).json(p);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
r.put('/:id', async (req, res) => {
  res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});
r.delete('/:id', async (req, res) => {
  await Stock.deleteMany({ product: req.params.id });
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});
export default r;
