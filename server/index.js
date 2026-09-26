import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import { connectDB } from './db.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedDemo } from './seed-demo-data.mjs';
import Product from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from root and current directory
dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config();

// Auth secret configuration
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  process.env.JWT_SECRET = 'stocksense-demo-dev-secret-min-32-chars!!';
  console.warn('Using built-in dev JWT_SECRET — set a real one via env for production.');
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

let dbStatus = {
  connected: false,
  mode: 'initializing',
  uri: '',
  error: null
};

app.get('/api/health', (_req, res) => res.json({
  ok: true,
  service: 'stocksense-server',
  db: dbStatus,
  time: new Date().toISOString()
}));

// Feature routers
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

// Static routes for frontend modules
for (const m of ['dashboard', 'login', 'receipts', 'stock', 'settings']) {
  app.use('/' + m, express.static(path.join(rootDir, m)));
}
app.get('/', (_req, res) => res.redirect('/dashboard/'));

const PORT = process.env.PORT || 3333;
const targetMongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

async function startServer() {
  let connected = false;

  if (targetMongoUri) {
    try {
      console.log(`🔌 Attempting connection to MongoDB Atlas...`);
      await connectDB(targetMongoUri);
      console.log(`✅ Connected to MongoDB Atlas successfully!`);
      dbStatus = { connected: true, mode: 'mongodb-atlas', uri: targetMongoUri.replace(/:([^:@]+)@/, ':****@'), error: null };
      connected = true;
    } catch (err) {
      console.warn(`⚠️ MongoDB Atlas connection error: ${err.message}`);
      dbStatus = { connected: false, mode: 'fallback-memory', uri: '', error: err.message };
    }
  }

  // If Atlas is not reachable or bad auth, start in-memory Mongo server so system stays fully operational
  if (!connected) {
    try {
      console.log(`📦 Starting fallback in-memory MongoDB server...`);
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await connectDB(memUri);
      console.log(`✨ Connected to in-memory MongoDB instance.`);
      dbStatus.connected = true;
      dbStatus.mode = 'in-memory-fallback';
      connected = true;
    } catch (memErr) {
      console.error(`❌ In-memory MongoDB failed to start: ${memErr.message}`);
    }
  }

  // Seed demo data if database is empty
  if (connected) {
    try {
      const prodCount = await Product.countDocuments();
      if (prodCount === 0) {
        console.log(`🌱 Database is empty. Seeding initial StockSense demo dataset...`);
        const result = await seedDemo();
        console.log(`✅ Seed complete: ${result.products} products, ${result.warehouses} warehouses seeded.`);
      }
    } catch (seedErr) {
      console.warn(`⚠️ Auto-seed warning: ${seedErr.message}`);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 StockSense Platform active at http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard/`);
    console.log(`🔐 Login:     http://localhost:${PORT}/login/`);
  });
}

startServer();

export default app;
