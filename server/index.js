import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './db.js';

dotenv.config({ path: '../.env' });
dotenv.config();

// Auth (integrated from standalone-auth branch): needs a long JWT secret.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  process.env.JWT_SECRET = 'stocksense-demo-dev-secret-min-32-chars!!';
  console.warn('Using built-in dev JWT_SECRET — set a real one via env for production.');
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'stocksense-server', time: new Date().toISOString() }));

// Feature routers (owned by `features` branch) — mounted in one block to avoid merge clashes with M2/M3
import products from './routes/products.js';
import warehouses from './routes/warehouses.js';
import receipts from './routes/receipts.js';
import deliveries from './routes/deliveries.js';
import transfers from './routes/transfers.js';
import adjustments from './routes/adjustments.js';
import ledger from './routes/ledger.js';
import authRoutes from './auth/authRoutes.js';

app.use('/api/products', products);
app.use('/api/warehouses', warehouses);
app.use('/api/receipts', receipts);
app.use('/api/deliveries', deliveries);
app.use('/api/transfers', transfers);
app.use('/api/adjustments', adjustments);
app.use('/api/ledger', ledger);
app.use('/api/auth', authRoutes);

// Member 4 screens + main dashboard (index.html + app.js + style.css per folder)
for (const m of ['dashboard', 'login', 'receipts', 'stock', 'settings']) {
  app.use('/' + m, express.static(new URL('../' + m, import.meta.url).pathname));
}
app.get('/', (_req, res) => res.redirect('/login/'));

const PORT = process.env.PORT || 5000;
if (process.env.MONGO_URI) {
  connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => console.log(`stocksense-server on :${PORT}`));
  }).catch((e) => { console.error(e.message); process.exit(1); });
} else {
  app.listen(PORT, () => console.log(`stocksense-server on :${PORT} (no DB)`));
}
export default app;
