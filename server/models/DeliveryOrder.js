import mongoose from 'mongoose';
const line = new mongoose.Schema({ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, qty: { type: Number, required: true, min: 1 } }, { _id: false });
const s = new mongoose.Schema({
  customer: String,
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  lines: [line],
  status: { type: String, enum: ['Draft', 'Waiting', 'Ready', 'Done', 'Canceled'], default: 'Draft', index: true },
  createdBy: String,
}, { timestamps: true });
export default mongoose.model('DeliveryOrder', s);
