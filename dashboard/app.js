/**
 * StockSense — Inventory Management System Dashboard
 * Fully interactive, real-time application logic
 */

// ═══════════════════════ INITIAL STATE & DATA ═══════════════════════
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
    { id: "WH/IN/0001", from: "Apex Steel Ltd", to: "WH/Stock1", contact: "Azure Interior", date: "2026-09-24", status: "Ready", items: [{ name: "Steel Rods 12mm", qty: 50 }] },
    { id: "WH/IN/0002", from: "ErgoParts Supply", to: "WH/Stock1", contact: "Deco Addict", date: "2026-09-25", status: "Ready", items: [{ name: "Hydraulic Gas Lift Cylinder", qty: 25 }] },
    { id: "WH/IN/0003", from: "Fastener Hub Inc", to: "WH/Stock2", contact: "Gemini Furniture", date: "2026-09-22", status: "Ready", isLate: true, items: [{ name: "Industrial Hex Bolts M8", qty: 200 }] },
    { id: "WH/IN/0004", from: "Global Pack Co", to: "WH/Stock1", contact: "Azure Interior", date: "2026-09-28", status: "Draft", items: [{ name: "Packing Bubble Wrap 50m", qty: 20 }] },
    { id: "WH/IN/0005", from: "Prime Aluminum Corp", to: "WH/Stock1", contact: "Lumber & Co", date: "2026-09-21", status: "Done", items: [{ name: "Aluminum Sheets 4x8", qty: 40 }] },
    { id: "WH/IN/0006", from: "Zenith Components", to: "WH/Stock2", contact: "Vanguard Corp", date: "2026-09-29", status: "Draft", items: [{ name: "Heavy Duty Casters 4in", qty: 60 }] }
  ],

  deliveries: [
    { id: "WH/OUT/0001", from: "WH/Stock1", to: "Azure Interior HQ", contact: "Azure Interior", date: "2026-09-23", status: "Ready", isLate: true, items: [{ name: "Office Ergonomic Chair", qty: 10 }] },
    { id: "WH/OUT/0002", from: "WH/Stock1", to: "TechHub Hyderabad", contact: "Deco Addict", date: "2026-09-26", status: "Waiting", items: [{ name: "Standing Desk Wood Top", qty: 10 }] },
    { id: "WH/OUT/0003", from: "WH/Stock2", to: "Metropolis Co-work", contact: "Metro Ltd", date: "2026-09-27", status: "Waiting", items: [{ name: "Acoustic Desk Partition", qty: 5 }] },
    { id: "WH/OUT/0004", from: "WH/Stock1", to: "Nexus Innovations", contact: "Nexus Tech", date: "2026-09-28", status: "Ready", items: [{ name: "Office Ergonomic Chair", qty: 4 }] },
    { id: "WH/OUT/0005", from: "WH/Stock1", to: "City Library", contact: "Govt Admin", date: "2026-09-20", status: "Done", items: [{ name: "Standing Desk Wood Top", qty: 8 }] },
    { id: "WH/OUT/0006", from: "WH/Stock2", to: "Orbit Labs", contact: "Orbit Co", date: "2026-09-30", status: "Draft", items: [{ name: "Steel Rods 12mm", qty: 20 }] }
  ],

  transfers: [
    { id: "WH/INT/0001", from: "Main Store", to: "Production Rack", product: "Steel Rods 12mm", qty: 20, date: "2026-09-26", status: "Ready" },
    { id: "WH/INT/0002", from: "Rack A", to: "Rack B", product: "Industrial Hex Bolts M8", qty: 100, date: "2026-09-26", status: "Ready" },
    { id: "WH/INT/0003", from: "Warehouse 1", to: "Warehouse 2", product: "Standing Desk Wood Top", qty: 5, date: "2026-09-27", status: "Draft" }
  ],

  history: [
    { ref: "WH/IN/0005", date: "2026-09-21 14:30", product: "Aluminum Sheets 4x8", contact: "Prime Aluminum Corp", from: "Vendor", to: "WH/Stock1", qty: 40, type: "IN", status: "Done" },
    { ref: "WH/OUT/0005", date: "2026-09-20 11:15", product: "Standing Desk Wood Top", contact: "Govt Admin", from: "WH/Stock1", to: "Customer", qty: 8, type: "OUT", status: "Done" },
    { ref: "WH/INT/0000", date: "2026-09-19 16:45", product: "Steel Rods 12mm", contact: "Internal Staff", from: "Main Store", to: "Production Rack", qty: 25, type: "Internal", status: "Done" },
    { ref: "ADJ/2026/001", date: "2026-09-18 09:20", product: "Industrial Hex Bolts M8", contact: "Warehouse Staff", from: "Count Adjustment", to: "Production Floor", qty: -5, type: "Adjustment", status: "Done" }
  ],

  activities: [
    { icon: "📥", text: "Receipt <strong>WH/IN/0005</strong> validated (40x Aluminum Sheets)", time: "2 hours ago" },
    { icon: "📤", text: "Delivery Order <strong>WH/OUT/0001</strong> scheduled for Azure Interior", time: "4 hours ago" },
    { icon: "🔄", text: "Internal Transfer scheduled from Main Store to Production Rack", time: "6 hours ago" },
    { icon: "⚠️", text: "Low stock alert triggered for <strong>Industrial Hex Bolts M8</strong> (8 units left)", time: "Yesterday" }
  ],

  currentEditingReceipt: null,
  currentEditingDelivery: null
};

// ═══════════════════════ INITIALIZATION ═══════════════════════
document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
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
}

function updateCurrentDate() {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const today = new Date();
  const el = document.getElementById("currentDate");
  if (el) el.innerText = today.toLocaleDateString("en-US", options);
}

// ═══════════════════════ VIEW SWITCHING ═══════════════════════
function switchView(viewName, clickedElement) {
  state.currentView = viewName;

  // Toggle active class on nav links
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
  });
  if (clickedElement && clickedElement.classList) {
    clickedElement.classList.add("active");
  } else {
    const targetLink = document.querySelector(`.nav-link[data-view="${viewName}"]`);
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
  showToast("↻ Dashboard refreshed with live warehouse data");
  initDashboard();
}

// ═══════════════════════ KPI & WIDGET CALCULATIONS ═══════════════════════
function renderKPIs() {
  const totalProducts = state.products.length;
  const lowStockCount = state.products.filter(p => p.onHand <= p.reorderPoint).length;
  const pendingReceipts = state.receipts.filter(r => r.status !== 'Done' && r.status !== 'Canceled').length;
  const pendingDeliveries = state.deliveries.filter(d => d.status !== 'Done' && d.status !== 'Canceled').length;
  const transfersCount = state.transfers.filter(t => t.status !== 'Done').length;

  document.getElementById("kpiTotalProducts").innerText = totalProducts;
  document.getElementById("kpiLowStock").innerText = lowStockCount;
  document.getElementById("kpiPendingReceipts").innerText = pendingReceipts;
  document.getElementById("kpiPendingDeliveries").innerText = pendingDeliveries;
  document.getElementById("kpiTransfers").innerText = transfersCount;
  
  const alertCountEl = document.getElementById("alertCount");
  if (alertCountEl) alertCountEl.innerText = lowStockCount;
}

// ═══════════════════════ STOCK SUMMARY TABLE ═══════════════════════
function renderStockTable(filteredList = null) {
  const tbody = document.getElementById("stockTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const list = filteredList || state.products;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 2rem; color: var(--text-muted)">No matching products found.</td></tr>`;
    return;
  }

  list.forEach(p => {
    let statusBadge = '';
    if (p.onHand === 0) {
      statusBadge = '<span class="badge badge-red">Out of Stock</span>';
    } else if (p.onHand <= p.reorderPoint) {
      statusBadge = '<span class="badge badge-orange">Low Stock</span>';
    } else {
      statusBadge = '<span class="badge badge-green">In Stock</span>';
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight:600">${p.name}</td>
      <td><span class="badge badge-gray">${p.sku}</span></td>
      <td>${p.category}</td>
      <td>${p.location}</td>
      <td>₹${p.cost.toLocaleString('en-IN')}</td>
      <td style="font-weight:700">${p.onHand} ${p.uom}</td>
      <td>${p.freeToUse} ${p.uom}</td>
      <td>${statusBadge}</td>
      <td>
        <button class="btn btn-secondary btn-icon" title="Quick Adjust" onclick="quickAdjustProduct(${p.id})">⚖</button>
        <button class="btn btn-secondary btn-icon" title="View in Products" onclick="switchView('products',null)">👁</button>
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
    p.category.toLowerCase().includes(q)
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
  document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
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
  const status = document.getElementById("statusFilter").value;
  const wh = document.getElementById("warehouseFilter").value;
  const cat = document.getElementById("categoryFilter").value;

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

// ═══════════════════════ ALERTS & ACTIVITY FEED ═══════════════════════
function renderAlerts() {
  const alertList = document.getElementById("alertList");
  if (!alertList) return;
  alertList.innerHTML = "";

  const lowStock = state.products.filter(p => p.onHand <= p.reorderPoint);
  if (lowStock.length === 0) {
    alertList.innerHTML = `<li style="padding:1rem; color:var(--text-muted); font-size:0.875rem">No low stock items. All levels optimal! 🎉</li>`;
    return;
  }

  lowStock.forEach(p => {
    const li = document.createElement("li");
    li.className = "alert-item";
    li.innerHTML = `
      <div class="alert-item-info">
        <span class="alert-product">${p.name} (${p.sku})</span>
        <span class="alert-stock">Only ${p.onHand} ${p.uom} left (Reorder point: ${p.reorderPoint})</span>
      </div>
      <button class="btn btn-primary" style="padding:0.35rem 0.75rem; font-size:0.78rem" onclick="createReorderReceipt('${p.name}', ${p.reorderPoint * 2})">+ Reorder</button>
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
    li.className = "activity-item";
    li.innerHTML = `
      <div class="activity-icon" style="background:var(--primary-light)">${a.icon}</div>
      <div class="activity-details">
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
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

    const lateBadge = r.isLate ? `<span class="badge badge-red" style="margin-left:4px">Late</span>` : '';

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight:700; color:var(--primary); cursor:pointer" onclick="openReceiptForm('${r.id}')">${r.id}</td>
      <td>${r.from}</td>
      <td>${r.to}</td>
      <td>${r.contact}</td>
      <td>${r.date} ${lateBadge}</td>
      <td><span class="badge ${badgeClass}">${r.status}</span></td>
      <td>
        <button class="btn btn-secondary btn-icon" onclick="openReceiptForm('${r.id}')">✏ Edit</button>
        ${r.status === 'Ready' ? `<button class="btn btn-primary" style="padding:0.25rem 0.6rem; font-size:0.75rem" onclick="quickValidateReceipt('${r.id}')">Validate</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderReceiptsKanban(list);
}

function filterReceiptsTable(query) {
  const q = (query || document.getElementById("receiptSearch").value).toLowerCase().trim();
  const status = document.getElementById("receiptStatusFilter").value;

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
    btn.innerText = "☰ List View";
  } else {
    state.receiptViewMode = 'list';
    listView.classList.remove("hidden");
    kanbanView.classList.add("hidden");
    btn.innerText = "⊞ Kanban";
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
    colDiv.className = "kanban-col";
    colDiv.innerHTML = `
      <div class="kanban-col-header">
        <span>${col}</span>
        <span class="badge badge-gray">${colItems.length}</span>
      </div>
    `;

    colItems.forEach(item => {
      const card = document.createElement("div");
      card.className = "kanban-card";
      card.onclick = () => openReceiptForm(item.id);
      card.innerHTML = `
        <div class="kanban-card-title">${item.id}</div>
        <div class="kanban-card-desc">From: <strong>${item.from}</strong></div>
        <div class="kanban-card-desc">To: ${item.to}</div>
        <div class="kanban-card-footer">
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
  document.getElementById("receiptListView").classList.add("hidden");
  document.getElementById("receiptKanbanView").classList.add("hidden");
  const panel = document.getElementById("receiptFormPanel");
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
  tbody.innerHTML = "";
  receipt.items.forEach(it => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" class="inline-input" value="${it.name}" /></td>
      <td><input type="number" class="inline-input short" value="${it.qty}" /></td>
      <td><button class="btn-icon" onclick="removeRow(this)">🗑</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function updateReceiptStepper(status) {
  const steps = ["draft", "ready", "done"];
  steps.forEach(s => {
    const el = document.getElementById(`rs-${s}`);
    if (el) el.className = "step";
  });

  if (status === 'Draft') {
    document.getElementById("rs-draft").className = "step active";
  } else if (status === 'Ready') {
    document.getElementById("rs-draft").className = "step done";
    document.getElementById("rs-ready").className = "step active";
  } else if (status === 'Done') {
    document.getElementById("rs-draft").className = "step done";
    document.getElementById("rs-ready").className = "step done";
    document.getElementById("rs-done").className = "step done";
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
  r.from = document.getElementById("rf-vendor").value || r.from;
  updateReceiptStepper('Done');

  // Increase stock for items received
  r.items.forEach(it => {
    const product = state.products.find(p => p.name.toLowerCase() === it.name.toLowerCase());
    if (product) {
      product.onHand += Number(it.qty);
      product.freeToUse += Number(it.qty);
    }
    // Add to history
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

  addActivity("📥", `Receipt <strong>${r.id}</strong> validated (+${r.items.reduce((acc, x) => acc + Number(x.qty), 0)} items received)`);
  showToast(`✓ Receipt ${r.id} validated! Stock auto-increased.`);
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
  document.getElementById("receiptFormPanel").classList.add("hidden");
  document.getElementById("receiptListView").classList.remove("hidden");
  renderReceipts();
  renderKPIs();
}

function addRfRow() {
  const tbody = document.getElementById("rfProductsBody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" class="inline-input" placeholder="Product name or SKU…" /></td>
    <td><input type="number" class="inline-input short" value="1" min="1" /></td>
    <td><button class="btn-icon" onclick="removeRow(this)">🗑</button></td>
  `;
  tbody.appendChild(tr);
}

function createReorderReceipt(productName, qty) {
  const nextNum = String(state.receipts.length + 1).padStart(4, '0');
  const newReceipt = {
    id: `WH/IN/${nextNum}`,
    from: "Vendor Auto-Reorder",
    to: "WH/Stock1",
    contact: "Procurement Dept",
    date: new Date().toISOString().split('T')[0],
    status: "Ready",
    items: [{ name: productName, qty: qty }]
  };
  state.receipts.unshift(newReceipt);
  addActivity("📥", `Automated reorder receipt <strong>${newReceipt.id}</strong> created for ${productName} (${qty} units)`);
  showToast(`Created reorder receipt ${newReceipt.id} for ${productName}`);
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

    const lateBadge = d.isLate ? `<span class="badge badge-red" style="margin-left:4px">Late</span>` : '';

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight:700; color:var(--primary); cursor:pointer" onclick="openDeliveryForm('${d.id}')">${d.id}</td>
      <td>${d.from}</td>
      <td>${d.to}</td>
      <td>${d.contact}</td>
      <td>${d.date} ${lateBadge}</td>
      <td><span class="badge ${badgeClass}">${d.status}</span></td>
      <td>
        <button class="btn btn-secondary btn-icon" onclick="openDeliveryForm('${d.id}')">✏ Edit</button>
        ${d.status === 'Ready' ? `<button class="btn btn-primary" style="padding:0.25rem 0.6rem; font-size:0.75rem" onclick="quickValidateDelivery('${d.id}')">Validate</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderDeliveriesKanban(list);
}

function filterDeliveriesTable(query) {
  const q = (query || document.getElementById("deliverySearch").value).toLowerCase().trim();
  const status = document.getElementById("deliveryStatusFilter").value;

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
    btn.innerText = "☰ List View";
  } else {
    state.deliveryViewMode = 'list';
    listView.classList.remove("hidden");
    kanbanView.classList.add("hidden");
    btn.innerText = "⊞ Kanban";
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
    colDiv.className = "kanban-col";
    colDiv.innerHTML = `
      <div class="kanban-col-header">
        <span>${col}</span>
        <span class="badge badge-gray">${colItems.length}</span>
      </div>
    `;

    colItems.forEach(item => {
      const card = document.createElement("div");
      card.className = "kanban-card";
      card.onclick = () => openDeliveryForm(item.id);
      card.innerHTML = `
        <div class="kanban-card-title">${item.id}</div>
        <div class="kanban-card-desc">To: <strong>${item.to}</strong></div>
        <div class="kanban-card-desc">Contact: ${item.contact}</div>
        <div class="kanban-card-footer">
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
  document.getElementById("deliveryListView").classList.add("hidden");
  document.getElementById("deliveryKanbanView").classList.add("hidden");
  const panel = document.getElementById("deliveryFormPanel");
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
  tbody.innerHTML = "";
  delivery.items.forEach(it => {
    const product = state.products.find(p => p.name.toLowerCase() === it.name.toLowerCase());
    const stockStatus = (product && product.onHand >= it.qty) 
      ? '<span class="badge badge-green">In Stock</span>' 
      : '<span class="badge badge-red">Insufficient</span>';

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" class="inline-input" value="${it.name}" /></td>
      <td><input type="number" class="inline-input short" value="${it.qty}" /></td>
      <td>${stockStatus}</td>
      <td><button class="btn-icon" onclick="removeRow(this)">🗑</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function updateDeliveryStepper(status) {
  const steps = ["draft", "waiting", "ready", "done"];
  steps.forEach(s => {
    const el = document.getElementById(`ds-${s}`);
    if (el) el.className = "step";
  });

  if (status === 'Draft') {
    document.getElementById("ds-draft").className = "step active";
  } else if (status === 'Waiting') {
    document.getElementById("ds-draft").className = "step done";
    document.getElementById("ds-waiting").className = "step active";
  } else if (status === 'Ready') {
    document.getElementById("ds-draft").className = "step done";
    document.getElementById("ds-waiting").className = "step done";
    document.getElementById("ds-ready").className = "step active";
  } else if (status === 'Done') {
    document.getElementById("ds-draft").className = "step done";
    document.getElementById("ds-waiting").className = "step done";
    document.getElementById("ds-ready").className = "step done";
    document.getElementById("ds-done").className = "step done";
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
      showToast(`⚠️ Cannot validate: Not enough stock for ${it.name} (Need ${it.qty}, have ${p.onHand})`);
      d.status = 'Waiting';
      updateDeliveryStepper('Waiting');
      return;
    }
  }

  d.status = 'Done';
  d.to = document.getElementById("df-address").value || d.to;
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
      to: "Customer",
      qty: -Number(it.qty),
      type: "OUT",
      status: "Done"
    });
  });

  addActivity("📤", `Delivery <strong>${d.id}</strong> validated and shipped (-${d.items.reduce((acc, x) => acc + Number(x.qty), 0)} units)`);
  showToast(`✓ Delivery ${d.id} validated! Stock deducted.`);
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
      to: "Customer",
      qty: -Number(it.qty),
      type: "OUT",
      status: "Done"
    });
  });

  addActivity("📤", `Delivery <strong>${d.id}</strong> shipped`);
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
  document.getElementById("deliveryFormPanel").classList.add("hidden");
  document.getElementById("deliveryListView").classList.remove("hidden");
  renderDeliveries();
  renderKPIs();
}

function addDfRow() {
  const tbody = document.getElementById("dfProductsBody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" class="inline-input" placeholder="Product name or SKU…" /></td>
    <td><input type="number" class="inline-input short" value="1" min="1" /></td>
    <td><span class="badge badge-gray">Pending</span></td>
    <td><button class="btn-icon" onclick="removeRow(this)">🗑</button></td>
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
    if (p.onHand === 0) statusBadge = '<span class="badge badge-red">Out of Stock</span>';
    else if (p.onHand <= p.reorderPoint) statusBadge = '<span class="badge badge-orange">Low Stock</span>';
    else statusBadge = '<span class="badge badge-green">In Stock</span>';

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight:600">${p.name}</td>
      <td><span class="badge badge-gray">${p.sku}</span></td>
      <td>${p.category}</td>
      <td>${p.uom}</td>
      <td style="font-weight:700">${p.onHand}</td>
      <td>${p.reorderPoint}</td>
      <td>₹${p.cost.toLocaleString('en-IN')}</td>
      <td>${statusBadge}</td>
      <td>
        <button class="btn btn-secondary btn-icon" title="Edit" onclick="editProduct(${p.id})">✏</button>
        <button class="btn btn-danger btn-icon" title="Delete" onclick="deleteProduct(${p.id})">🗑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterProductsTable(query) {
  const q = (query || document.getElementById("productSearch").value).toLowerCase().trim();
  const cat = document.getElementById("productCategoryFilter").value;

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
  document.getElementById("productModalTitle").innerText = "New Product";
  document.getElementById("pf-name").value = "";
  document.getElementById("pf-sku").value = "";
  document.getElementById("pf-stock").value = "0";
  document.getElementById("pf-cost").value = "0";
  document.getElementById("pf-reorder").value = "10";
  document.getElementById("productModal").classList.remove("hidden");
}

function closeProductModal() {
  document.getElementById("productModal").classList.add("hidden");
}

function saveProduct() {
  const name = document.getElementById("pf-name").value.trim();
  const sku = document.getElementById("pf-sku").value.trim();
  const category = document.getElementById("pf-category").value;
  const uom = document.getElementById("pf-uom").value;
  const onHand = Number(document.getElementById("pf-stock").value) || 0;
  const cost = Number(document.getElementById("pf-cost").value) || 0;
  const reorderPoint = Number(document.getElementById("pf-reorder").value) || 10;
  const location = document.getElementById("pf-location").value;

  if (!name || !sku) {
    showToast("⚠️ Please enter product name and SKU code.");
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
  addActivity("🏷", `New product <strong>${name}</strong> (${sku}) added to catalog`);
  showToast(`✓ Product "${name}" saved!`);
}

function deleteProduct(id) {
  const idx = state.products.findIndex(p => p.id === id);
  if (idx > -1) {
    const pName = state.products[idx].name;
    state.products.splice(idx, 1);
    renderProducts();
    renderStockTable();
    renderKPIs();
    showToast(`Deleted ${pName}`);
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
      <td style="font-weight:700; color:var(--primary)">${h.ref}</td>
      <td style="color:var(--text-muted); font-size:0.8rem">${h.date}</td>
      <td style="font-weight:600">${h.product}</td>
      <td>${h.contact}</td>
      <td>${h.from}</td>
      <td>${h.to}</td>
      <td style="font-weight:700; color:${h.qty >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}">${qtySign}</td>
      <td><span class="badge ${typeBadge}">${h.type}</span></td>
      <td><span class="badge badge-green">${h.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function filterHistoryTable(query) {
  const q = (query || document.getElementById("historySearch").value).toLowerCase().trim();
  const type = document.getElementById("historyTypeFilter").value;

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
      <td style="font-weight:600">${p.name} <span class="badge badge-gray">${p.sku}</span></td>
      <td>${p.location}</td>
      <td><span id="adj-rec-${p.id}">${p.onHand}</span> ${p.uom}</td>
      <td>
        <input type="number" class="inline-input short" id="adj-input-${p.id}" value="${p.onHand}" min="0" oninput="calculateAdjustmentDiff(${p.id}, ${p.onHand})" />
      </td>
      <td><span id="adj-diff-${p.id}" style="font-weight:700; color:var(--text-muted)">0</span></td>
      <td>
        <button class="btn btn-secondary" style="padding:0.25rem 0.65rem; font-size:0.78rem" onclick="applySingleAdjustment(${p.id})">Fix Count</button>
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
    diffEl.style.color = "var(--accent-green)";
  } else if (diff < 0) {
    diffEl.innerText = `${diff}`;
    diffEl.style.color = "var(--accent-red)";
  } else {
    diffEl.innerText = `0`;
    diffEl.style.color = "var(--text-muted)";
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
    contact: "Warehouse Physical Count",
    from: "Physical Count",
    to: p.location,
    qty: diff,
    type: "Adjustment",
    status: "Done"
  });

  addActivity("🔧", `Stock count adjusted for <strong>${p.name}</strong> (${diff > 0 ? '+' + diff : diff} units)`);
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
          contact: "Stock Audit",
          from: "Physical Count",
          to: p.location,
          qty: diff,
          type: "Adjustment",
          status: "Done"
        });
      }
    }
  });

  if (adjustmentsCount > 0) {
    addActivity("🔧", `Bulk stock audit applied across ${adjustmentsCount} items`);
    showToast(`✓ Applied ${adjustmentsCount} stock adjustments to ledger`);
    renderAdjustments();
    renderKPIs();
    renderStockTable();
  } else {
    showToast("No discrepancies found to adjust.");
  }
}

function quickAdjustProduct(productId) {
  switchView('adjustments', null);
  setTimeout(() => {
    const row = document.getElementById(`adj-row-${productId}`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.style.background = "var(--primary-light)";
      setTimeout(() => row.style.background = "", 2000);
    }
  }, 100);
}

// ═══════════════════════ COMMON UTILITIES ═══════════════════════
function removeRow(btn) {
  const tr = btn.closest("tr");
  if (tr) tr.remove();
}

function toggleProfileMenu() {
  const menu = document.getElementById("profileMenu");
  menu.classList.toggle("hidden");
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
  // If user searches globally, direct to appropriate view
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
  showToast(`Sorted by ${table.querySelectorAll("th")[colIndex].innerText.replace('↕','').trim()}`);
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
  link.setAttribute("download", `StockSense_Inventory_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("⬇ Exported inventory CSV report");
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
