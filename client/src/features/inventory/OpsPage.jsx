import { useState } from 'react';
import { api } from './useInventoryApi.js';
export default function OpsPage() {
  const [msg, setMsg] = useState('');
  const validate = async (kind, id) => {
    try { await api(`/${kind}/${id}/validate`, { method: 'POST', body: JSON.stringify({}) }); setMsg(`${kind} ${id} validated`); }
    catch (e) { setMsg(String(e.message)); }
  };
  return (
    <section id="ops"><h2>Operations (Receipts / Delivery / Transfers / Adjustments)</h2>
      <p>Use validate endpoints to move stock. Ledger auto-updates.</p>
      <button onClick={() => validate('receipts', 'demo')}>Validate demo receipt</button>
      <p>{msg}</p>
    </section>
  );
}
