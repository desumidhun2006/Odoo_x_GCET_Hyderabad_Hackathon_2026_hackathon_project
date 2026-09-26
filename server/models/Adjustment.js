import mongoose from 'mongoose';
const s = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  location: { type: String, default: 'Main Store' },
  recordedQty: Number,
  countedQty: { type: Number, required: true },
  diff: Number,
  reason: String,
  status: { type: String, enum: ['Draft', 'Done'], default: 'Done' },
  createdBy: String,
}, { timestamps: true });
export default mongoose.model('Adjustment', s);
