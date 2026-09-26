import mongoose from 'mongoose';
const line = new mongoose.Schema({ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, qty: { type: Number, required: true, min: 1 } }, { _id: false });
const s = new mongoose.Schema({
  fromWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  fromLocation: { type: String, default: 'Main Store' },
  toWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  toLocation: { type: String, default: 'Production Rack' },
  lines: [line],
  status: { type: String, enum: ['Draft', 'Waiting', 'Ready', 'Done', 'Canceled'], default: 'Draft', index: true },
  createdBy: String,
}, { timestamps: true });
export default mongoose.model('InternalTransfer', s);
