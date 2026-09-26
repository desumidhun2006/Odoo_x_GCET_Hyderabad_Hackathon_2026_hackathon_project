import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Receipt from '../models/Receipt.js';
import { bump } from '../lib/stock.js';
const r = Router();
r.use(protect);
r.get('/', async (req, res) => {
  const f = {};
  if (req.query.status) f.status = req.query.status;
  if (req.query.warehouseId) f.warehouse = req.query.warehouseId;
  res.json(await Receipt.find(f).populate('warehouse lines.product').sort({ createdAt: -1 }).limit(200));
});
r.post('/', async (req, res) => {
  try {
    const doc = await Receipt.create({ ...req.body, createdBy: req.user?.id, status: req.body.status || 'Draft' });
    res.status(201).json(doc);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
r.post('/:id/validate', async (req, res) => {
  const doc = await Receipt.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'not found' });
  if (doc.status === 'Done') return res.json(doc);
  if (doc.status === 'Canceled') return res.status(400).json({ error: 'canceled' });
  for (const l of doc.lines) {
    await bump(l.product, doc.warehouse, req.body.location || 'Main Store', l.qty, { type: 'Receipt', refId: doc._id, by: req.user?.id });
  }
  doc.status = 'Done';
  await doc.save();
  res.json(doc);
});
r.patch('/:id', async (req, res) => {
  const doc = await Receipt.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!doc) return res.status(404).json({ error: 'not found' });
  res.json(doc);
});
export default r;
