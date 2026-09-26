import mongoose from 'mongoose';
const s = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  location: { type: String, default: 'Main Store' },
  qty: { type: Number, default: 0 },
}, { timestamps: true });
s.index({ product: 1, warehouse: 1, location: 1 }, { unique: true });
export default mongoose.model('Stock', s);
