import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Delivery from '../models/DeliveryOrder.js';
import { bump, getQty } from '../lib/stock.js';
const r = Router();
r.use(protect);
r.get('/', async (req, res) => {
  const f = {};
  if (req.query.status) f.status = req.query.status;
  if (req.query.warehouseId) f.warehouse = req.query.warehouseId;
  res.json(await Delivery.find(f).populate('warehouse lines.product').sort({ createdAt: -1 }).limit(200));
});
r.post('/', async (req, res) => {
  try {
    const doc = await Delivery.create({ ...req.body, createdBy: req.user?.id, status: req.body.status || 'Draft' });
    res.status(201).json(doc);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
r.post('/:id/validate', async (req, res) => {
  const doc = await Delivery.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'not found' });
  if (doc.status === 'Done') return res.json(doc);
  const loc = req.body.location || 'Main Store';
  for (const l of doc.lines) {
    const q = await getQty(l.product, doc.warehouse, loc);
    if (q < l.qty) return res.status(400).json({ error: `insufficient stock for ${l.product}: have ${q}, need ${l.qty}` });
  }
  for (const l of doc.lines) {
    await bump(l.product, doc.warehouse, loc, -l.qty, { type: 'Delivery', refId: doc._id, by: req.user?.id });
  }
  doc.status = 'Done';
  await doc.save();
  res.json(doc);
});
r.patch('/:id', async (req, res) => {
  const doc = await Delivery.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!doc) return res.status(404).json({ error: 'not found' });
  res.json(doc);
});
export default r;
