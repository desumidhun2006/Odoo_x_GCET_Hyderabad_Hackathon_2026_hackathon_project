/* Inventory Stock Management — UI-only mock (Member 4). View / add / edit / delete. */
const KEY = "stocksense_stock_v1";

function seed() {
  return [
    { id: "p-steel", name: "Structural Steel Rods 12mm", sku: "STL-ROD-012", category: "Metals", uom: "Units", qty: 125, reorder: 25, wh: "Main DC" },
    { id: "p-bolts", name: "High-Strength Hex Bolts M12", sku: "BLT-M12-050", category: "Hardware", uom: "Box (100 pcs)", qty: 85, reorder: 30, wh: "Main DC" },
    { id: "p-chairs", name: "Ergonomic Task Chairs", sku: "CHR-ERG-09", category: "Furniture", uom: "Units", qty: 4, reorder: 10, wh: "North Hub" },
    { id: "p-seal", name: "Thermal Silicone Sealant", sku: "ADH-SIL-01", category: "Consumables", uom: "Tubes", qty: 0, reorder: 20, wh: "Production Plant A" },
  ];
}
function load() {
  try { const v = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(v) && v.length) return v; } catch (e) {}
  const s = seed();
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  return s;
}
function save(r) { try { localStorage.setItem(KEY, JSON.stringify(r)); } catch (e) {} }

let rows = load();
const $ = (id) => document.getElementById(id);
const status = (r) => (r.qty <= 0 ? "out" : r.qty <= r.reorder ? "low" : "in");
const pill = (s) => (s === "out" ? "<span class='pill draft' style='background:var(--bad-bg);color:var(--bad)'>Out of Stock</span>" : s === "low" ? "<span class='pill waiting'>Low Stock</span>" : "<span class='pill done'>In Stock</span>");

function toast(msg) {
  const t = $("toast");
  t.textContent = msg; t.classList.remove("hidden");
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.add("hidden"), 3000);
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
  $("count").textContent = list.length + " items";
  $("empty").classList.toggle("hidden", list.length > 0);
  $("rows").innerHTML = list.map((r) => (
    "<tr><td><strong>" + r.name + "</strong><div class='mono'>SKU: " + r.sku + " · " + r.wh + "</div></td>" +
    "<td>" + r.category + "</td><td class='mono'>" + r.uom + "</td>" +
    "<td style='text-align:right' class='mono'><strong>" + r.qty + "</strong></td>" +
    "<td style='text-align:right' class='mono'>" + r.reorder + "</td>" +
    "<td style='text-align:center'>" + pill(status(r)) + "</td>" +
    "<td><div class='row-actions'><button class='link' data-edit='" + r.id + "'>Edit</button>" +
    "<button class='link' style='color:var(--bad)' data-del='" + r.id + "'>Delete</button></div></td></tr>"
  )).join("");
  $("rows").querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => openModal(b.getAttribute("data-edit"))));
  $("rows").querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => remove(b.getAttribute("data-del"))));

  $("kpiSkus").textContent = rows.length;
  $("kpiUnits").textContent = rows.reduce((a, r) => a + r.qty, 0);
  $("kpiLow").textContent = rows.filter((r) => status(r) === "low").length;
  $("kpiOut").textContent = rows.filter((r) => status(r) === "out").length;
}

function openModal(id) {
  $("modal").classList.remove("hidden");
  if (id) {
    const r = rows.find((x) => x.id === id);
    $("modalTitle").textContent = "Edit item";
    $("fId").value = r.id; $("fName").value = r.name; $("fSku").value = r.sku;
    $("fCat").value = r.category; $("fUom").value = r.uom;
    $("fReorder").value = r.reorder; $("fWh").value = r.wh; $("fQty").value = r.qty;
  } else {
    $("modalTitle").textContent = "Add item";
    $("fId").value = ""; $("fName").value = ""; $("fSku").value = "";
    $("fQty").value = 0; $("fReorder").value = 10;
  }
}

function remove(id) {
  const r = rows.find((x) => x.id === id);
  if (!r || !confirm("Delete '" + r.name + "' (" + r.sku + ")?")) return;
  rows = rows.filter((x) => x.id !== id);
  save(rows); render();
  toast("Deleted " + r.sku + " (mock)");
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  ["q", "catF", "statusF"].forEach((k) => {
    $(k).addEventListener("input", render);
    $(k).addEventListener("change", render);
  });
  $("addBtn").addEventListener("click", () => openModal(null));
  $("cancelBtn").addEventListener("click", () => $("modal").classList.add("hidden"));
  $("saveBtn").addEventListener("click", () => {
    const name = $("fName").value.trim(), sku = $("fSku").value.trim();
    if (!name || !sku) { toast("Name and SKU are required"); return; }
    const body = { name, sku, category: $("fCat").value, uom: $("fUom").value, reorder: Number($("fReorder").value) || 0, wh: $("fWh").value, qty: Number($("fQty").value) || 0 };
    const id = $("fId").value;
    if (id) { rows = rows.map((x) => (x.id === id ? { ...x, ...body } : x)); toast("Updated " + sku + " (mock)"); }
    else { rows.push({ ...body, id: "p-" + Date.now() }); toast("Added " + sku + " (mock)"); }
    save(rows); render();
    $("modal").classList.add("hidden");
  });
  $("exportBtn").addEventListener("click", () => {
    const csv = "name,sku,category,uom,qty,reorder,warehouse\n" + rows.map((r) => [r.name, r.sku, r.category, r.uom, r.qty, r.reorder, r.wh].map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "stock-export.csv"; a.click();
    toast("Exported " + rows.length + " items (CSV)");
  });
});
