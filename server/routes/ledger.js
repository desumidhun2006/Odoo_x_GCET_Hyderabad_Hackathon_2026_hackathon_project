import { Router } from 'express';
import { protect } from '../middleware/auth.js';
const r = Router();
r.use(protect);
r.get('/', (_req, res) => res.json([]));
r.get('/low-stock', (_req, res) => res.json([]));
export default r;
