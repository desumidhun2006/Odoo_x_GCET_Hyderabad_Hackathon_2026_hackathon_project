/* Inventory Stock Management — live API only (Member 4). No mock data. */
const $ = (id) => document.getElementById(id);

async function api(method, path, body) {
  const r = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || ("HTTP " + r.status));
  return data;
}

let rows = [];
let warehouses = [];
let apiOnline = false;

const status = (r) => (r.qty <= 0 ? "out" : r.qty <= r.reorder ? "low" : "in");

function toast(msg) {
  const t = $("toast");
  t.innerText = msg; t.classList.remove("hidden");
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.add("hidden"), 3200);
}

function badge(s) {
  if (s === "out") return '<span class="badge badge-red"><span class="beacon" style="background:#fb7185"></span>Out of Stock</span>';
  if (s === "low") return '<span class="badge badge-orange"><span class="beacon" style="background:#fbbf24"></span>Low Stock</span>';
  return '<span class="badge badge-green"><span class="beacon"></span>In Stock</span>';
}

function gauge(r) {
  const cls = r.qty <= 0 ? "danger" : r.qty <= r.reorder ? "warning" : "optimal";
  const pct = r.qty <= 0 ? 0 : Math.min(100, Math.round((r.qty / Math.max(1, r.reorder * 2)) * 100));
  return '<div class="stock-gauge-wrap"><span style="font-family:var(--font-mono); font-weight:700; color:var(--text-head)">' + r.qty + '</span>' +
    '<div class="stock-track"><div class="stock-fill ' + cls + '" style="width:' + pct + '%"></div></div></div>';
}

async function loadAll() {
  warehouses = await api("GET", "/api/warehouses");
  const products = await api("GET", "/api/products");
  const enriched = [];
  for (const p of products) {
    let qty = 0, wh = "—", loc = "";
    try {
      const st = await api("GET", "/api/products/" + p._id + "/stock");
      qty = st.reduce((a, s) => a + (s.qty || 0), 0);
      if (st.length) {
        wh = (st[0].warehouse && st[0].warehouse.name) || "—";
        loc = st[0].location || "";
      }
    } catch (e) { /* product with no stock rows yet */ }
    enriched.push({
      _id: p._id, name: p.name, sku: p.sku, category: p.category || "General",
      uom: p.uom || "units", reorder: p.reorderLevel ?? 10, qty, warehouse: wh, location: loc,
    });
  }
  rows = enriched;
  apiOnline = true;

  const whOpts = warehouses.map((w) => `<option value="${w._id}">${w.name} (${w.code})</option>`).join("");
  $("fWh").innerHTML = whOpts || "<option value=''>No warehouses</option>";

  const cats = [...new Set(rows.map((r) => r.category))].sort();
  $("catF").innerHTML = '<option value="">All Categories</option>' + cats.map((c) => `<option>${c}</option>`).join("");
}

function render() {
  const q = ($("q").value || "").toLowerCase();
  const cat = $("catF").value, st = $("statusF").value;
  const list = rows.filter((r) => {
    if (cat && r.category !== cat) return false;
    if (st && status(r) !== st) return false;
    if (q && !(r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q))) return false;
    return true;
  });
  $("count").innerText = list.length + " items";
  const empty = $("empty");
  if (!apiOnline) {
    empty.innerText = "Cannot reach the API — start the server and reload.";
    empty.classList.remove("hidden");
  } else {
    empty.innerText = "No items yet. Add your first product.";
    empty.classList.toggle("hidden", list.length > 0);
  }
  $("rows").innerHTML = list.map((r) => (
    "<tr><td><div style='font-weight:700; color:var(--text-head)'>" + r.name + "</div>" +
    "<div style='font-size:0.72rem; color:var(--text-dim)'>UoM: " + r.uom + (r.location ? " · " + r.location : "") + "</div></td>" +
    "<td><span class='sku-tag'>" + r.sku + "</span></td>" +
    "<td><span style='font-size:0.82rem; color:var(--text-muted)'>" + r.category + "</span></td>" +
    "<td><span style='font-size:0.82rem; color:var(--text-muted)'>" + r.warehouse + "</span></td>" +
    "<td>" + gauge(r) + "</td>" +
    "<td style='font-family:var(--font-mono); font-weight:600'>" + r.reorder + "</td>" +
    "<td>" + badge(status(r)) + "</td>" +
    "<td><div class='row-actions' style='justify-content:flex-end'><button class='action-btn-sm' data-edit='" + r._id + "'>✎ Edit</button>" +
    "<button class='action-btn-sm danger' data-del='" + r._id + "'>🗑 Delete</button></div></td></tr>"
  )).join("");
  $("rows").querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => openModal(b.getAttribute("data-edit"))));
  $("rows").querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => remove(b.getAttribute("data-del"))));

  $("kpiSkus").innerText = rows.length;
  $("kpiUnits").innerText = rows.reduce((a, r) => a + r.qty, 0);
  $("kpiLow").innerText = rows.filter((r) => status(r) === "low").length;
  $("kpiOut").innerText = rows.filter((r) => status(r) === "out").length;
}

async function reload() {
  await loadAll();
  render();
}

function ensureOption(sel, value) {
  if (![...sel.options].some((o) => o.value === value || o.text === value)) {
    const o = document.createElement("option");
    o.value = value; o.textContent = value;
    sel.appendChild(o);
  }
  sel.value = value;
}

function openModal(id) {
  $("modal").classList.remove("hidden");
  if (id) {
    const r = rows.find((x) => String(x._id) === String(id));
    $("modalTitle").innerText = "Edit item";
    $("fId").value = r._id; $("fName").value = r.name; $("fSku").value = r.sku;
    ensureOption($("fCat"), r.category); ensureOption($("fUom"), r.uom);
    $("fReorder").value = r.reorder; $("fQty").value = r.qty;
    $("fQty").disabled = true;
    $("fQty").title = "Stock changes via receipts & adjustments";
  } else {
    $("modalTitle").innerText = "Add item";
    $("fId").value = ""; $("fName").value = ""; $("fSku").value = "";
    $("fQty").value = 0; $("fReorder").value = 10;
    $("fQty").disabled = false;
    $("fQty").title = "";
  }
}

async function remove(id) {
  const r = rows.find((x) => String(x._id) === String(id));
  if (!r || !confirm("Delete '" + r.name + "' (" + r.sku + ")?")) return;
  try {
    await api("DELETE", "/api/products/" + id);
    await reload();
    toast("Removed " + r.sku);
  } catch (e) { toast("⚠️ " + e.message); }
}

document.addEventListener("DOMContentLoaded", async () => {
  try { await loadAll(); }
  catch (e) { toast("⚠️ API offline — " + e.message); }
  render();
  ["q", "catF", "statusF"].forEach((k) => {
    $(k).addEventListener("input", render);
    $(k).addEventListener("change", render);
  });
  $("addBtn").addEventListener("click", () => openModal(null));
  $("cancelBtn").addEventListener("click", () => $("modal").classList.add("hidden"));
  $("cancelBtn2").addEventListener("click", () => $("modal").classList.add("hidden"));
  $("saveBtn").addEventListener("click", async () => {
    const name = $("fName").value.trim(), sku = $("fSku").value.trim();
    if (!name || !sku) { toast("Name and SKU are required"); return; }
    const id = $("fId").value;
    try {
      if (id) {
        await api("PUT", "/api/products/" + id, {
          name, sku, category: $("fCat").value, uom: $("fUom").value,
          reorderLevel: Number($("fReorder").value) || 0,
        });
        toast("✓ Updated " + sku);
      } else {
        if (!$("fWh").value) { toast("Create a warehouse first"); return; }
        await api("POST", "/api/products", {
          name, sku, category: $("fCat").value, uom: $("fUom").value,
          reorderLevel: Number($("fReorder").value) || 0,
          warehouseId: $("fWh").value,
          location: "Main Store",
          initialQty: Number($("fQty").value) || 0,
        });
        toast("✓ Added " + sku);
      }
      $("modal").classList.add("hidden");
      await reload();
    } catch (e) { toast("⚠️ " + e.message); }
  });
  $("exportBtn").addEventListener("click", () => {
    const csv = "name,sku,category,uom,qty,reorder,warehouse\n" + rows.map((r) => [r.name, r.sku, r.category, r.uom, r.qty, r.reorder, r.warehouse].map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "stock-export.csv"; a.click();
    toast("Exported " + rows.length + " items (CSV)");
  });
});
