import mongoose from 'mongoose';
const s = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, trim: true },
  locations: { type: [String], default: ['Main Store'] },
}, { timestamps: true });
export default mongoose.model('Warehouse', s);
