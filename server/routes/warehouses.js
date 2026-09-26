import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Warehouse from '../models/Warehouse.js';
const r = Router();
r.use(protect);
r.get('/', async (_req, res) => res.json(await Warehouse.find().sort({ name: 1 })));
r.post('/', async (req, res) => {
  try { res.status(201).json(await Warehouse.create(req.body)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});
export default r;
