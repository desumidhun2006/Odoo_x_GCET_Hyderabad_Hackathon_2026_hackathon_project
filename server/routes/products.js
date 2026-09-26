import { Router } from 'express';
import { protect } from '../middleware/auth.js';
const r = Router();
r.use(protect);
r.get('/', (_req, res) => res.json([]));
r.get('/search', (_req, res) => res.json([]));
r.get('/:id/stock', (_req, res) => res.json({ productId: _req.params.id, stock: [] }));
r.post('/', (req, res) => res.status(201).json(req.body));
export default r;
