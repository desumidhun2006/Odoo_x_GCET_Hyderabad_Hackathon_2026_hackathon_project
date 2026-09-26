/**
 * StockSense — Intelligent Inventory & Operations Platform
 * Cinema-Grade Reactive State Engine
 */

// ═══════════════════════ REACTIVE INVENTORY STATE (live API — no mock data) ═══════════════════════
const state = {
  currentView: 'dashboard',
  receiptViewMode: 'list', // 'list' | 'kanban'
  deliveryViewMode: 'list',

  warehouses: [],   // [{ id, name, code, locations[] }] — from /api/warehouses
  products: [],     // live-mapped: { id(_id), name, sku, category, location, uom, cost:0, onHand, freeToUse, reorderPoint, whId }
  receipts: [],     // live-mapped: { _id, id(ref), from, to, contact, date, status, items[{name,qty,productId}], warehouseId }
  deliveries: [],   // live-mapped: same shape as receipts
  transfers: [],    // live-mapped: { _id, id(ref), from, to, product, qty, date, status }
  history: [],      // from /api/ledger
  activities: [],   // derived from latest ledger entries

  currentEditingReceipt: null,
  currentEditingDelivery: null,
  currentEditingProduct: null
};

// ═══════════════════════ LIVE API LAYER ═══════════════════════
async function api(method, path, body) {
  const r = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || ('HTTP ' + r.status));
  return data;
}

const shortRef = (prefix, _id) => `${prefix}-${String(_id).slice(-6).toUpperCase()}`;
const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString(); } catch (e) { return '—'; } };

async function loadLive() {
  const [warehouses, products, receipts, deliveries, transfers, ledger] = await Promise.all([
    api('GET', '/api/warehouses').catch(() => []),
    api('GET', '/api/products').catch(() => []),
    api('GET', '/api/receipts').catch(() => []),
    api('GET', '/api/deliveries').catch(() => []),
    api('GET', '/api/transfers').catch(() => []),
    api('GET', '/api/ledger').catch(() => []),
  ]);

  state.warehouses = warehouses.map(w => ({ id: w._id, name: w.name, code: w.code, locations: w.locations || ['Main Store'] }));

  const mapped = [];
  for (const p of products) {
    let onHand = 0, locName = state.warehouses[0]?.name || '—', whId = state.warehouses[0]?.id || null, loc = 'Main Store';
    try {
      const st = await api('GET', `/api/products/${p._id}/stock`);
      onHand = st.reduce((a, s) => a + (s.qty || 0), 0);
      if (st.length) {
        locName = (st[0].warehouse && st[0].warehouse.name) || locName;
        whId = (st[0].warehouse && (st[0].warehouse._id || st[0].warehouse)) || whId;
        loc = st[0].location || loc;
      }
    } catch (e) { /* no stock rows yet */ }
    mapped.push({
      id: p._id, name: p.name, sku: p.sku, category: p.category || 'General',
      location: locName, uom: p.uom || 'units', cost: p.cost ?? 0,
      onHand, freeToUse: onHand, reorderPoint: p.reorderLevel ?? 10,
      whId, loc,
    });
  }
  state.products = mapped;

  const prodName = (l) => (l.product && (l.product.name || l.product.sku)) || 'Item';
  state.receipts = receipts.map(d => ({
    _id: d._id, id: shortRef('IN', d._id),
    from: d.supplier || '—', to: (d.warehouse && d.warehouse.name) || '—',
    contact: d.supplier || '—', date: fmtDate(d.createdAt), status: d.status,
    isLate: false,
    items: (d.lines || []).map(l => ({ name: prodName(l), qty: l.qty, productId: (l.product && (l.product._id || l.product)) || null })),
    warehouseId: (d.warehouse && (d.warehouse._id || d.warehouse)) || null,
  }));

  state.deliveries = deliveries.map(d => ({
    _id: d._id, id: shortRef('OUT', d._id),
    from: (d.warehouse && d.warehouse.name) || '—', to: d.customer || '—',
    contact: d.customer || '—', date: fmtDate(d.createdAt), status: d.status,
    isLate: false,
    items: (d.lines || []).map(l => ({ name: prodName(l), qty: l.qty, productId: (l.product && (l.product._id || l.product)) || null })),
    warehouseId: (d.warehouse && (d.warehouse._id || d.warehouse)) || null,
  }));

  state.transfers = transfers.map(d => ({
    _id: d._id, id: shortRef('INT', d._id),
    from: d.fromLocation || '—', to: d.toLocation || '—',
    product: d.lines && d.lines.length ? prodName(d.lines[0]) : '—',
    qty: d.lines ? d.lines.reduce((a, l) => a + l.qty, 0) : 0,
    date: fmtDate(d.createdAt), status: d.status,
  }));

  const typeIcon = { Receipt: '📥', Delivery: '📤', Transfer: '🔄', Adjustment: '⚖️' };
  const typeName = { Receipt: 'IN', Delivery: 'OUT', Transfer: 'Internal', Adjustment: 'Adjustment' };
  state.history = ledger.map(l => ({
    ref: shortRef('LED', l._id),
    date: fmtDate(l.createdAt),
    product: (l.product && (l.product.name || l.product.sku)) || 'Item',
    contact: l.by || 'System',
    from: l.location || '—', to: (l.warehouse && l.warehouse.name) || '—',
    qty: l.delta, type: typeName[l.type] || l.type, status: 'Done',
    _at: l.createdAt,
  }));

  state.activities = ledger.slice(0, 4).map(l => ({
    icon: typeIcon[l.type] || '📦',
    text: `<strong>${l.type}</strong> ${l.delta > 0 ? '+' + l.delta : l.delta} × ${((l.product && (l.product.name || l.product.sku)) || 'Item')}`,
    time: fmtDate(l.createdAt),
  }));
  const low = state.products.filter(p => p.onHand <= p.reorderPoint);
  if (low.length) {
    state.activities.push({ icon: '⚠️', text: `Low stock alert: <strong>${low[0].name}</strong> (${low[0].onHand} units remaining)`, time: 'Now' });
  }

  populateLiveSelects();
}

async function refreshLive() {
  try { await loadLive(); }
  catch (e) { showToast('⚠️ API sync failed — ' + e.message); }
  initDashboard();
}

function populateLiveSelects() {
  const setOpts = (id, values, allLabel) => {
    const el = document.getElementById(id);
    if (!el) return;
    const cur = el.value;
    el.innerHTML = `<option value="">${allLabel}</option>` + values.map(v => `<option>${v}</option>`).join('');
    if (values.includes(cur)) el.value = cur;
  };
  setOpts('warehouseFilter', state.warehouses.map(w => w.name), 'All Warehouses');
  setOpts('categoryFilter', [...new Set(state.products.map(p => p.category))].sort(), 'All Categories');
  setOpts('productCategoryFilter', [...new Set(state.products.map(p => p.category))].sort(), 'All Categories');
  const pfLoc = document.getElementById('pf-location');
  if (pfLoc) {
    pfLoc.innerHTML = state.warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('') || '<option value="">No warehouses</option>';
  }
  const whTrigger = document.querySelector('#whLink')?.closest('.nav-dropdown-trigger');
  const dd = whTrigger ? whTrigger.querySelector('.crystal-dropdown') : null;
  if (dd && state.warehouses.length) {
    dd.innerHTML = state.warehouses.map(w => `
      <a href="#" onclick="selectWarehouse('${w.name.replace(/'/g, "\\'")}'); return false;">
        <span class="drop-icon wh">🏢</span>
        <div class="drop-meta"><span class="drop-title">${w.name}</span><span class="drop-desc">${w.code}</span></div>
      </a>`).join('');
  }
}

// ═══════════════════════ INITIALIZATION (auth gate + live API first) ═══════════════════════
async function requireAuth() {
  try {
    const r = await fetch('/api/auth/me', { credentials: 'include' });
    if (r.ok) {
      const data = await r.json().catch(() => ({}));
      if (data.user) {
        try {
          localStorage.setItem('stocksense_profile', JSON.stringify({
            name: data.user.name, email: data.user.email,
            role: data.user.role === 'admin' ? 'Inventory Admin' : 'Inventory Staff',
          }));
        } catch (e) {}
      }
      return true;
    }
  } catch (e) {}
  location.href = '/login/';
  return false;
}

function renderDemoProfile() {
  let prof = { name: 'Demo Manager', email: 'demo@stocksense.io', role: 'Inventory Admin' };
  try {
    const saved = JSON.parse(localStorage.getItem('stocksense_profile'));
    if (saved && saved.email) prof = saved;
  } catch (e) {}
  const set = (sel, txt) => document.querySelectorAll(sel).forEach(el => { el.innerText = txt; });
  set('.p-name', prof.name); set('.p-role', prof.role); set('.p-email', prof.email);
  const ini = prof.name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  set('.profile-lg', ini); set('.avatar-inner', ini);
}

async function doLogout() {
  try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch (e) {}
  try { localStorage.removeItem('stocksense_profile'); } catch (e) {}
  location.href = '/login/';
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!(await requireAuth())) return;
  try {
    await loadLive();
  } catch (e) {
    console.warn("API offline, rendering empty:", e.message);
    const badgeEl = document.getElementById("stockCountBadge");
    if (badgeEl) badgeEl.innerText = "API offline";
  }
  initDashboard();
  initLiquidAtmosphere();
  initDropdownInteractions();
});

function initDashboard() {
  renderDemoProfile();
  updateCurrentDate();
  renderKPIs();
  renderStockTable();
  renderAlerts();
  renderActivities();
  renderReceipts();
  renderDeliveries();
  renderProducts();
  renderHistory();
  renderAdjustments();
  initCharts();
}

function updateCurrentDate() {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const today = new Date();
  const el = document.getElementById("currentDate");
  if (el) el.innerText = today.toLocaleDateString("en-US", options);
}

// ═══════════════════════ AMBIENT LIQUID MOUSE GLOW & CAUSTICS ═══════════════════════
function initLiquidAtmosphere() {
  const glow = document.getElementById("mouseGlow");

  window.addEventListener("mousemove", (e) => {
    if (glow) {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
      glow.style.opacity = "1";
    }

    // Dynamic optical caustic reflection following cursor on glass cards
    const card = e.target.closest('.kpi-glass-card, .crystal-card, .chart-card-velocity, .chart-card-distribution, .glass-navbar');
    if (card) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }
  });

  window.addEventListener("mouseleave", () => {
    if (glow) glow.style.opacity = "0";
  });
}

// ═══════════════════════ VIEW SWITCHING ═══════════════════════
function switchView(viewName, clickedElement) {
  state.currentView = viewName;

  // Toggle active class on nav links
  document.querySelectorAll(".nav-pill").forEach(link => {
    link.classList.remove("active");
  });
  if (clickedElement && clickedElement.classList) {
    clickedElement.classList.add("active");
  } else {
    const targetLink = document.querySelector(`.nav-pill[data-view="${viewName}"]`);
    if (targetLink) targetLink.classList.add("active");
  }

  // Show selected view section
  document.querySelectorAll(".view").forEach(view => {
    view.classList.add("hidden");
    view.classList.remove("active");
  });
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.classList.remove("hidden");
    targetView.classList.add("active");
  }

  // Refresh view contents
  if (viewName === 'dashboard') {
    renderKPIs();
    renderStockTable();
    initCharts();
  } else if (viewName === 'receipts') {
    renderReceipts();
  } else if (viewName === 'deliveries') {
    renderDeliveries();
  } else if (viewName === 'products') {
    renderProducts();
  } else if (viewName === 'history') {
    renderHistory();
  } else if (viewName === 'adjustments') {
    renderAdjustments();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function refreshDashboard() {
  showToast("↻ Warehouse telemetry synchronized with ledger");
  initDashboard();
}

// ═══════════════════════ KPI CALCULATIONS ═══════════════════════
function renderKPIs() {
  const totalUnits = state.products.reduce((acc, p) => acc + p.onHand, 0);
  const lowStockCount = state.products.filter(p => p.onHand <= p.reorderPoint).length;
  const pendingReceipts = state.receipts.filter(r => r.status !== 'Done' && r.status !== 'Canceled').length;
  const pendingDeliveries = state.deliveries.filter(d => d.status !== 'Done' && d.status !== 'Canceled').length;
  const transfersCount = state.transfers.filter(t => t.status !== 'Done').length;

  const totalEl = document.getElementById("kpiTotalProducts");
  if (totalEl) totalEl.innerText = totalUnits;

  const lowEl = document.getElementById("kpiLowStock");
  if (lowEl) lowEl.innerText = lowStockCount;

  const inEl = document.getElementById("kpiPendingReceipts");
  if (inEl) inEl.innerText = pendingReceipts;

  const outEl = document.getElementById("kpiPendingDeliveries");
  if (outEl) outEl.innerText = pendingDeliveries;

  const trEl = document.getElementById("kpiTransfers");
  if (trEl) trEl.innerText = transfersCount;
  
  const alertCountEl = document.getElementById("alertCount");
  if (alertCountEl) alertCountEl.innerText = lowStockCount;

  const badgeEl = document.getElementById("stockCountBadge");
  if (badgeEl) badgeEl.innerText = `${state.products.length} SKUs Active`;

  if (typeof renderCategoryDonutChart === 'function') renderCategoryDonutChart();
  if (typeof renderWarehouseCapacity === 'function') renderWarehouseCapacity();
}

// ═══════════════════════ STOCK SUMMARY TABLE ═══════════════════════
function renderStockTable(filteredList = null) {
  const tbody = document.getElementById("stockTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const list = filteredList || state.products;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 3rem; color: var(--text-dim); font-family:var(--font-mono)">No matching stock records found.</td></tr>`;
    return;
  }

  list.forEach(p => {
    let statusBadge = '';
    let gaugeClass = 'optimal';
    let gaugePct = p.reorderPoint > 0 ? Math.min(100, Math.round((p.onHand / (p.reorderPoint * 2)) * 100)) : (p.onHand > 0 ? 100 : 0);

    if (p.onHand === 0) {
      statusBadge = '<span class="badge badge-red"><span class="beacon" style="background:#fb7185"></span>Out of Stock</span>';
      gaugeClass = 'danger';
      gaugePct = 0;
    } else if (p.onHand <= p.reorderPoint) {
      statusBadge = '<span class="badge badge-orange"><span class="beacon" style="background:#fbbf24"></span>Low Stock</span>';
      gaugeClass = 'warning';
      gaugePct = 35;
    } else {
      statusBadge = '<span class="badge badge-green"><span class="beacon"></span>In Stock</span>';
      gaugeClass = 'optimal';
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div style="font-weight:700; color:var(--text-head)">${p.name}</div>
        <div style="font-size:0.72rem; color:var(--text-dim)">UoM: ${p.uom}</div>
      </td>
      <td><span class="sku-tag">${p.sku}</span></td>
      <td><span style="font-size:0.82rem; color:var(--text-muted)">${p.category}</span></td>
      <td><span style="font-size:0.82rem; color:var(--text-muted)">${p.location}</span></td>
      <td style="font-family:var(--font-mono); font-weight:600">₹${p.cost.toLocaleString('en-IN')}</td>
      <td>
        <div class="stock-gauge-wrap">
          <span style="font-family:var(--font-mono); font-weight:700; color:var(--text-head)">${p.onHand}</span>
          <div class="stock-track"><div class="stock-fill ${gaugeClass}" style="width:${gaugePct}%"></div></div>
        </div>
      </td>
      <td style="font-family:var(--font-mono); font-weight:600; color:var(--text-body)">${p.freeToUse}</td>
      <td>${statusBadge}</td>
      <td>
        <div class="row-actions">
          <button class="action-btn-sm" title="Physical Count Audit" onclick="quickAdjustProduct(${p.id})">⚖ Audit</button>
          <button class="action-btn-sm" title="View in Catalog" onclick="switchView('products', null)">👁</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterStockTable(query) {
  const q = query.toLowerCase().trim();
  const filtered = state.products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.sku.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.location.toLowerCase().includes(q)
  );
  renderStockTable(filtered);
}

function filterLowStock() {
  switchView('dashboard', null);
  const low = state.products.filter(p => p.onHand <= p.reorderPoint);
  renderStockTable(low);
  showToast(`Showing ${low.length} Low / Out of Stock items`);
}

function filterByType(type, chipEl) {
  document.querySelectorAll(".seg-btn").forEach(c => c.classList.remove("active"));
  if (chipEl) chipEl.classList.add("active");

  if (type === 'all') {
    renderStockTable();
  } else if (type === 'receipts') {
    switchView('receipts', null);
  } else if (type === 'deliveries') {
    switchView('deliveries', null);
  } else if (type === 'internal') {
    switchView('history', null);
    const filter = document.getElementById("historyTypeFilter");
    if (filter) { filter.value = "Internal"; filterHistoryTable(''); }
  } else if (type === 'adjustments') {
    switchView('adjustments', null);
  }
}

function applyFilters() {
  const status = document.getElementById("statusFilter")?.value || '';
  const wh = document.getElementById("warehouseFilter")?.value || '';
  const cat = document.getElementById("categoryFilter")?.value || '';

  let filtered = [...state.products];

  if (wh) {
    filtered = filtered.filter(p => p.location.includes(wh) || wh.includes(p.location));
  }
  if (cat) {
    filtered = filtered.filter(p => p.category === cat);
  }
  if (status) {
    if (status === 'Draft' || status === 'Waiting') {
      filtered = filtered.filter(p => p.onHand <= p.reorderPoint);
    } else if (status === 'Ready' || status === 'Done') {
      filtered = filtered.filter(p => p.onHand > p.reorderPoint);
    }
  }

  renderStockTable(filtered);
}

// ═══════════════════════ ALERTS & TELEMETRY STREAM ═══════════════════════
function renderAlerts() {
  const alertList = document.getElementById("alertList");
  if (!alertList) return;
  alertList.innerHTML = "";

  const lowStock = state.products.filter(p => p.onHand <= p.reorderPoint);
  if (lowStock.length === 0) {
    alertList.innerHTML = `<li style="padding:1.5rem; text-align:center; color:var(--emerald); font-size:0.85rem">All stock levels within optimal parameters.</li>`;
    return;
  }

  lowStock.forEach(p => {
    const li = document.createElement("li");
    li.className = "alert-item-card";
    li.innerHTML = `
      <div>
        <div class="alert-prod-name">${p.name} <span class="sku-tag">${p.sku}</span></div>
        <div class="alert-stock-meta">${p.onHand} ${p.uom} on hand · Threshold: ${p.reorderPoint} ${p.uom}</div>
      </div>
      <button class="glass-btn primary sm-btn" onclick="createReorderReceipt('${p.name}', ${p.reorderPoint * 2})">+ Reorder</button>
    `;
    alertList.appendChild(li);
  });
}

function renderActivities() {
  const feed = document.getElementById("activityFeed");
  if (!feed) return;
  feed.innerHTML = "";

  state.activities.forEach(a => {
    const li = document.createElement("li");
    li.className = "stream-item";
    li.innerHTML = `
      <span class="stream-dot">${a.icon}</span>
      <div class="stream-body">
        <div class="stream-text">${a.text}</div>
        <div class="stream-time">${a.time}</div>
      </div>
    `;
    feed.appendChild(li);
  });
}

function addActivity(icon, text) {
  state.activities.unshift({ icon, text, time: "Just now" });
  renderActivities();
}

// ═══════════════════════ RECEIPTS OPERATIONS ═══════════════════════
function renderReceipts(filteredList = null) {
  const tbody = document.getElementById("receiptsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const list = filteredList || state.receipts;

  list.forEach(r => {
    let badgeClass = 'badge-gray';
    if (r.status === 'Ready') badgeClass = 'badge-blue';
    if (r.status === 'Done') badgeClass = 'badge-green';
    if (r.status === 'Draft') badgeClass = 'badge-orange';
    if (r.status === 'Canceled') badgeClass = 'badge-red';

    const lateBadge = r.isLate ? `<span class="badge badge-red" style="margin-left:6px">Late</span>` : '';

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:700; color:var(--primary); cursor:pointer" onclick="openReceiptForm('${r.id}')">${r.id}</td>
      <td style="font-weight:600; color:var(--text-head)">${r.from}</td>
      <td><span style="font-size:0.83rem; color:var(--text-muted)">${r.to}</span></td>
      <td>${r.contact}</td>
      <td style="font-family:var(--font-mono); font-size:0.82rem">${r.date} ${lateBadge}</td>
      <td><span class="badge ${badgeClass}">${r.status}</span></td>
      <td>
        <div class="row-actions">
          <button class="action-btn-sm" onclick="openReceiptForm('${r.id}')">✏ Inspect</button>
          ${r.status === 'Ready' ? `<button class="glass-btn primary sm-btn" onclick="quickValidateReceipt('${r.id}')">Validate</button>` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderReceiptsKanban(list);
}

function filterReceiptsTable(query) {
  const q = (query || document.getElementById("receiptSearch")?.value || '').toLowerCase().trim();
  const status = document.getElementById("receiptStatusFilter")?.value || '';

  let list = state.receipts.filter(r => 
    r.id.toLowerCase().includes(q) ||
    r.from.toLowerCase().includes(q) ||
    r.contact.toLowerCase().includes(q)
  );

  if (status) {
    list = list.filter(r => r.status === status);
  }

  renderReceipts(list);
}

function toggleReceiptsView() {
  const listView = document.getElementById("receiptListView");
  const kanbanView = document.getElementById("receiptKanbanView");
  const btn = document.getElementById("receiptViewToggle");

  if (state.receiptViewMode === 'list') {
    state.receiptViewMode = 'kanban';
    listView.classList.add("hidden");
    kanbanView.classList.remove("hidden");
    if (btn) btn.innerText = "☰ Toggle List";
  } else {
    state.receiptViewMode = 'list';
    listView.classList.remove("hidden");
    kanbanView.classList.add("hidden");
    if (btn) btn.innerText = "⊞ Toggle Kanban";
  }
}

function renderReceiptsKanban(list) {
  const kanban = document.getElementById("receiptKanbanView");
  if (!kanban) return;
  kanban.innerHTML = "";

  const columns = ["Draft", "Ready", "Done", "Canceled"];

  columns.forEach(col => {
    const colItems = list.filter(r => r.status === col);
    const colDiv = document.createElement("div");
    colDiv.className = "kanban-column";
    colDiv.innerHTML = `
      <div class="kanban-col-head">
        <span>${col}</span>
        <span class="sku-tag">${colItems.length}</span>
      </div>
    `;

    colItems.forEach(item => {
      const card = document.createElement("div");
      card.className = "kanban-card";
      card.onclick = () => openReceiptForm(item.id);
      card.innerHTML = `
        <div class="k-card-ref">${item.id}</div>
        <div class="k-card-line">Vendor: <strong>${item.from}</strong></div>
        <div class="k-card-line">Destination: ${item.to}</div>
        <div class="k-card-foot">
          <span>📅 ${item.date}</span>
          ${item.isLate ? '<span class="badge badge-red">Late</span>' : ''}
        </div>
      `;
      colDiv.appendChild(card);
    });

    kanban.appendChild(colDiv);
  });
}

function openReceiptForm(receiptId) {
  document.getElementById("receiptListView")?.classList.add("hidden");
  document.getElementById("receiptKanbanView")?.classList.add("hidden");
  const panel = document.getElementById("receiptFormPanel");
  if (!panel) return;
  panel.classList.remove("hidden");

  let receipt;
  if (receiptId === 'new') {
    const firstProd = state.products[0];
    receipt = {
      _id: null, id: 'NEW',
      from: '',
      to: state.warehouses[0]?.name || '',
      contact: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      isLate: false,
      items: firstProd ? [{ name: firstProd.name, qty: 10, productId: firstProd.id }] : [],
      warehouseId: state.warehouses[0]?.id || null,
    };
  } else {
    receipt = state.receipts.find(r => r.id === receiptId || r._id === receiptId);
    if (!receipt) { showToast('Receipt not found'); return; }
  }

  state.currentEditingReceipt = receipt;

  document.getElementById("rf-ref").value = receipt.id;
  document.getElementById("rf-vendor").value = receipt.from;
  document.getElementById("rf-date").value = receipt.date;

  updateReceiptStepper(receipt.status);

  // Products table
  const tbody = document.getElementById("rfProductsBody");
  if (tbody) {
    tbody.innerHTML = "";
    receipt.items.forEach(it => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="text" class="inline-input" value="${it.name}" /></td>
        <td><input type="number" class="inline-input short" value="${it.qty}" /></td>
        <td><button class="action-btn-sm danger" onclick="removeRow(this)">🗑</button></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

function updateReceiptStepper(status) {
  const steps = ["draft", "ready", "done"];
  steps.forEach(s => {
    const el = document.getElementById(`rs-${s}`);
    if (el) el.className = "step-node";
  });

  if (status === 'Draft') {
    document.getElementById("rs-draft").className = "step-node active";
  } else if (status === 'Ready') {
    document.getElementById("rs-draft").className = "step-node done";
    document.getElementById("rs-ready").className = "step-node active";
  } else if (status === 'Done') {
    document.getElementById("rs-draft").className = "step-node done";
    document.getElementById("rs-ready").className = "step-node done";
    document.getElementById("rs-done").className = "step-node done";
  }
}

function resolveLines(items) {
  // Map form line items (matched by name or SKU) to API { product, qty }
  const lines = [];
  for (const it of items) {
    const key = String(it.name || '').toLowerCase().trim();
    const p = state.products.find(p => p.name.toLowerCase() === key || p.sku.toLowerCase() === key);
    if (!p) throw new Error(`Unknown product "${it.name}" — register it in Products first`);
    lines.push({ product: p.id, qty: Number(it.qty) || 0 });
  }
  if (!lines.length) throw new Error('Add at least one line item');
  return lines;
}

async function validateReceipt() {
  if (!state.currentEditingReceipt) return;
  const r = state.currentEditingReceipt;

  if (r.status === 'Done') {
    showToast("This receipt has already been validated.");
    return;
  }

  try {
    r.from = document.getElementById("rf-vendor")?.value || r.from || "Vendor Supplier";
    let docId = r._id;
    if (!docId) {
      if (!r.warehouseId) { showToast('⚠️ No warehouse available — create one via /api/warehouses first'); return; }
      const created = await api('POST', '/api/receipts', {
        supplier: r.from, warehouse: r.warehouseId, lines: resolveLines(r.items),
      });
      docId = created._id;
    }
    await api('POST', `/api/receipts/${docId}/validate`, { location: 'Main Store' });
    updateReceiptStepper('Done');
    showToast(`✓ Receipt validated! Stock auto-incremented.`);
    closeReceiptForm();
    await refreshLive();
  } catch (e) {
    showToast('⚠️ ' + e.message);
  }
}

async function quickValidateReceipt(id) {
  const r = state.receipts.find(x => x.id === id || x._id === id);
  if (!r || !r._id) return;
  try {
    await api('POST', `/api/receipts/${r._id}/validate`, { location: 'Main Store' });
    showToast(`✓ Receipt ${r.id} validated successfully!`);
    await refreshLive();
  } catch (e) {
    showToast('⚠️ ' + e.message);
  }
}

async function cancelReceipt() {
  if (!state.currentEditingReceipt) return;
  const r = state.currentEditingReceipt;
  try {
    if (r._id) await api('PATCH', `/api/receipts/${r._id}`, { status: 'Canceled' });
    showToast(`Receipt ${r.id} canceled.`);
    closeReceiptForm();
    await refreshLive();
  } catch (e) {
    showToast('⚠️ ' + e.message);
  }
}

function closeReceiptForm() {
  document.getElementById("receiptFormPanel")?.classList.add("hidden");
  document.getElementById("receiptListView")?.classList.remove("hidden");
  renderReceipts();
  renderKPIs();
}

function addRfRow() {
  const tbody = document.getElementById("rfProductsBody");
  if (!tbody) return;
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" class="inline-input" placeholder="Product name or SKU…" /></td>
    <td><input type="number" class="inline-input short" value="1" min="1" /></td>
    <td><button class="action-btn-sm danger" onclick="removeRow(this)">🗑</button></td>
  `;
  tbody.appendChild(tr);
}

async function createReorderReceipt(productName, qty) {
  try {
    const key = String(productName).toLowerCase();
    const p = state.products.find(p => p.name.toLowerCase() === key || p.sku.toLowerCase() === key);
    if (!p) throw new Error(`Unknown product "${productName}"`);
    if (!p.whId) throw new Error('No warehouse available');
    await api('POST', '/api/receipts', {
      supplier: 'Automated Reorder Pipeline',
      warehouse: p.whId,
      lines: [{ product: p.id, qty: Number(qty) || 0 }],
      status: 'Ready',
    });
    showToast(`Created inbound reorder for ${productName}`);
    await refreshLive();
  } catch (e) {
    showToast('⚠️ ' + e.message);
  }
}

// ═══════════════════════ DELIVERIES OPERATIONS ═══════════════════════
function renderDeliveries(filteredList = null) {
  const tbody = document.getElementById("deliveriesTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const list = filteredList || state.deliveries;

  list.forEach(d => {
    let badgeClass = 'badge-gray';
    if (d.status === 'Ready') badgeClass = 'badge-blue';
    if (d.status === 'Done') badgeClass = 'badge-green';
    if (d.status === 'Waiting') badgeClass = 'badge-orange';
    if (d.status === 'Draft') badgeClass = 'badge-purple';
    if (d.status === 'Canceled') badgeClass = 'badge-red';

    const lateBadge = d.isLate ? `<span class="badge badge-red" style="margin-left:6px">Late</span>` : '';

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:700; color:var(--primary); cursor:pointer" onclick="openDeliveryForm('${d.id}')">${d.id}</td>
      <td><span style="font-size:0.83rem; color:var(--text-muted)">${d.from}</span></td>
      <td style="font-weight:600; color:var(--text-head)">${d.to}</td>
      <td>${d.contact}</td>
      <td style="font-family:var(--font-mono); font-size:0.82rem">${d.date} ${lateBadge}</td>
      <td><span class="badge ${badgeClass}">${d.status}</span></td>
      <td>
        <div class="row-actions">
          <button class="action-btn-sm" onclick="openDeliveryForm('${d.id}')">✏ Inspect</button>
          ${d.status === 'Ready' ? `<button class="glass-btn primary sm-btn" onclick="quickValidateDelivery('${d.id}')">Dispatch</button>` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderDeliveriesKanban(list);
}

function filterDeliveriesTable(query) {
  const q = (query || document.getElementById("deliverySearch")?.value || '').toLowerCase().trim();
  const status = document.getElementById("deliveryStatusFilter")?.value || '';

  let list = state.deliveries.filter(d => 
    d.id.toLowerCase().includes(q) ||
    d.to.toLowerCase().includes(q) ||
    d.contact.toLowerCase().includes(q)
  );

  if (status) {
    list = list.filter(d => d.status === status);
  }

  renderDeliveries(list);
}

function toggleDeliveryView() {
  const listView = document.getElementById("deliveryListView");
  const kanbanView = document.getElementById("deliveryKanbanView");
  const btn = document.getElementById("deliveryViewToggle");

  if (state.deliveryViewMode === 'list') {
    state.deliveryViewMode = 'kanban';
    listView.classList.add("hidden");
    kanbanView.classList.remove("hidden");
    if (btn) btn.innerText = "☰ Toggle List";
  } else {
    state.deliveryViewMode = 'list';
    listView.classList.remove("hidden");
    kanbanView.classList.add("hidden");
    if (btn) btn.innerText = "⊞ Toggle Kanban";
  }
}

function renderDeliveriesKanban(list) {
  const kanban = document.getElementById("deliveryKanbanView");
  if (!kanban) return;
  kanban.innerHTML = "";

  const columns = ["Draft", "Waiting", "Ready", "Done", "Canceled"];

  columns.forEach(col => {
    const colItems = list.filter(d => d.status === col);
    const colDiv = document.createElement("div");
    colDiv.className = "kanban-column";
    colDiv.innerHTML = `
      <div class="kanban-col-head">
        <span>${col}</span>
        <span class="sku-tag">${colItems.length}</span>
      </div>
    `;

    colItems.forEach(item => {
      const card = document.createElement("div");
      card.className = "kanban-card";
      card.onclick = () => openDeliveryForm(item.id);
      card.innerHTML = `
        <div class="k-card-ref">${item.id}</div>
        <div class="k-card-line">Destination: <strong>${item.to}</strong></div>
        <div class="k-card-line">Contact: ${item.contact}</div>
        <div class="k-card-foot">
          <span>📅 ${item.date}</span>
          ${item.isLate ? '<span class="badge badge-red">Late</span>' : ''}
        </div>
      `;
      colDiv.appendChild(card);
    });

    kanban.appendChild(colDiv);
  });
}

function openDeliveryForm(deliveryId) {
  document.getElementById("deliveryListView")?.classList.add("hidden");
  document.getElementById("deliveryKanbanView")?.classList.add("hidden");
  const panel = document.getElementById("deliveryFormPanel");
  if (!panel) return;
  panel.classList.remove("hidden");

  let delivery;
  if (deliveryId === 'new') {
    const firstProd = state.products[0];
    delivery = {
      _id: null, id: 'NEW',
      from: state.warehouses[0]?.name || '',
      to: '',
      contact: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      isLate: false,
      items: firstProd ? [{ name: firstProd.name, qty: 5, productId: firstProd.id }] : [],
      warehouseId: state.warehouses[0]?.id || null,
    };
  } else {
    delivery = state.deliveries.find(d => d.id === deliveryId || d._id === deliveryId);
    if (!delivery) { showToast('Delivery not found'); return; }
  }

  state.currentEditingDelivery = delivery;

  document.getElementById("df-ref").value = delivery.id;
  document.getElementById("df-address").value = delivery.to;
  document.getElementById("df-date").value = delivery.date;

  updateDeliveryStepper(delivery.status);

  // Products table
  const tbody = document.getElementById("dfProductsBody");
  if (tbody) {
    tbody.innerHTML = "";
    delivery.items.forEach(it => {
      const product = state.products.find(p => p.name.toLowerCase() === it.name.toLowerCase());
      const stockStatus = (product && product.onHand >= it.qty) 
        ? '<span class="badge badge-green"><span class="beacon"></span>Available</span>' 
        : '<span class="badge badge-red"><span class="beacon" style="background:#fb7185"></span>Insufficient</span>';

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="text" class="inline-input" value="${it.name}" /></td>
        <td><input type="number" class="inline-input short" value="${it.qty}" /></td>
        <td>${stockStatus}</td>
        <td><button class="action-btn-sm danger" onclick="removeRow(this)">🗑</button></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

function updateDeliveryStepper(status) {
  const steps = ["draft", "waiting", "ready", "done"];
  steps.forEach(s => {
    const el = document.getElementById(`ds-${s}`);
    if (el) el.className = "step-node";
  });

  if (status === 'Draft') {
    document.getElementById("ds-draft").className = "step-node active";
  } else if (status === 'Waiting') {
    document.getElementById("ds-draft").className = "step-node done";
    document.getElementById("ds-waiting").className = "step-node active";
  } else if (status === 'Ready') {
    document.getElementById("ds-draft").className = "step-node done";
    document.getElementById("ds-waiting").className = "step-node done";
    document.getElementById("ds-ready").className = "step-node active";
  } else if (status === 'Done') {
    document.getElementById("ds-draft").className = "step-node done";
    document.getElementById("ds-waiting").className = "step-node done";
    document.getElementById("ds-ready").className = "step-node done";
    document.getElementById("ds-done").className = "step-node done";
  }
}

async function validateDelivery() {
  if (!state.currentEditingDelivery) return;
  const d = state.currentEditingDelivery;

  if (d.status === 'Done') {
    showToast("This delivery order has already been validated.");
    return;
  }

  try {
    d.to = document.getElementById("df-address")?.value || d.to || "Customer Address";
    let docId = d._id;
    if (!docId) {
      if (!d.warehouseId) { showToast('⚠️ No warehouse available — create one via /api/warehouses first'); return; }
      const created = await api('POST', '/api/deliveries', {
        customer: d.to, warehouse: d.warehouseId, lines: resolveLines(d.items),
      });
      docId = created._id;
    }
    await api('POST', `/api/deliveries/${docId}/validate`, { location: 'Main Store' });
    updateDeliveryStepper('Done');
    showToast(`✓ Delivery dispatched! Stock deducted.`);
    closeDeliveryForm();
    await refreshLive();
  } catch (e) {
    showToast('⚠️ ' + e.message);
  }
}

async function quickValidateDelivery(id) {
  const d = state.deliveries.find(x => x.id === id || x._id === id);
  if (!d || !d._id) return;
  try {
    await api('POST', `/api/deliveries/${d._id}/validate`, { location: 'Main Store' });
    showToast(`✓ Delivery ${d.id} validated!`);
    await refreshLive();
  } catch (e) {
    showToast('⚠️ ' + e.message);
  }
}

async function cancelDelivery() {
  if (!state.currentEditingDelivery) return;
  const d = state.currentEditingDelivery;
  try {
    if (d._id) await api('PATCH', `/api/deliveries/${d._id}`, { status: 'Canceled' });
    showToast(`Delivery ${d.id} canceled.`);
    closeDeliveryForm();
    await refreshLive();
  } catch (e) {
    showToast('⚠️ ' + e.message);
  }
}

function closeDeliveryForm() {
  document.getElementById("deliveryFormPanel")?.classList.add("hidden");
  document.getElementById("deliveryListView")?.classList.remove("hidden");
  renderDeliveries();
  renderKPIs();
}

function addDfRow() {
  const tbody = document.getElementById("dfProductsBody");
  if (!tbody) return;
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" class="inline-input" placeholder="Product name or SKU…" /></td>
    <td><input type="number" class="inline-input short" value="1" min="1" /></td>
    <td><span class="badge badge-gray">Pending Check</span></td>
    <td><button class="action-btn-sm danger" onclick="removeRow(this)">🗑</button></td>
  `;
  tbody.appendChild(tr);
}

// ═══════════════════════ PRODUCTS CATALOG ═══════════════════════
function renderProducts(filteredList = null) {
  const tbody = document.getElementById("productsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const list = filteredList || state.products;

  list.forEach(p => {
    let statusBadge = '';
    if (p.onHand === 0) statusBadge = '<span class="badge badge-red"><span class="beacon" style="background:#fb7185"></span>Out of Stock</span>';
    else if (p.onHand <= p.reorderPoint) statusBadge = '<span class="badge badge-orange"><span class="beacon" style="background:#fbbf24"></span>Low Stock</span>';
    else statusBadge = '<span class="badge badge-green"><span class="beacon"></span>In Stock</span>';

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight:700; color:var(--text-head)">${p.name}</td>
      <td><span class="sku-tag">${p.sku}</span></td>
      <td><span style="font-size:0.83rem; color:var(--text-muted)">${p.category}</span></td>
      <td style="font-family:var(--font-mono); font-size:0.8rem">${p.uom}</td>
      <td style="font-family:var(--font-mono); font-weight:700; color:var(--text-head)">${p.onHand}</td>
      <td style="font-family:var(--font-mono); color:var(--text-muted)">${p.reorderPoint}</td>
      <td style="font-family:var(--font-mono); font-weight:600">₹${p.cost.toLocaleString('en-IN')}</td>
      <td>${statusBadge}</td>
      <td>
        <div class="row-actions">
          <button class="action-btn-sm" title="Edit SKU" onclick="editProduct('${p.id}')">✏</button>
          <button class="action-btn-sm danger" title="Delete" onclick="deleteProduct('${p.id}')">🗑</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterProductsTable(query) {
  const q = (query || document.getElementById("productSearch")?.value || '').toLowerCase().trim();
  const cat = document.getElementById("productCategoryFilter")?.value || '';

  let list = state.products.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.sku.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );

  if (cat) {
    list = list.filter(p => p.category === cat);
  }

  renderProducts(list);
}

function openProductModal() {
  state.currentEditingProduct = null;
  document.getElementById("productModalTitle").innerText = "Add New Product to Catalog";
  document.getElementById("pf-name").value = "";
  document.getElementById("pf-sku").value = "";
  document.getElementById("pf-stock").value = "0";
  document.getElementById("pf-stock").disabled = false;
  document.getElementById("pf-cost").value = "0";
  document.getElementById("pf-reorder").value = "10";
  document.getElementById("productModal")?.classList.remove("hidden");
}

function editProduct(id) {
  const p = state.products.find(p => String(p.id) === String(id));
  if (!p) return;
  state.currentEditingProduct = p;
  document.getElementById("productModalTitle").innerText = "Edit Product";
  document.getElementById("pf-name").value = p.name;
  document.getElementById("pf-sku").value = p.sku;
  document.getElementById("pf-stock").value = p.onHand;
  document.getElementById("pf-stock").disabled = true;
  document.getElementById("pf-stock").title = "Stock changes via receipts & adjustments";
  document.getElementById("pf-cost").value = p.cost || 0;
  document.getElementById("pf-reorder").value = p.reorderPoint;
  const catSel = document.getElementById("pf-category");
  if (catSel && ![...catSel.options].some(o => o.value === p.category || o.text === p.category)) {
    const o = document.createElement("option"); o.value = p.category; o.textContent = p.category; catSel.appendChild(o);
  }
  if (catSel) catSel.value = p.category;
  const uomSel = document.getElementById("pf-uom");
  if (uomSel && ![...uomSel.options].some(o => o.value === p.uom || o.text === p.uom)) {
    const o = document.createElement("option"); o.value = p.uom; o.textContent = p.uom; uomSel.appendChild(o);
  }
  if (uomSel) uomSel.value = p.uom;
  document.getElementById("productModal")?.classList.remove("hidden");
}

function closeProductModal() {
  document.getElementById("productModal")?.classList.add("hidden");
  state.currentEditingProduct = null;
}

async function saveProduct() {
  const name = document.getElementById("pf-name")?.value.trim();
  const sku = document.getElementById("pf-sku")?.value.trim();
  const category = document.getElementById("pf-category")?.value;
  const uom = document.getElementById("pf-uom")?.value;
  const onHand = Number(document.getElementById("pf-stock")?.value) || 0;
  const cost = Number(document.getElementById("pf-cost")?.value) || 0;
  const reorderPoint = Number(document.getElementById("pf-reorder")?.value) || 10;
  const warehouseId = document.getElementById("pf-location")?.value;

  if (!name || !sku) {
    showToast("⚠️ Product name and SKU identifier required.");
    return;
  }

  try {
    if (state.currentEditingProduct) {
      await api('PUT', `/api/products/${state.currentEditingProduct.id}`, { name, sku, category, uom, cost, reorderLevel: reorderPoint });
      showToast(`✓ Updated "${name}"`);
    } else {
      if (!warehouseId) { showToast('⚠️ No warehouse available — create one via /api/warehouses first'); return; }
      const wh = state.warehouses.find(w => String(w.id) === String(warehouseId));
      await api('POST', '/api/products', {
        name, sku, category, uom, cost, reorderLevel: reorderPoint,
        warehouseId, location: (wh && wh.locations[0]) || 'Main Store', initialQty: onHand,
      });
      showToast(`✓ Registered product "${name}"!`);
    }
    closeProductModal();
    await refreshLive();
  } catch (e) {
    showToast('⚠️ ' + e.message);
  }
}

async function deleteProduct(id) {
  const p = state.products.find(p => String(p.id) === String(id));
  if (!p) return;
  if (!confirm(`Delete '${p.name}' (${p.sku})?`)) return;
  try {
    await api('DELETE', `/api/products/${id}`);
    showToast(`Removed ${p.name}`);
    await refreshLive();
  } catch (e) {
    showToast('⚠️ ' + e.message);
  }
}

// ═══════════════════════ MOVE HISTORY (STOCK LEDGER) ═══════════════════════
function renderHistory(filteredList = null) {
  const tbody = document.getElementById("historyTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const list = filteredList || state.history;

  list.forEach(h => {
    let typeBadge = 'badge-blue';
    if (h.type === 'IN') typeBadge = 'badge-green';
    if (h.type === 'OUT') typeBadge = 'badge-red';
    if (h.type === 'Internal') typeBadge = 'badge-purple';
    if (h.type === 'Adjustment') typeBadge = 'badge-orange';

    const qtySign = h.qty > 0 ? `+${h.qty}` : h.qty;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:700; color:var(--primary)">${h.ref}</td>
      <td style="font-family:var(--font-mono); font-size:0.78rem; color:var(--text-dim)">${h.date}</td>
      <td style="font-weight:600; color:var(--text-head)">${h.product}</td>
      <td>${h.contact}</td>
      <td><span style="font-size:0.83rem; color:var(--text-muted)">${h.from}</span></td>
      <td><span style="font-size:0.83rem; color:var(--text-muted)">${h.to}</span></td>
      <td style="font-family:var(--font-mono); font-weight:700; color:${h.qty >= 0 ? 'var(--emerald)' : 'var(--rose)'}">${qtySign}</td>
      <td><span class="badge ${typeBadge}">${h.type}</span></td>
      <td><span class="badge badge-green"><span class="beacon"></span>${h.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function filterHistoryTable(query) {
  const q = (query || document.getElementById("historySearch")?.value || '').toLowerCase().trim();
  const type = document.getElementById("historyTypeFilter")?.value || '';

  let list = state.history.filter(h => 
    h.ref.toLowerCase().includes(q) ||
    h.product.toLowerCase().includes(q) ||
    h.contact.toLowerCase().includes(q)
  );

  if (type) {
    list = list.filter(h => h.type === type);
  }

  renderHistory(list);
}

// ═══════════════════════ STOCK ADJUSTMENTS ═══════════════════════
function renderAdjustments() {
  const tbody = document.getElementById("adjustmentsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  state.products.forEach(p => {
    const tr = document.createElement("tr");
    tr.id = `adj-row-${p.id}`;
    tr.innerHTML = `
      <td>
        <div style="font-weight:700; color:var(--text-head)">${p.name}</div>
        <span class="sku-tag">${p.sku}</span>
      </td>
      <td><span style="font-size:0.83rem; color:var(--text-muted)">${p.location}</span></td>
      <td style="font-family:var(--font-mono); font-weight:700; color:var(--text-body)"><span id="adj-rec-${p.id}">${p.onHand}</span> ${p.uom}</td>
      <td>
        <input type="number" class="inline-input short" id="adj-input-${p.id}" value="${p.onHand}" min="0" oninput="calculateAdjustmentDiff('${p.id}', ${p.onHand})" />
      </td>
      <td><span id="adj-diff-${p.id}" style="font-family:var(--font-mono); font-weight:700; color:var(--text-dim)">0</span></td>
      <td>
          <button class="glass-btn secondary sm-btn" onclick="applySingleAdjustment('${p.id}')">Fix Delta</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function calculateAdjustmentDiff(productId, recordedQty) {
  const inputEl = document.getElementById(`adj-input-${productId}`);
  const diffEl = document.getElementById(`adj-diff-${productId}`);
  const physical = Number(inputEl.value) || 0;
  const diff = physical - recordedQty;

  if (diff > 0) {
    diffEl.innerText = `+${diff}`;
    diffEl.style.color = "var(--emerald)";
  } else if (diff < 0) {
    diffEl.innerText = `${diff}`;
    diffEl.style.color = "var(--rose)";
  } else {
    diffEl.innerText = `0`;
    diffEl.style.color = "var(--text-dim)";
  }
}

async function postAdjustment(p, physical, reason) {
  const wh = state.warehouses.find(w => String(w.id) === String(p.whId)) || state.warehouses[0];
  if (!wh) throw new Error('No warehouse available');
  await api('POST', '/api/adjustments', {
    product: p.id, warehouse: wh.id, location: p.loc || (wh.locations && wh.locations[0]) || 'Main Store',
    countedQty: physical, reason: reason || 'dashboard audit',
  });
}

async function applySingleAdjustment(productId) {
  const p = state.products.find(prod => String(prod.id) === String(productId));
  if (!p) return;
  const inputEl = document.getElementById(`adj-input-${productId}`);
  const physical = Number(inputEl.value) || 0;
  const diff = physical - p.onHand;

  if (diff === 0) {
    showToast(`No count difference for ${p.name}`);
    return;
  }

  try {
    await postAdjustment(p, physical, 'dashboard single audit');
    showToast(`✓ Stock for "${p.name}" adjusted to ${physical} ${p.uom}`);
    await refreshLive();
  } catch (e) {
    showToast('⚠️ ' + e.message);
  }
}

async function applyAdjustment() {
  let adjustmentsCount = 0;
  let failed = null;
  for (const p of state.products) {
    const inputEl = document.getElementById(`adj-input-${p.id}`);
    if (inputEl) {
      const physical = Number(inputEl.value);
      if (!isNaN(physical) && physical !== p.onHand) {
        try {
          await postAdjustment(p, physical, 'dashboard bulk audit');
          adjustmentsCount++;
        } catch (e) { failed = e.message; }
      }
    }
  }

  if (adjustmentsCount > 0) {
    showToast(`✓ Reconciled ${adjustmentsCount} physical stock differences`);
    await refreshLive();
  } else if (failed) {
    showToast('⚠️ ' + failed);
  } else {
    showToast("No count discrepancies to reconcile.");
  }
}

function quickAdjustProduct(productId) {
  switchView('adjustments', null);
  setTimeout(() => {
    const row = document.getElementById(`adj-row-${productId}`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.style.background = "rgba(99, 102, 241, 0.2)";
      setTimeout(() => row.style.background = "", 2000);
    }
  }, 120);
}

// ═══════════════════════ COMMON UTILITIES ═══════════════════════
function removeRow(btn) {
  const tr = btn.closest("tr");
  if (tr) tr.remove();
}

function toggleProfileMenu() {
  const menu = document.getElementById("profileMenu");
  menu?.classList.toggle("hidden");
}

document.addEventListener("click", (e) => {
  const avatar = document.getElementById("navAvatar");
  const menu = document.getElementById("profileMenu");
  if (avatar && menu && !avatar.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

function globalSearchHandler(query) {
  if (!query) return;
  const q = query.toLowerCase().trim();
  const matchProd = state.products.find(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  if (matchProd) {
    switchView('dashboard', null);
    filterStockTable(query);
  }
}

function sortTable(tableId, colIndex) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));
  
  const isAsc = table.dataset.sortDir !== 'asc';
  table.dataset.sortDir = isAsc ? 'asc' : 'desc';

  rows.sort((a, b) => {
    const aText = a.children[colIndex]?.innerText.trim() || '';
    const bText = b.children[colIndex]?.innerText.trim() || '';

    const aNum = parseFloat(aText.replace(/[^0-9.-]+/g, ""));
    const bNum = parseFloat(bText.replace(/[^0-9.-]+/g, ""));

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return isAsc ? aNum - bNum : bNum - aNum;
    }
    return isAsc ? aText.localeCompare(bText) : bText.localeCompare(aText);
  });

  rows.forEach(r => tbody.appendChild(r));
  const colName = table.querySelectorAll("th")[colIndex]?.innerText.replace('↕','').trim() || '';
  showToast(`Sorted by ${colName}`);
}

function exportStock() {
  const headers = ["Product Name", "SKU", "Category", "Location", "Cost (INR)", "On Hand", "Free to Use", "Unit"];
  const rows = state.products.map(p => [
    `"${p.name}"`,
    `"${p.sku}"`,
    `"${p.category}"`,
    `"${p.location}"`,
    p.cost,
    p.onHand,
    p.freeToUse,
    `"${p.uom}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `StockSense_Ledger_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("⬇ Exported inventory ledger CSV");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3200);
}

// ═══════════════════════ DROPDOWN & WAREHOUSE INTERACTIONS ═══════════════════════
function initDropdownInteractions() {
  // Toggle dropdown on button click (so user can click or hover)
  document.querySelectorAll('.nav-dropdown-trigger > button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.nav-dropdown-trigger');
      const isAlreadyOpen = parent.classList.contains('open');

      // Close all other dropdowns
      document.querySelectorAll('.nav-dropdown-trigger.open').forEach(el => el.classList.remove('open'));

      if (!isAlreadyOpen) {
        parent.classList.add('open');
      }
    });
  });

  // Clicking anywhere outside closes any open dropdown
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown-trigger.open').forEach(el => el.classList.remove('open'));
  });

  // Clicking an option closes the dropdown immediately
  document.querySelectorAll('.crystal-dropdown a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-dropdown-trigger.open').forEach(el => el.classList.remove('open'));
    });
  });
}

function selectWarehouse(warehouseName) {
  // Switch to dashboard view first if on another view
  if (state.currentView !== 'dashboard') {
    switchView('dashboard', document.querySelector('[data-view="dashboard"]'));
  }

  // Update select element in the filter toolbar
  const whFilter = document.getElementById('warehouseFilter');
  if (whFilter) {
    whFilter.value = warehouseName;
    applyFilters();
  }

  // Show affirmative toast
  showToast(`🏢 Viewing inventory at: ${warehouseName}`);

  // Close any open dropdowns
  document.querySelectorAll('.nav-dropdown-trigger.open').forEach(el => el.classList.remove('open'));
}

// ═══════════════════════ ANALYTICS & CHARTS ENGINE ═══════════════════════
let velocityChartInstance = null;
let categoryDonutChartInstance = null;

// Velocity datasets are computed from the live stock ledger (no mock series).
function velocityDataset(range = '7d') {
  const now = new Date();
  const days = range === '90d' ? 90 : range === '30d' ? 30 : 7;
  const buckets = range === '90d' ? 3 : range === '30d' ? 4 : 7;
  const span = days / buckets;
  const labels = [], inbound = new Array(buckets).fill(0), outbound = new Array(buckets).fill(0);

  for (let i = 0; i < buckets; i++) {
    const end = new Date(now.getTime() - (buckets - 1 - i) * span * 864e5);
    if (range === '90d') labels.push(end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    else if (range === '30d') labels.push('Week ' + (i + 1));
    else labels.push(end.toLocaleDateString('en-US', { weekday: 'short' }));
  }

  (state.history || []).forEach(h => {
    if (!h._at) return;
    const ageDays = (now - new Date(h._at)) / 864e5;
    if (ageDays < 0 || ageDays > days) return;
    const idx = Math.min(buckets - 1, Math.floor((days - ageDays) / span));
    if (h.type === 'IN') inbound[idx] += Math.abs(h.qty);
    else if (h.type === 'OUT') outbound[idx] += Math.abs(h.qty);
  });

  const inTot = inbound.reduce((a, b) => a + b, 0);
  const outTot = outbound.reduce((a, b) => a + b, 0);
  const net = inTot - outTot;
  return {
    labels, inbound, outbound,
    inboundTotal: inTot + ' units',
    outboundTotal: outTot + ' units',
    netFlow: (net >= 0 ? '+' : '') + net + ' units',
  };
}

function initCharts() {
  renderVelocityChart('7d');
  renderCategoryDonutChart();
  renderWarehouseCapacity();
}

function setChartRange(range, btn) {
  document.querySelectorAll('.chart-tabs .chart-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderVelocityChart(range);
}

function renderVelocityChart(range = '7d') {
  const canvas = document.getElementById('velocityChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const dataset = velocityDataset(range);

  // Update bottom stats
  const inEl = document.getElementById('cStatInbound');
  const outEl = document.getElementById('cStatOutbound');
  const netEl = document.getElementById('cStatNet');
  if (inEl) inEl.innerText = dataset.inboundTotal;
  if (outEl) outEl.innerText = dataset.outboundTotal;
  if (netEl) netEl.innerText = dataset.netFlow;

  const ctx = canvas.getContext('2d');

  // Create subtle gradient fills for light theme
  const gradIndigo = ctx.createLinearGradient(0, 0, 0, 240);
  gradIndigo.addColorStop(0, 'rgba(79, 70, 229, 0.22)');
  gradIndigo.addColorStop(1, 'rgba(79, 70, 229, 0.00)');

  const gradCyan = ctx.createLinearGradient(0, 0, 0, 240);
  gradCyan.addColorStop(0, 'rgba(2, 132, 199, 0.18)');
  gradCyan.addColorStop(1, 'rgba(2, 132, 199, 0.00)');

  if (velocityChartInstance) {
    velocityChartInstance.destroy();
  }

  velocityChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dataset.labels,
      datasets: [
        {
          label: 'Inbound Receipts',
          data: dataset.inbound,
          borderColor: '#4f46e5',
          borderWidth: 2.5,
          backgroundColor: gradIndigo,
          fill: true,
          tension: 0.38,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#4f46e5',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Outbound Dispatches',
          data: dataset.outbound,
          borderColor: '#0284c7',
          borderWidth: 2.5,
          backgroundColor: gradCyan,
          fill: true,
          tension: 0.38,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#0284c7',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          titleColor: '#0f172a',
          bodyColor: '#334155',
          borderColor: 'rgba(255, 255, 255, 0.9)',
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          usePointStyle: true,
          titleFont: { family: 'IBM Plex Sans', size: 12, weight: '700' },
          bodyFont: { family: 'IBM Plex Mono', size: 12, weight: '500' },
          shadowOffsetX: 0,
          shadowOffsetY: 8,
          shadowBlur: 16,
          shadowColor: 'rgba(15, 23, 42, 0.12)'
        }
      },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: {
            font: { family: 'IBM Plex Sans', size: 11, weight: '600' },
            color: '#64748b'
          }
        },
        y: {
          grid: {
            color: 'rgba(15, 23, 42, 0.05)',
            drawBorder: false
          },
          ticks: {
            font: { family: 'IBM Plex Mono', size: 11 },
            color: '#94a3b8',
            stepSize: range === '7d' ? 10 : 50
          }
        }
      }
    }
  });
}

function renderCategoryDonutChart() {
  const canvas = document.getElementById('categoryDonutChart');
  if (!canvas || typeof Chart === 'undefined') return;

  // Compute category statistics from live state.products (dynamic categories)
  const PALETTE = ['#4f46e5', '#0284c7', '#d97706', '#059669', '#7c3aed', '#e11d48', '#0891b2'];
  const catMap = {};
  let colorIdx = 0;

  let totalUnits = 0;
  let totalValuation = 0;

  state.products.forEach(p => {
    const cat = p.category || 'General';
    if (!catMap[cat]) catMap[cat] = { units: 0, cost: 0, color: PALETTE[colorIdx++ % PALETTE.length] };
    catMap[cat].units += p.onHand;
    catMap[cat].cost += (p.onHand * (p.cost || 0));
    totalUnits += p.onHand;
    totalValuation += (p.onHand * (p.cost || 0));
  });

  // Update center readouts
  const totalUnitsEl = document.getElementById('donutTotalUnits');
  const totalCostEl = document.getElementById('donutTotalCost');
  if (totalUnitsEl) totalUnitsEl.innerText = totalUnits;
  if (totalCostEl) totalCostEl.innerText = totalValuation >= 100000 ? `₹${(totalValuation / 100000).toFixed(2)}L` : `₹${totalValuation.toLocaleString()}`;

  // Update breakdown list
  const breakdownListEl = document.getElementById('donutBreakdownList');
  if (breakdownListEl) {
    breakdownListEl.innerHTML = Object.entries(catMap).map(([cat, data]) => {
      const pct = totalUnits > 0 ? Math.round((data.units / totalUnits) * 100) : 0;
      return `
        <div class="donut-cat-row" onclick="filterByCategory('${cat}')" style="cursor:pointer" title="Click to filter by ${cat}">
          <div class="donut-cat-info">
            <span class="donut-cat-bullet" style="background: ${data.color}"></span>
            <span class="donut-cat-name">${cat}</span>
          </div>
          <div class="donut-cat-metric">
            <span class="donut-cat-units">${data.units}</span>
            <span class="donut-cat-pct">(${pct}%)</span>
          </div>
        </div>
      `;
    }).join('');
  }

  const ctx = canvas.getContext('2d');

  if (categoryDonutChartInstance) {
    categoryDonutChartInstance.destroy();
  }

  const categories = Object.keys(catMap);
  const unitsData = categories.map(c => catMap[c].units);
  const colors = categories.map(c => catMap[c].color);

  categoryDonutChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{
        data: unitsData,
        backgroundColor: colors,
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '74%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          titleColor: '#0f172a',
          bodyColor: '#334155',
          borderColor: 'rgba(255, 255, 255, 0.9)',
          borderWidth: 1,
          padding: 8,
          usePointStyle: true,
          titleFont: { family: 'IBM Plex Sans', size: 12, weight: '700' },
          bodyFont: { family: 'IBM Plex Mono', size: 12, weight: '500' },
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const val = context.raw || 0;
              const cost = catMap[label] ? ` (₹${catMap[label].cost.toLocaleString()})` : '';
              return ` ${val} units${cost}`;
            }
          }
        }
      }
    }
  });
}

function renderWarehouseCapacity() {
  const listEl = document.getElementById('whCapacityList');
  const totalEl = document.getElementById('whCapacityTotal');
  if (!listEl) return;

  // Live warehouses from the API; allocated units summed from live stock.
  const COLORS = ['var(--primary)', 'var(--cyan)', 'var(--emerald)', 'var(--violet)', 'var(--amber)'];
  const warehouses = state.warehouses.length
    ? state.warehouses.map((w, i) => ({ name: w.name, color: COLORS[i % COLORS.length] }))
    : [];

  let totalAllocated = 0;
  const perWh = warehouses.map(wh => {
    const allocated = state.products
      .filter(p => p.location === wh.name)
      .reduce((sum, p) => sum + p.onHand, 0);
    totalAllocated += allocated;
    return { ...wh, allocated };
  });

  const html = perWh.map(wh => {
    const pct = totalAllocated > 0 ? Math.min(100, Math.round((wh.allocated / totalAllocated) * 100)) : 0;

    return `
      <div class="wh-cap-row" onclick="selectWarehouse('${wh.name}')" style="cursor:pointer" title="Click to filter by ${wh.name}">
        <div class="wh-cap-row-meta">
          <span class="wh-cap-loc-name">${wh.name}</span>
          <span class="wh-cap-loc-pct">${wh.allocated} units (${pct}% of stocked)</span>
        </div>
        <div class="wh-cap-bar-track">
          <div class="wh-cap-bar-fill" style="width: ${pct}%; background: ${wh.color}"></div>
        </div>
      </div>
    `;
  }).join('');

  listEl.innerHTML = html;
  if (totalEl) totalEl.innerText = `${totalAllocated} Units stocked`;
}

function filterByCategory(cat) {
  const catFilter = document.getElementById('categoryFilter');
  if (catFilter) {
    catFilter.value = cat;
    applyFilters();
    showToast(`Filtering stock by category: ${cat}`);
  }
}
