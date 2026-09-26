import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

dotenv.config({ path: '../.env' });
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'stocksense-server', time: new Date().toISOString() }));

// Feature routers (owned by `features` branch) — mounted in one block to avoid merge clashes with M2/M3
import products from './routes/products.js';
import warehouses from './routes/warehouses.js';
import receipts from './routes/receipts.js';
import deliveries from './routes/deliveries.js';
import transfers from './routes/transfers.js';
import adjustments from './routes/adjustments.js';
import ledger from './routes/ledger.js';

app.use('/api/products', products);
app.use('/api/warehouses', warehouses);
app.use('/api/receipts', receipts);
app.use('/api/deliveries', deliveries);
app.use('/api/transfers', transfers);
app.use('/api/adjustments', adjustments);
app.use('/api/ledger', ledger);

// Stitch UI (original design screens, wired live via stitch/live.js) — replaces old React client/
app.use(express.static(new URL('../stitch', import.meta.url).pathname));
app.get('/', (_req, res) => res.redirect('/dashboard.html'));

const PORT = process.env.PORT || 5000;
if (process.env.MONGO_URI) {
  connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => console.log(`stocksense-server on :${PORT}`));
  }).catch((e) => { console.error(e.message); process.exit(1); });
} else {
  app.listen(PORT, () => console.log(`stocksense-server on :${PORT} (no DB)`));
}
export default app;
