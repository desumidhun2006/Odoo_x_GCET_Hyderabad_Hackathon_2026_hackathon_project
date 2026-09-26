import { Router } from 'express';
import { protect } from '../middleware/auth.js';
const r = Router();
r.use(protect);
r.get('/', (_req, res) => res.json([]));
r.post('/', (req, res) => res.status(201).json(req.body));
export default r;
