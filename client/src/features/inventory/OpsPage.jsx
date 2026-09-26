import { useState } from 'react';
import { api } from './useInventoryApi.js';

// Generic single-line op form: creates draft then validates it. Keeps demo fast without product picker.
function OpForm({ kind, title, extraFields }) {
  const [f, setF] = useState({ warehouse: '', product: '', qty: 1, ...extraFields });
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!f.warehouse || !f.product || Number(f.qty) < 1) { setMsg('warehouse + product + qty>=1 required'); return; }
    try {
      const body = kind === 'transfers'
        ? { fromWarehouse: f.warehouse, toWarehouse: f.warehouse2 || f.warehouse, fromLocation: 'Main Store', toLocation: f.toLocation || 'Production Rack', lines: [{ product: f.product, qty: Number(f.qty) }] }
        : kind === 'adjustments'
          ? { warehouse: f.warehouse, product: f.product, location: 'Main Store', countedQty: Number(f.qty), reason: f.reason || 'count' }
          : { warehouse: f.warehouse, lines: [{ product: f.product, qty: Number(f.qty) }] };
      const created = await api(`/${kind}`, { method: 'POST', body: JSON.stringify(body) });
      if (kind !== 'adjustments') {
        await api(`/${kind}/${created._id}/validate`, { method: 'POST', body: JSON.stringify({}) });
      }
      setMsg(`${title} done (${created._id})`);
    } catch (e2) { setMsg(String(e2.message || e2)); }
  };
  return (
    <form onSubmit={submit} style={{ border: '1px solid #ddd', padding: 12, marginTop: 8 }}>
      <h3>{title}</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="warehouseId" value={f.warehouse} onChange={(e) => setF({ ...f, warehouse: e.target.value })} />
        <input placeholder="productId" value={f.product} onChange={(e) => setF({ ...f, product: e.target.value })} />
        <input type="number" min="1" placeholder={kind === 'adjustments' ? 'countedQty' : 'qty'} value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} style={{ width: 100 }} />
        {kind === 'transfers' && <input placeholder="toWarehouseId (=same ok)" value={f.warehouse2 || ''} onChange={(e) => setF({ ...f, warehouse2: e.target.value })} />}
        <button type="submit">Create + validate</button>
      </div>
      {msg && <p>{msg}</p>}
    </form>
  );
}

export default function OpsPage() {
  return (
    <section id="ops">
      <h2>Operations</h2>
      <p>Receipts +stock · Delivery −stock (guarded) · Transfers move location · Adjustments set counted qty. IDs from Products/Warehouses APIs or seed.</p>
      <OpForm kind="receipts" title="Receipt (incoming)" />
      <OpForm kind="deliveries" title="Delivery (outgoing)" />
      <OpForm kind="transfers" title="Internal transfer" />
      <OpForm kind="adjustments" title="Stock adjustment" />
    </section>
  );
}
