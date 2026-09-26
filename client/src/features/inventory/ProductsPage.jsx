import { useEffect, useState } from 'react';
import { api } from './useInventoryApi.js';

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ name: '', sku: '', category: 'General', uom: 'units', reorderLevel: 10 });
  const [err, setErr] = useState('');

  const load = () => api(`/products${q ? `?q=${encodeURIComponent(q)}` : ''}`).then(setItems).catch((e) => setErr(String(e.message)));
  useEffect(() => { load(); }, [q]);

  const create = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.name.trim() || !form.sku.trim()) { setErr('Name and SKU required'); return; }
    try {
      await api('/products', { method: 'POST', body: JSON.stringify({ ...form, reorderLevel: Number(form.reorderLevel) }) });
      setForm({ name: '', sku: '', category: 'General', uom: 'units', reorderLevel: 10 });
      load();
    } catch (e2) { setErr(String(e2.message)); }
  };

  return (
    <section id="products">
      <h2>Products</h2>
      <input aria-label="sku-search" placeholder="SKU / name search…" value={q} onChange={(e) => setQ(e.target.value)} />
      <form onSubmit={create} style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
        <input placeholder="Name*" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="SKU*" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input placeholder="UoM" value={form.uom} onChange={(e) => setForm({ ...form, uom: e.target.value })} />
        <input type="number" min="0" placeholder="Reorder" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} style={{ width: 90 }} />
        <button type="submit">Add product</button>
      </form>
      {err && <p role="alert" style={{ color: 'crimson' }}>{err}</p>}
      <ul>{items.map((p) => <li key={p._id || p.sku}>{p.name} ({p.sku}) — {p.category} [{p.uom}] reorder@{p.reorderLevel}</li>)}</ul>
    </section>
  );
}
