import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Transfer from '../models/InternalTransfer.js';
import { bump, getQty } from '../lib/stock.js';
const r = Router();
r.use(protect);
r.get('/', async (req, res) => {
  const f = {};
  if (req.query.status) f.status = req.query.status;
  res.json(await Transfer.find(f).populate('fromWarehouse toWarehouse lines.product').sort({ createdAt: -1 }).limit(200));
});
r.post('/', async (req, res) => {
  try {
    const doc = await Transfer.create({ ...req.body, createdBy: req.user?.id, status: req.body.status || 'Draft' });
    res.status(201).json(doc);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
r.post('/:id/validate', async (req, res) => {
  const doc = await Transfer.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'not found' });
  if (doc.status === 'Done') return res.json(doc);
  for (const l of doc.lines) {
    const q = await getQty(l.product, doc.fromWarehouse, doc.fromLocation);
    if (q < l.qty) return res.status(400).json({ error: `insufficient at source: have ${q}, need ${l.qty}` });
  }
  for (const l of doc.lines) {
    await bump(l.product, doc.fromWarehouse, doc.fromLocation, -l.qty, { type: 'Transfer', refId: doc._id, by: req.user?.id });
    await bump(l.product, doc.toWarehouse, doc.toLocation, l.qty, { type: 'Transfer', refId: doc._id, by: req.user?.id });
  }
  doc.status = 'Done';
  await doc.save();
  res.json(doc);
});
export default r;
