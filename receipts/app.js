/* Receipts & Incoming Goods — live API only (Member 4). No mock data. */
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
let products = [];
let apiOnline = false;

function toast(msg) {
  const t = $("toast");
  t.innerText = msg;
  t.classList.remove("hidden");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.add("hidden"), 3200);
}

function statusBadge(s) {
  if (s === "Done") return '<span class="badge badge-green"><span class="beacon"></span>Done</span>';
  if (s === "Ready") return '<span class="badge badge-blue"><span class="beacon" style="background:#60a5fa"></span>Ready</span>';
  if (s === "Waiting") return '<span class="badge badge-orange"><span class="beacon" style="background:#fbbf24"></span>Waiting</span>';
  if (s === "Canceled") return '<span class="badge badge-red"><span class="beacon" style="background:#fb7185"></span>Canceled</span>';
  return '<span class="badge badge-gray">Draft</span>';
}

function mapReceipt(d) {
  const lines = (d.lines || []).map((l) => ({
    sku: (l.product && l.product.sku) || "—",
    qty: l.qty,
  }));
  return {
    _id: d._id,
    ref: "IN-" + String(d._id).slice(-6).toUpperCase(),
    supplier: d.supplier || "—",
    warehouse: (d.warehouse && d.warehouse.name) || "—",
    lines,
    qty: lines.reduce((a, l) => a + l.qty, 0),
    status: d.status,
    date: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—",
  };
}

async function loadAll() {
  [warehouses, products, rows] = await Promise.all([
    api("GET", "/api/warehouses"),
    api("GET", "/api/products"),
    api("GET", "/api/receipts").then((list) => list.map(mapReceipt)),
  ]);
  apiOnline = true;
  $("fWh").innerHTML = warehouses.map((w) => `<option value="${w._id}">${w.name} (${w.code})</option>`).join("") || "<option value=''>No warehouses</option>";
  $("fProduct").innerHTML = products.map((p) => `<option value="${p._id}">${p.name} (${p.sku})</option>`).join("") || "<option value=''>No products</option>";
}

function render() {
  const q = ($("q").value || "").toLowerCase();
  const st = $("statusF").value;
  const list = rows.filter((r) => {
    if (st && r.status !== st) return false;
    if (q && !(r.ref.toLowerCase().includes(q) || r.supplier.toLowerCase().includes(q) || r.lines.some((l) => l.sku.toLowerCase().includes(q)))) return false;
    return true;
  });
  $("count").innerText = list.length + " receipts";
  const empty = $("empty");
  if (!apiOnline) {
    empty.innerText = "Cannot reach the API — start the server and reload.";
    empty.classList.remove("hidden");
  } else {
    empty.innerText = "No receipts yet. Log your first inbound shipment.";
    empty.classList.toggle("hidden", list.length > 0);
  }
  $("rows").innerHTML = list.map((r) => (
    "<tr><td><div style='font-weight:700; color:var(--text-head)'>" + r.ref + "</div><div style='font-size:0.72rem; color:var(--text-dim)'>" + r.date + " · " + r.warehouse + "</div></td>" +
    "<td><div style='font-weight:600'>" + r.supplier + "</div></td>" +
    "<td>" + (r.lines.map((l) => "<span class='sku-tag'>" + l.sku + "</span> <span style='font-family:var(--font-mono); font-weight:700'>×" + l.qty + "</span>").join("<br>") || "—") + "</td>" +
    "<td style='font-family:var(--font-mono); font-weight:700'>" + r.qty + "</td>" +
    "<td>" + statusBadge(r.status) + "</td>" +
    "<td><div class='row-actions' style='justify-content:flex-end'>" +
    (r.status !== "Done" && r.status !== "Canceled"
      ? "<button class='action-btn-sm' data-validate='" + r._id + "'>✓ Validate</button>"
      : "<span style='font-size:0.72rem; color:var(--text-dim); font-family:var(--font-mono)'>locked</span>") +
    "</div></td></tr>"
  )).join("");
  $("rows").querySelectorAll("[data-validate]").forEach((b) => b.addEventListener("click", () => validate(b.getAttribute("data-validate"))));

  $("kpiPending").innerText = rows.filter((r) => r.status !== "Done" && r.status !== "Canceled").length;
  $("kpiToday").innerText = rows.filter((r) => r.date === new Date().toLocaleDateString()).length;
  $("kpiDone").innerText = rows.filter((r) => r.status === "Done").length;
  $("kpiUnits").innerText = rows.reduce((a, r) => a + r.qty, 0);
}

async function reload() {
  rows = (await api("GET", "/api/receipts")).map(mapReceipt);
  render();
}

async function validate(id) {
  try {
    await api("POST", "/api/receipts/" + id + "/validate", { location: "Main Store" });
    await reload();
    toast("✓ Receipt validated — stock incremented.");
  } catch (e) { toast("⚠️ " + e.message); }
}

document.addEventListener("DOMContentLoaded", async () => {
  try { await loadAll(); }
  catch (e) { toast("⚠️ API offline — " + e.message); }
  render();
  $("q").addEventListener("input", render);
  $("statusF").addEventListener("change", render);
  $("newBtn").addEventListener("click", () => $("modal").classList.remove("hidden"));
  $("cancelBtn").addEventListener("click", () => $("modal").classList.add("hidden"));
  $("cancelBtn2").addEventListener("click", () => $("modal").classList.add("hidden"));
  $("saveBtn").addEventListener("click", async () => {
    const supplier = $("fSupplier").value.trim();
    if (!supplier) { toast("Supplier is required"); return; }
    if (!$("fWh").value || !$("fProduct").value) { toast("Need a warehouse and a product first"); return; }
    try {
      await api("POST", "/api/receipts", {
        supplier,
        warehouse: $("fWh").value,
        lines: [{ product: $("fProduct").value, qty: Math.max(1, Number($("fQty").value) || 1) }],
      });
      await reload();
      $("modal").classList.add("hidden");
      $("fSupplier").value = "";
      toast("✓ Receipt logged.");
    } catch (e) { toast("⚠️ " + e.message); }
  });
});
