import mongoose from 'mongoose';
const s = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, trim: true, index: true },
  category: { type: String, default: 'General', index: true },
  uom: { type: String, default: 'units' },
  cost: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.model('Product', s);
