import { useEffect, useState } from 'react';
import { api } from './useInventoryApi.js';
export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  useEffect(() => { api(`/products${q ? `?q=${encodeURIComponent(q)}` : ''}`).then(setItems).catch(() => setItems([])); }, [q]);
  return (
    <section id="products"><h2>Products</h2>
      <input placeholder="SKU search…" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul>{items.map((p) => <li key={p._id || p.sku}>{p.name} ({p.sku}) — {p.category} [{p.uom}]</li>)}</ul>
    </section>
  );
}
