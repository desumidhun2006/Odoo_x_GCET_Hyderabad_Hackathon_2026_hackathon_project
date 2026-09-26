/* Receipts & Incoming Goods — UI-only mock (Member 4). No backend required. */
const KEY = "stocksense_receipts_v1";

function seed() {
  return [
    { id: "REC-2024-0892", supplier: "Metallo Industrial Supplies Ltd.", po: "PO-94021", warehouse: "Main DC", lines: [{ sku: "STL-ROD-012", qty: 50 }, { sku: "BLT-M12-050", qty: 20 }], status: "Ready", date: "Today" },
    { id: "REC-2024-0891", supplier: "Metallo Corp", po: "PO-94018", warehouse: "Main DC", lines: [{ sku: "STL-ROD-012", qty: 50 }], status: "Waiting", date: "Today" },
    { id: "WH/IN/0003", supplier: "Fastener Hub Inc", po: "PO-93990", warehouse: "North Hub", lines: [{ sku: "BLT-M12-050", qty: 200 }], status: "Done", date: "2026-09-22" },
    { id: "WH/IN/0004", supplier: "Global Pack Co", po: "PO-94100", warehouse: "Main DC", lines: [{ sku: "CHR-ERG-09", qty: 20 }], status: "Draft", date: "2026-09-28" },
  ];
}
function load() {
  try { const v = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(v) && v.length) return v; } catch (e) {}
  const s = seed();
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  return s;
}
function save(rows) { try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch (e) {} }

let rows = load();
const $ = (id) => document.getElementById(id);

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.add("hidden"), 3000);
}
function totalQty(r) { return r.lines.reduce((a, l) => a + l.qty, 0); }

function render() {
  const q = ($("q").value || "").toLowerCase();
  const st = $("statusF").value;
  const list = rows.filter((r) => {
    if (st && r.status !== st) return false;
    if (q && !(r.id.toLowerCase().includes(q) || r.supplier.toLowerCase().includes(q) || r.lines.some((l) => l.sku.toLowerCase().includes(q)))) return false;
    return true;
  });
  $("count").textContent = list.length + " receipts";
  $("empty").classList.toggle("hidden", list.length > 0);
  $("rows").innerHTML = list.map((r) => (
    "<tr><td><strong>" + r.id + "</strong><div class='mono'>" + r.date + " · " + r.warehouse + "</div></td>" +
    "<td>" + r.supplier + "<div class='mono'>" + r.po + "</div></td>" +
    "<td class='mono'>" + r.lines.map((l) => l.sku + " ×" + l.qty).join("<br>") + "</td>" +
    "<td class='mono'><strong>" + totalQty(r) + "</strong></td>" +
    "<td><span class='pill " + r.status.toLowerCase() + "'>" + r.status + "</span></td>" +
    "<td><div class='row-actions'>" +
    (r.status !== "Done" ? "<button class='link' data-validate='" + r.id + "'>Validate</button>" : "<span class='mono'>locked</span>") +
    "</div></td></tr>"
  )).join("");
  $("rows").querySelectorAll("[data-validate]").forEach((b) => b.addEventListener("click", () => validate(b.getAttribute("data-validate"))));

  $("kpiPending").textContent = rows.filter((r) => r.status !== "Done").length;
  $("kpiToday").textContent = rows.filter((r) => r.date === "Today").length;
  $("kpiDone").textContent = rows.filter((r) => r.status === "Done").length;
  $("kpiUnits").textContent = rows.reduce((a, r) => a + totalQty(r), 0);
}

function validate(id) {
  rows = rows.map((r) => (r.id === id ? { ...r, status: "Done" } : r));
  save(rows); render();
  toast("Validated " + id + " — stock increased (mock)");
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  $("q").addEventListener("input", render);
  $("statusF").addEventListener("change", render);
  $("newBtn").addEventListener("click", () => $("modal").classList.remove("hidden"));
  $("cancelBtn").addEventListener("click", () => $("modal").classList.add("hidden"));
  $("saveBtn").addEventListener("click", () => {
    const supplier = $("fSupplier").value.trim();
    if (!supplier) { toast("Supplier is required"); return; }
    const prod = $("fProduct").value;
    const sku = prod.match(/\(([^)]+)\)/)[1];
    const id = "REC-2026-" + String(Math.floor(1000 + Math.random() * 9000));
    rows.unshift({ id, supplier, po: $("fPo").value.trim() || "PO-—", warehouse: $("fWh").value, lines: [{ sku, qty: Math.max(1, Number($("fQty").value) || 1) }], status: "Draft", date: "Today" });
    save(rows); render();
    $("modal").classList.add("hidden");
    $("fSupplier").value = ""; $("fPo").value = "";
    toast("Logged " + id + " (mock)");
  });
});
