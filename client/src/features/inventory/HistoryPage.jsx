import { useEffect, useState } from 'react';
import { api } from './useInventoryApi.js';
export default function HistoryPage() {
  const [rows, setRows] = useState([]);
  const [type, setType] = useState('');
  useEffect(() => { api(`/ledger${type ? `?type=${type}` : ''}`).then(setRows).catch(() => setRows([])); }, [type]);
  return (
    <section id="history"><h2>Move History / Stock Ledger</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">All types</option><option>Receipt</option><option>Delivery</option><option>Transfer</option><option>Adjustment</option>
      </select>
      <ul>{rows.map((l, i) => <li key={i}>{l.type} {l.delta} — {l.product?.sku || l.product}</li>)}</ul>
    </section>
  );
}
