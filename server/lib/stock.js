import Stock from '../models/Stock.js';
import Ledger from '../models/StockLedger.js';

export async function bump(product, warehouse, location, delta, { type, refId, by }) {
  const doc = await Stock.findOneAndUpdate(
    { product, warehouse, location },
    { $inc: { qty: delta } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await Ledger.create({ type, refId, product, warehouse, location, delta, balanceAfter: doc.qty, by });
  return doc;
}
export async function getQty(product, warehouse, location) {
  const d = await Stock.findOne({ product, warehouse, location });
  return d?.qty ?? 0;
}
