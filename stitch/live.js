/* StockSense live bridge: wires Stitch mock screens to the real /api backend.
   Served same-origin by express, so no CORS issues. */
(function () {
  const PAGE = (document.currentScript && document.currentScript.dataset.page) || '';
  const api = async (m, p, b) => {
    const r = await fetch(p, { method: m, headers: { 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || ('HTTP ' + r.status));
    return j;
  };

  // toast (pages have inconsistent/absent toast markup, so bring our own)
  let toastEl = null;
  function toast(msg, ok) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'liveToast';
      toastEl.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;padding:12px 18px;border-radius:8px;font:600 14px system-ui;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.25)';
      document.body.appendChild(toastEl);
    }
    toastEl.style.background = ok === false ? '#DC2626' : '#059669';
    toastEl.textContent = msg;
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.remove(), 4000);
    toastEl._t && (toastEl.isConnected || document.body.appendChild(toastEl));
  }

  // demo session gate (logout works via sign-out link; real auth = member-2 module)
  try {
    if (!localStorage.getItem('stocksense_user')) {
      location.href = '/login.html';
      return;
    }
  } catch (e) { /* storage unavailable: stay on page */ }

  // sidebar nav (mock hrefs are '#') -> real pages
  const NAV = { dashboard: 'dashboard.html', 'receipts-incoming': 'receipts.html', 'delivery-orders': 'deliveries.html', 'internal-transfers': 'transfers.html', 'stock-adjustments': 'transfers.html', 'move-history-ledger': 'dashboard.html' };
  document.querySelectorAll('a[data-path]').forEach((a) => {
    const key = a.getAttribute('data-path');
    if (key === 'sign-out') {
      a.setAttribute('href', '/login.html');
      a.addEventListener('click', () => { try { localStorage.removeItem('stocksense_user'); } catch (e) {} });
      return;
    }
    if (key === 'profile-settings') {
      a.setAttribute('href', '#');
      a.addEventListener('click', (ev) => { ev.preventDefault(); toast('Demo profile: signed in as ' + currentUser()); });
      return;
    }
    const target = NAV[key];
    if (target) a.setAttribute('href', '/' + target);
  });

  function currentUser() {
    try { return (JSON.parse(localStorage.getItem('stocksense_user')) || {}).email || 'demo user'; }
    catch (e) { return 'demo user'; }
  }

  async function ctx() {
    const [warehouses, products] = await Promise.all([api('GET', '/api/warehouses'), api('GET', '/api/products')]);
    if (!warehouses.length || !products.length) throw new Error('seed the API first (npm run seed)');
    return { wh: warehouses[0], product: products[0], warehouses, products };
  }

  // ---- dashboard: live KPIs + live ledger rows ----
  async function dashboard() {
    try {
      const s = await api('GET', '/api/ledger/dashboard-summary');
      const kpis = document.querySelectorAll('div.font-headline-xl');
      const vals = [
        String(s.totalUnits ?? s.totalProducts ?? ''),
        (s.lowStock + s.outOfStock) + ' Alerts',
        s.pendingReceipts + ' Shipments',
        s.pendingDeliveries + ' Orders',
        s.scheduledTransfers + ' Moves',
      ];
      kpis.forEach((el, i) => { if (vals[i] !== undefined && vals[i] !== '') el.innerHTML = vals[i] + ' <span style="font-size:.6em;vertical-align:middle;background:#059669;color:#fff;border-radius:99px;padding:1px 8px;">LIVE</span>'; });
    } catch (e) { console.warn('live kpis:', e.message); }
    try {
      const rows = await api('GET', '/api/ledger');
      const tb = document.getElementById('operationsTableBody');
      if (!tb || !rows.length) return;
      const meta = { Receipt: ['receipts', 'call_received', '+'], Delivery: ['deliveries', 'local_shipping', '-'], Transfer: ['transfers', 'swap_horiz', '⇄'], Adjustment: ['adjustments', 'tune', '⟳'] };
      const html = rows.slice(0, 6).map((l) => {
        const m = meta[l.type] || meta.Receipt;
        const sku = (l.product && (l.product.sku || l.product)) || '';
        const d = new Date(l.createdAt).toLocaleTimeString();
        return '<tr data-doctype="' + m[0] + '" data-status="done" data-live="1" style="background:#ECFDF5">'
          + '<td class="py-3 px-3"><div class="font-code-data" style="font-weight:700">LIVE-' + String(l._id).slice(-6).toUpperCase() + '</div><div style="font-size:10px;opacity:.7">Live API • ' + d + '</div></td>'
          + '<td class="py-3 px-3"><div style="font-weight:600">' + l.type + '</div><div style="font-size:12px;opacity:.7">SKU: ' + sku + '</div></td>'
          + '<td class="py-3 px-3">' + (l.location || '') + '</td>'
          + '<td class="py-3 px-3" style="font-weight:700">' + m[2] + Math.abs(l.delta) + '</td>'
          + '<td class="py-3 px-3"><span style="background:#059669;color:#fff;border-radius:99px;padding:2px 10px;font-size:12px;">Done</span></td>'
          + '<td class="py-3 px-3 text-right"><span style="font-size:12px;opacity:.7">bal ' + l.balanceAfter + '</span></td></tr>';
      }).join('');
      tb.insertAdjacentHTML('afterbegin', html);
    } catch (e) { console.warn('live ledger:', e.message); }
  }

  // ---- receipts: Validate button creates + validates a real receipt ----
  async function receipts() {
    const btn = document.getElementById('validateBtn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      try {
        const c = await ctx();
        const q = Math.max(1, Number((document.getElementById('qty1') || {}).value) || 1);
        const doc = await api('POST', '/api/receipts', { supplier: 'Live UI', warehouse: c.wh._id, lines: [{ product: c.product._id, qty: q }] });
        await api('POST', '/api/receipts/' + doc._id + '/validate', { location: 'Main Store' });
        toast('Receipt validated: +' + q + ' ' + c.product.sku + ' (live)');
      } catch (e) { toast(String(e.message), false); }
    });
  }

  // ---- deliveries: Validate button creates + validates a real delivery ----
  async function deliveries() {
    const btn = document.getElementById('validateBtn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      try {
        const c = await ctx();
        // pick first product with stock available
        let pick = null;
        for (const p of c.products) {
          const st = await api('GET', '/api/products/' + p._id + '/stock');
          const tot = st.reduce((a, s) => a + s.qty, 0);
          if (tot > 0) { pick = { p, tot }; break; }
        }
        if (!pick) throw new Error('no stock available to deliver');
        const q = Math.min(2, pick.tot);
        const doc = await api('POST', '/api/deliveries', { customer: 'Live UI', warehouse: c.wh._id, lines: [{ product: pick.p._id, qty: q }] });
        await api('POST', '/api/deliveries/' + doc._id + '/validate', { location: 'Main Store' });
        toast('Delivery validated: -' + q + ' ' + pick.p.sku + ' (live)');
      } catch (e) { toast(String(e.message), false); }
    });
  }

  // ---- transfers page: Validate Transfer + Commit (adjustment) ----
  function btnByText(t) {
    return Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim().includes(t));
  }
  async function productWithStock(c) {
    for (const p of c.products) {
      const st = await api('GET', '/api/products/' + p._id + '/stock');
      if (st.reduce((a, s) => a + s.qty, 0) > 0) return p;
    }
    return null;
  }
  async function transfers() {
    const v = btnByText('Validate Transfer');
    if (v) v.addEventListener('click', async () => {
      try {
        const c = await ctx();
        const p = await productWithStock(c);
        if (!p) throw new Error('no stock available to transfer');
        const doc = await api('POST', '/api/transfers', {
          fromWarehouse: c.wh._id, fromLocation: 'Main Store',
          toWarehouse: c.wh._id, toLocation: 'Production Rack',
          lines: [{ product: p._id, qty: 1 }],
        });
        await api('POST', '/api/transfers/' + doc._id + '/validate', {});
        toast('Transfer validated: Main Store → Production Rack (live)');
      } catch (e) { toast(String(e.message), false); }
    });
    const commit = btnByText('Commit');
    if (commit) commit.addEventListener('click', async () => {
      try {
        const c = await ctx();
        const st = await api('GET', '/api/products/' + c.product._id + '/stock');
        const cur = st.length ? st[0].qty : 0;
        await api('POST', '/api/adjustments', { product: c.product._id, warehouse: c.wh._id, location: 'Main Store', countedQty: Math.max(0, cur - 1), reason: 'live demo audit' });
        toast('Adjustment committed (live audit)');
      } catch (e) { toast(String(e.message), false); }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (PAGE === 'dashboard') dashboard();
    if (PAGE === 'receipts') receipts();
    if (PAGE === 'deliveries') deliveries();
    if (PAGE === 'transfers') transfers();
  });
})();
