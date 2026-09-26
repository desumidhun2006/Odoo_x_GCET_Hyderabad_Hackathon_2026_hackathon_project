import { useEffect, useState } from 'react';
import { api } from './useInventoryApi.js';

// Fallback dashboard panel for M3 — M3 owns the real Dashboard page; this proves the KPIs contract.
export default function DashboardPanel() {
  const [kpis, setKpis] = useState(null);
  const [low, setLow] = useState([]);
  const [err, setErr] = useState('');
  useEffect(() => {
    api('/ledger/dashboard-summary').then(setKpis).catch((e) => setErr(String(e.message)));
    api('/ledger/low-stock').then(setLow).catch(() => {});
  }, []);
  return (
    <section id="dashboard-kpis">
      <h2>Dashboard KPIs (contract preview for M3)</h2>
      {err && <p role="alert" style={{ color: 'crimson' }}>{err} — start server with MONGO_URI</p>}
      {kpis && (
        <ul>
          <li>Total products: {kpis.totalProducts}</li>
          <li>Low stock: {kpis.lowStock} · Out of stock: {kpis.outOfStock}</li>
          <li>Pending receipts: {kpis.pendingReceipts} · deliveries: {kpis.pendingDeliveries} · transfers: {kpis.scheduledTransfers}</li>
        </ul>
      )}
      {low.length > 0 && (
        <>
          <h3>Low-stock alerts</h3>
          <ul>{low.map((l, i) => <li key={i}>{l.product?.sku} @ {l.location}: {l.qty} ≤ {l.reorderLevel}</li>)}</ul>
        </>
      )}
    </section>
  );
}
