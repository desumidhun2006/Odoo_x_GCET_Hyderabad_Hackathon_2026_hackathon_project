import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Adjustment from '../models/Adjustment.js';
import Stock from '../models/Stock.js';
import Ledger from '../models/StockLedger.js';
const r = Router();
r.use(protect);
r.get('/', async (_req, res) => res.json(await Adjustment.find().populate('product warehouse').sort({ createdAt: -1 }).limit(200)));
r.post('/', async (req, res) => {
  try {
    const { product, warehouse, location = 'Main Store', countedQty, reason } = req.body;
    const cur = await Stock.findOne({ product, warehouse, location });
    const recorded = cur?.qty ?? 0;
    const diff = countedQty - recorded;
    const doc = await Adjustment.create({ product, warehouse, location, recordedQty: recorded, countedQty, diff, reason, createdBy: req.user?.id, status: 'Done' });
    const upd = await Stock.findOneAndUpdate({ product, warehouse, location }, { $set: { qty: countedQty } }, { upsert: true, new: true });
    await Ledger.create({ type: 'Adjustment', refId: doc._id, product, warehouse, location, delta: diff, balanceAfter: upd.qty, by: req.user?.id });
    res.status(201).json(doc);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
export default r;
