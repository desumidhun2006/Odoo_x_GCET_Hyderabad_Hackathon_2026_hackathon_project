/**
 * StockSense — Intelligent Inventory & Operations Platform
 * Cinema-Grade Reactive State Engine
 */

// ═══════════════════════ REACTIVE INVENTORY STATE ═══════════════════════
const state = {
  currentView: 'dashboard',
  receiptViewMode: 'list', // 'list' | 'kanban'
  deliveryViewMode: 'list',

  products: [
    { id: 1, name: "Steel Rods 12mm", sku: "STL-001", category: "Raw Materials", location: "Main Warehouse (WH)", uom: "kg", cost: 65, onHand: 100, freeToUse: 80, reorderPoint: 30 },
    { id: 2, name: "Office Ergonomic Chair", sku: "CHR-002", category: "Finished Goods", location: "Main Warehouse (WH)", uom: "Units", cost: 4200, onHand: 24, freeToUse: 14, reorderPoint: 10 },
    { id: 3, name: "Standing Desk Wood Top", sku: "DSK-003", category: "Finished Goods", location: "Warehouse 2", uom: "Units", cost: 12500, onHand: 15, freeToUse: 5, reorderPoint: 8 },
    { id: 4, name: "Industrial Hex Bolts M8", sku: "BLT-004", category: "Consumables", location: "Production Floor", uom: "Units", cost: 2.5, onHand: 8, freeToUse: 8, reorderPoint: 50 },
    { id: 5, name: "Aluminum Sheets 4x8", sku: "ALM-005", category: "Raw Materials", location: "Main Warehouse (WH)", uom: "Units", cost: 850, onHand: 42, freeToUse: 42, reorderPoint: 15 },
    { id: 6, name: "Packing Bubble Wrap 50m", sku: "PKG-006", category: "Consumables", location: "Main Warehouse (WH)", uom: "Units", cost: 180, onHand: 4, freeToUse: 4, reorderPoint: 12 },
    { id: 7, name: "Heavy Duty Casters 4in", sku: "CST-007", category: "Raw Materials", location: "Production Floor", uom: "Units", cost: 140, onHand: 0, freeToUse: 0, reorderPoint: 20 },
    { id: 8, name: "Acoustic Desk Partition", sku: "PRT-008", category: "Finished Goods", location: "Warehouse 2", uom: "Units", cost: 2100, onHand: 35, freeToUse: 35, reorderPoint: 10 },
    { id: 9, name: "Hydraulic Gas Lift Cylinder", sku: "CYL-009", category: "Raw Materials", location: "Main Warehouse (WH)", uom: "Units", cost: 680, onHand: 18, freeToUse: 18, reorderPoint: 25 }
  ],

  receipts: [
    { id: "WH/IN/0001", from: "Apex Steel Ltd", to: "WH/Stock1", contact: "Azure Interior", date: "2026-09-24", status: "Ready", isLate: false, items: [{ name: "Steel Rods 12mm", qty: 50 }] },
    { id: "WH/IN/0002", from: "ErgoParts Supply", to: "WH/Stock1", contact: "Deco Addict", date: "2026-09-25", status: "Ready", isLate: false, items: [{ name: "Hydraulic Gas Lift Cylinder", qty: 25 }] },
    { id: "WH/IN/0003", from: "Fastener Hub Inc", to: "WH/Stock2", contact: "Gemini Furniture", date: "2026-09-22", status: "Ready", isLate: true, items: [{ name: "Industrial Hex Bolts M8", qty: 200 }] },
    { id: "WH/IN/0004", from: "Global Pack Co", to: "WH/Stock1", contact: "Azure Interior", date: "2026-09-28", status: "Draft", isLate: false, items: [{ name: "Packing Bubble Wrap 50m", qty: 20 }] },
    { id: "WH/IN/0005", from: "Prime Aluminum Corp", to: "WH/Stock1", contact: "Lumber & Co", date: "2026-09-21", status: "Done", isLate: false, items: [{ name: "Aluminum Sheets 4x8", qty: 40 }] },
    { id: "WH/IN/0006", from: "Zenith Components", to: "WH/Stock2", contact: "Vanguard Corp", date: "2026-09-29", status: "Draft", isLate: false, items: [{ name: "Heavy Duty Casters 4in", qty: 60 }] }
  ],

  deliveries: [
    { id: "WH/OUT/0001", from: "WH/Stock1", to: "Azure Interior HQ", contact: "Azure Interior", date: "2026-09-23", status: "Ready", isLate: true, items: [{ name: "Office Ergonomic Chair", qty: 10 }] },
    { id: "WH/OUT/0002", from: "WH/Stock1", to: "TechHub Hyderabad", contact: "Deco Addict", date: "2026-09-26", status: "Waiting", isLate: false, items: [{ name: "Standing Desk Wood Top", qty: 10 }] },
    { id: "WH/OUT/0003", from: "WH/Stock2", to: "Metropolis Co-work", contact: "Metro Ltd", date: "2026-09-27", status: "Waiting", isLate: false, items: [{ name: "Acoustic Desk Partition", qty: 5 }] },
    { id: "WH/OUT/0004", from: "WH/Stock1", to: "Nexus Innovations", contact: "Nexus Tech", date: "2026-09-28", status: "Ready", isLate: false, items: [{ name: "Office Ergonomic Chair", qty: 4 }] },
    { id: "WH/OUT/0005", from: "WH/Stock1", to: "City Library", contact: "Govt Admin", date: "2026-09-20", status: "Done", isLate: false, items: [{ name: "Standing Desk Wood Top", qty: 8 }] },
    { id: "WH/OUT/0006", from: "WH/Stock2", to: "Orbit Labs", contact: "Orbit Co", date: "2026-09-30", status: "Draft", isLate: false, items: [{ name: "Steel Rods 12mm", qty: 20 }] }
  ],

  transfers: [
    { id: "WH/INT/0001", from: "Main Store", to: "Production Rack", product: "Steel Rods 12mm", qty: 20, date: "2026-09-26", status: "Ready" },
    { id: "WH/INT/0002", from: "Rack A", to: "Rack B", product: "Industrial Hex Bolts M8", qty: 100, date: "2026-09-26", status: "Ready" },
    { id: "WH/INT/0003", from: "Warehouse 1", to: "Warehouse 2", product: "Standing Desk Wood Top", qty: 5, date: "2026-09-27", status: "Draft" }
  ],

  history: [
    { ref: "WH/IN/0005", date: "2026-09-21 14:30", product: "Aluminum Sheets 4x8", contact: "Prime Aluminum Corp", from: "Vendor", to: "WH/Stock1", qty: 40, type: "IN", status: "Done" },
    { ref: "WH/OUT/0005", date: "2026-09-20 11:15", product: "Standing Desk Wood Top", contact: "Govt Admin", from: "WH/Stock1", to: "Customer", qty: -8, type: "OUT", status: "Done" },
    { ref: "WH/INT/0000", date: "2026-09-19 16:45", product: "Steel Rods 12mm", contact: "Internal Staff", from: "Main Store", to: "Production Rack", qty: 25, type: "Internal", status: "Done" },
    { ref: "ADJ/2026/001", date: "2026-09-18 09:20", product: "Industrial Hex Bolts M8", contact: "Warehouse Staff", from: "Count Adjustment", to: "Production Floor", qty: -5, type: "Adjustment", status: "Done" }
  ],

  activities: [
    { icon: "📥", text: "Receipt <strong>WH/IN/0005</strong> validated (+40x Aluminum Sheets received)", time: "2 hours ago" },
    { icon: "📤", text: "Delivery Order <strong>WH/OUT/0001</strong> picked & staged for Azure Interior", time: "4 hours ago" },
    { icon: "🔄", text: "Internal Transfer scheduled from Main Store to Production Rack", time: "6 hours ago" },
    { icon: "⚠️", text: "Low stock alert triggered for <strong>Industrial Hex Bolts M8</strong> (8 units remaining)", time: "Yesterday" }
  ],

  currentEditingReceipt: null,
  currentEditingDelivery: null
};

// ═══════════════════════ INITIALIZATION ═══════════════════════
document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
  initLiquidAtmosphere();
  initDropdownInteractions();
});

function initDashboard() {
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

// ═══════════════════════ AMBIENT LIQUID MOUSE GLOW ═══════════════════════
function initLiquidAtmosphere() {
  const glow = document.getElementById("mouseGlow");
  if (!glow) return;

  window.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
    glow.style.opacity = "1";
  });

  window.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
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
    let gaugePct = Math.min(100, Math.round((p.onHand / (p.reorderPoint * 2)) * 100));

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
    const nextNum = String(state.receipts.length + 1).padStart(4, '0');
    receipt = {
      id: `WH/IN/${nextNum}`,
      from: '',
      to: 'WH/Stock1',
      contact: 'Azure Interior',
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      isLate: false,
      items: [{ name: state.products[0].name, qty: 10 }]
    };
    state.receipts.unshift(receipt);
  } else {
    receipt = state.receipts.find(r => r.id === receiptId);
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

function validateReceipt() {
  if (!state.currentEditingReceipt) return;
  const r = state.currentEditingReceipt;

  if (r.status === 'Done') {
    showToast("This receipt has already been validated.");
    return;
  }

  r.status = 'Done';
  r.from = document.getElementById("rf-vendor")?.value || r.from || "Vendor Supplier";
  updateReceiptStepper('Done');

  // Increase stock for items received
  r.items.forEach(it => {
    const product = state.products.find(p => p.name.toLowerCase() === it.name.toLowerCase());
    if (product) {
      product.onHand += Number(it.qty);
      product.freeToUse += Number(it.qty);
    }
    state.history.unshift({
      ref: r.id,
      date: new Date().toLocaleString(),
      product: it.name,
      contact: r.from || r.contact,
      from: "Vendor",
      to: r.to,
      qty: Number(it.qty),
      type: "IN",
      status: "Done"
    });
  });

  addActivity("📥", `Receipt <strong>${r.id}</strong> validated (+${r.items.reduce((acc, x) => acc + Number(x.qty), 0)} units received)`);
  showToast(`✓ Receipt ${r.id} validated! Stock auto-incremented.`);
  renderKPIs();
}

function quickValidateReceipt(id) {
  const r = state.receipts.find(x => x.id === id);
  if (!r) return;
  r.status = 'Done';
  r.items.forEach(it => {
    const product = state.products.find(p => p.name.toLowerCase() === it.name.toLowerCase());
    if (product) {
      product.onHand += Number(it.qty);
      product.freeToUse += Number(it.qty);
    }
    state.history.unshift({
      ref: r.id,
      date: new Date().toLocaleString(),
      product: it.name,
      contact: r.from,
      from: "Vendor",
      to: r.to,
      qty: Number(it.qty),
      type: "IN",
      status: "Done"
    });
  });
  addActivity("📥", `Receipt <strong>${r.id}</strong> validated`);
  showToast(`✓ Receipt ${r.id} validated successfully!`);
  renderReceipts();
  renderKPIs();
}

function cancelReceipt() {
  if (state.currentEditingReceipt) {
    state.currentEditingReceipt.status = 'Canceled';
    showToast(`Receipt ${state.currentEditingReceipt.id} canceled.`);
    closeReceiptForm();
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

function createReorderReceipt(productName, qty) {
  const nextNum = String(state.receipts.length + 1).padStart(4, '0');
  const newReceipt = {
    id: `WH/IN/${nextNum}`,
    from: "Automated Reorder Pipeline",
    to: "WH/Stock1",
    contact: "Procurement Ops",
    date: new Date().toISOString().split('T')[0],
    status: "Ready",
    isLate: false,
    items: [{ name: productName, qty: qty }]
  };
  state.receipts.unshift(newReceipt);
  addActivity("📥", `Automated reorder docket <strong>${newReceipt.id}</strong> raised for ${productName} (${qty} units)`);
  showToast(`Created inbound reorder ${newReceipt.id} for ${productName}`);
  renderReceipts();
  renderKPIs();
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
    const nextNum = String(state.deliveries.length + 1).padStart(4, '0');
    delivery = {
      id: `WH/OUT/${nextNum}`,
      from: 'WH/Stock1',
      to: '',
      contact: 'Azure Interior',
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      isLate: false,
      items: [{ name: state.products[1].name, qty: 5 }]
    };
    state.deliveries.unshift(delivery);
  } else {
    delivery = state.deliveries.find(d => d.id === deliveryId);
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

function validateDelivery() {
  if (!state.currentEditingDelivery) return;
  const d = state.currentEditingDelivery;

  if (d.status === 'Done') {
    showToast("This delivery order has already been validated.");
    return;
  }

  // Check inventory availability
  for (let it of d.items) {
    const p = state.products.find(prod => prod.name.toLowerCase() === it.name.toLowerCase());
    if (p && p.onHand < Number(it.qty)) {
      showToast(`⚠️ Insufficient stock for ${it.name} (Need ${it.qty}, have ${p.onHand})`);
      d.status = 'Waiting';
      updateDeliveryStepper('Waiting');
      return;
    }
  }

  d.status = 'Done';
  d.to = document.getElementById("df-address")?.value || d.to || "Customer Address";
  updateDeliveryStepper('Done');

  // Reduce inventory & log history
  d.items.forEach(it => {
    const p = state.products.find(prod => prod.name.toLowerCase() === it.name.toLowerCase());
    if (p) {
      p.onHand -= Number(it.qty);
      p.freeToUse -= Number(it.qty);
    }
    state.history.unshift({
      ref: d.id,
      date: new Date().toLocaleString(),
      product: it.name,
      contact: d.to || d.contact,
      from: d.from,
      to: "Customer Destination",
      qty: -Number(it.qty),
      type: "OUT",
      status: "Done"
    });
  });

  addActivity("📤", `Delivery <strong>${d.id}</strong> dispatched to ${d.to} (-${d.items.reduce((acc, x) => acc + Number(x.qty), 0)} units)`);
  showToast(`✓ Delivery ${d.id} dispatched! Stock deducted.`);
  renderKPIs();
}

function quickValidateDelivery(id) {
  const d = state.deliveries.find(x => x.id === id);
  if (!d) return;

  for (let it of d.items) {
    const p = state.products.find(prod => prod.name.toLowerCase() === it.name.toLowerCase());
    if (p && p.onHand < Number(it.qty)) {
      showToast(`⚠️ Insufficient stock for ${it.name}`);
      d.status = 'Waiting';
      renderDeliveries();
      return;
    }
  }

  d.status = 'Done';
  d.items.forEach(it => {
    const p = state.products.find(prod => prod.name.toLowerCase() === it.name.toLowerCase());
    if (p) {
      p.onHand -= Number(it.qty);
      p.freeToUse -= Number(it.qty);
    }
    state.history.unshift({
      ref: d.id,
      date: new Date().toLocaleString(),
      product: it.name,
      contact: d.to,
      from: d.from,
      to: "Customer Destination",
      qty: -Number(it.qty),
      type: "OUT",
      status: "Done"
    });
  });

  addActivity("📤", `Delivery <strong>${d.id}</strong> dispatched`);
  showToast(`✓ Delivery ${d.id} validated!`);
  renderDeliveries();
  renderKPIs();
}

function cancelDelivery() {
  if (state.currentEditingDelivery) {
    state.currentEditingDelivery.status = 'Canceled';
    showToast(`Delivery ${state.currentEditingDelivery.id} canceled.`);
    closeDeliveryForm();
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
          <button class="action-btn-sm" title="Edit SKU" onclick="editProduct(${p.id})">✏</button>
          <button class="action-btn-sm danger" title="Delete" onclick="deleteProduct(${p.id})">🗑</button>
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
  document.getElementById("productModalTitle").innerText = "Add New Product to Catalog";
  document.getElementById("pf-name").value = "";
  document.getElementById("pf-sku").value = "";
  document.getElementById("pf-stock").value = "0";
  document.getElementById("pf-cost").value = "0";
  document.getElementById("pf-reorder").value = "10";
  document.getElementById("productModal")?.classList.remove("hidden");
}

function closeProductModal() {
  document.getElementById("productModal")?.classList.add("hidden");
}

function saveProduct() {
  const name = document.getElementById("pf-name")?.value.trim();
  const sku = document.getElementById("pf-sku")?.value.trim();
  const category = document.getElementById("pf-category")?.value;
  const uom = document.getElementById("pf-uom")?.value;
  const onHand = Number(document.getElementById("pf-stock")?.value) || 0;
  const cost = Number(document.getElementById("pf-cost")?.value) || 0;
  const reorderPoint = Number(document.getElementById("pf-reorder")?.value) || 10;
  const location = document.getElementById("pf-location")?.value;

  if (!name || !sku) {
    showToast("⚠️ Product name and SKU identifier required.");
    return;
  }

  const newProd = {
    id: Date.now(),
    name,
    sku,
    category,
    location,
    uom,
    cost,
    onHand,
    freeToUse: onHand,
    reorderPoint
  };

  state.products.unshift(newProd);
  closeProductModal();
  renderProducts();
  renderStockTable();
  renderKPIs();
  addActivity("🏷", `SKU <strong>${sku}</strong> (${name}) cataloged into ${location}`);
  showToast(`✓ Registered product "${name}"!`);
}

function deleteProduct(id) {
  const idx = state.products.findIndex(p => p.id === id);
  if (idx > -1) {
    const pName = state.products[idx].name;
    state.products.splice(idx, 1);
    renderProducts();
    renderStockTable();
    renderKPIs();
    showToast(`Removed ${pName}`);
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
        <input type="number" class="inline-input short" id="adj-input-${p.id}" value="${p.onHand}" min="0" oninput="calculateAdjustmentDiff(${p.id}, ${p.onHand})" />
      </td>
      <td><span id="adj-diff-${p.id}" style="font-family:var(--font-mono); font-weight:700; color:var(--text-dim)">0</span></td>
      <td>
        <button class="glass-btn secondary sm-btn" onclick="applySingleAdjustment(${p.id})">Fix Delta</button>
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

function applySingleAdjustment(productId) {
  const p = state.products.find(prod => prod.id === productId);
  if (!p) return;
  const inputEl = document.getElementById(`adj-input-${productId}`);
  const physical = Number(inputEl.value) || 0;
  const diff = physical - p.onHand;

  if (diff === 0) {
    showToast(`No count difference for ${p.name}`);
    return;
  }

  p.onHand = physical;
  p.freeToUse = physical;

  // Add ledger entry
  state.history.unshift({
    ref: `ADJ/${new Date().getFullYear()}/${String(state.history.length + 1).padStart(3, '0')}`,
    date: new Date().toLocaleString(),
    product: p.name,
    contact: "Warehouse Physical Audit",
    from: "Physical Shelf Count",
    to: p.location,
    qty: diff,
    type: "Adjustment",
    status: "Done"
  });

  addActivity("⚖️", `Stock reconciled for <strong>${p.name}</strong> (${diff > 0 ? '+' + diff : diff} units)`);
  showToast(`✓ Stock for "${p.name}" adjusted to ${physical} ${p.uom}`);

  renderAdjustments();
  renderKPIs();
  renderStockTable();
}

function applyAdjustment() {
  let adjustmentsCount = 0;
  state.products.forEach(p => {
    const inputEl = document.getElementById(`adj-input-${p.id}`);
    if (inputEl) {
      const physical = Number(inputEl.value);
      if (!isNaN(physical) && physical !== p.onHand) {
        const diff = physical - p.onHand;
        p.onHand = physical;
        p.freeToUse = physical;
        adjustmentsCount++;

        state.history.unshift({
          ref: `ADJ/${new Date().getFullYear()}/${String(state.history.length + 1).padStart(3, '0')}`,
          date: new Date().toLocaleString(),
          product: p.name,
          contact: "Annual Stock Audit",
          from: "Physical Shelf Count",
          to: p.location,
          qty: diff,
          type: "Adjustment",
          status: "Done"
        });
      }
    }
  });

  if (adjustmentsCount > 0) {
    addActivity("⚖️", `Bulk inventory audit reconciled ${adjustmentsCount} discrepant SKUs`);
    showToast(`✓ Reconciled ${adjustmentsCount} physical stock differences`);
    renderAdjustments();
    renderKPIs();
    renderStockTable();
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

const chartDataSets = {
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    inbound: [18, 26, 14, 32, 22, 12, 18],
    outbound: [12, 19, 16, 24, 20, 15, 12],
    inboundTotal: '142 units',
    outboundTotal: '118 units',
    netFlow: '+24 units'
  },
  '30d': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    inbound: [110, 145, 125, 162],
    outbound: [95, 130, 118, 140],
    inboundTotal: '542 units',
    outboundTotal: '483 units',
    netFlow: '+59 units'
  },
  '90d': {
    labels: ['Jul 2026', 'Aug 2026', 'Sep 2026'],
    inbound: [460, 520, 590],
    outbound: [420, 480, 535],
    inboundTotal: '1,570 units',
    outboundTotal: '1,435 units',
    netFlow: '+135 units'
  }
};

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

  const dataset = chartDataSets[range] || chartDataSets['7d'];

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
          titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: '700' },
          bodyFont: { family: 'JetBrains Mono', size: 12, weight: '500' },
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
            font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
            color: '#64748b'
          }
        },
        y: {
          grid: {
            color: 'rgba(15, 23, 42, 0.05)',
            drawBorder: false
          },
          ticks: {
            font: { family: 'JetBrains Mono', size: 11 },
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

  // Compute category statistics from state.products
  const catMap = {
    'Raw Materials': { units: 0, cost: 0, color: '#4f46e5' },
    'Finished Goods': { units: 0, cost: 0, color: '#0284c7' },
    'Consumables': { units: 0, cost: 0, color: '#d97706' }
  };

  let totalUnits = 0;
  let totalValuation = 0;

  state.products.forEach(p => {
    if (catMap[p.category]) {
      catMap[p.category].units += p.onHand;
      catMap[p.category].cost += (p.onHand * p.cost);
    }
    totalUnits += p.onHand;
    totalValuation += (p.onHand * p.cost);
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

  const warehouses = [
    { name: 'Main Warehouse (WH)', capacity: 180, color: 'var(--primary)' },
    { name: 'Production Floor', capacity: 90, color: 'var(--cyan)' },
    { name: 'Warehouse 2', capacity: 110, color: 'var(--emerald)' }
  ];

  let totalAllocated = 0;
  let totalCapacity = 380;

  const html = warehouses.map(wh => {
    const allocated = state.products
      .filter(p => p.location === wh.name)
      .reduce((sum, p) => sum + p.onHand, 0);
    totalAllocated += allocated;
    const pct = Math.min(100, Math.round((allocated / wh.capacity) * 100));

    return `
      <div class="wh-cap-row" onclick="selectWarehouse('${wh.name}')" style="cursor:pointer" title="Click to filter by ${wh.name}">
        <div class="wh-cap-row-meta">
          <span class="wh-cap-loc-name">${wh.name}</span>
          <span class="wh-cap-loc-pct">${allocated} / ${wh.capacity} (${pct}%)</span>
        </div>
        <div class="wh-cap-bar-track">
          <div class="wh-cap-bar-fill" style="width: ${pct}%; background: ${wh.color}"></div>
        </div>
      </div>
    `;
  }).join('');

  listEl.innerHTML = html;
  if (totalEl) totalEl.innerText = `${totalAllocated} / ${totalCapacity} Units`;
}

function filterByCategory(cat) {
  const catFilter = document.getElementById('categoryFilter');
  if (catFilter) {
    catFilter.value = cat;
    applyFilters();
    showToast(`Filtering stock by category: ${cat}`);
  }
}
