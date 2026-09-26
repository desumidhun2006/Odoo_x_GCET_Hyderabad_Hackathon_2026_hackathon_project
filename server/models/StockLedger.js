import mongoose from 'mongoose';
const s = new mongoose.Schema({
  type: { type: String, enum: ['Receipt', 'Delivery', 'Transfer', 'Adjustment'], required: true, index: true },
  refId: { type: mongoose.Schema.Types.ObjectId, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  location: String,
  delta: { type: Number, required: true },
  balanceAfter: Number,
  by: String,
}, { timestamps: true });
s.index({ product: 1, createdAt: -1 });
export default mongoose.model('StockLedger', s);
