/* Settings & Profile Management — UI-only mock (Member 4). Saved in browser. */
const PKEY = "stocksense_profile_v1", SKEY = "stocksense_settings_v1";
const $ = (id) => document.getElementById(id);

function load(k, fb) { try { const v = JSON.parse(localStorage.getItem(k)); if (v) return v; } catch (e) {} return fb; }
function toast(msg) {
  const t = $("toast");
  t.textContent = msg; t.classList.remove("hidden");
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.add("hidden"), 3000);
}
function paint(name) {
  $("avatar").textContent = (name || "ER").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function theme(t) { document.body.classList.toggle("dark", t === "dark"); }

document.addEventListener("DOMContentLoaded", () => {
  const prof = load(PKEY, { name: "Elena Rodriguez", email: "elena@stocksense.io", role: "Inventory Lead", phone: "" });
  const prefs = load(SKEY, { theme: "light", wh: "All Warehouses", size: "25", date: "DD/MM/YYYY", nLow: true, nRec: true, nDel: false });

  $("pName").value = prof.name; $("pEmail").value = prof.email;
  $("pRole").value = prof.role; $("pPhone").value = prof.phone || "";
  $("prefTheme").value = prefs.theme; $("prefWh").value = prefs.wh;
  $("prefSize").value = prefs.size; $("prefDate").value = prefs.date;
  $("nLow").checked = prefs.nLow; $("nRec").checked = prefs.nRec; $("nDel").checked = prefs.nDel;
  theme(prefs.theme); paint(prof.name);

  $("saveProfile").addEventListener("click", () => {
    const next = { name: $("pName").value.trim(), email: $("pEmail").value.trim(), role: $("pRole").value, phone: $("pPhone").value.trim() };
    if (!next.name || !next.email) { toast("Name and email are required"); return; }
    try { localStorage.setItem(PKEY, JSON.stringify(next)); } catch (e) {}
    paint(next.name);
    toast("Profile saved (mock)");
  });

  $("savePrefs").addEventListener("click", () => {
    const next = { theme: $("prefTheme").value, wh: $("prefWh").value, size: $("prefSize").value, date: $("prefDate").value, nLow: $("nLow").checked, nRec: $("nRec").checked, nDel: $("nDel").checked };
    try { localStorage.setItem(SKEY, JSON.stringify(next)); } catch (e) {}
    theme(next.theme);
    toast("Preferences saved (mock)");
  });

  $("passBtn").addEventListener("click", () => {
    const n = $("newPass").value, c = $("confirmPass").value;
    if (!n || n.length < 6) { toast("New password must be 6+ chars (mock)"); return; }
    if (n !== c) { toast("Passwords do not match"); return; }
    $("curPass").value = $("newPass").value = $("confirmPass").value = "";
    toast("Password updated (mock)");
  });

  $("clearBtn").addEventListener("click", () => {
    if (!confirm("Clear demo receipts + stock data from this browser?")) return;
    try { localStorage.removeItem("stocksense_receipts_v1"); localStorage.removeItem("stocksense_stock_v1"); } catch (e) {}
    toast("Demo data cleared (mock)");
  });
  $("resetBtn").addEventListener("click", () => {
    if (!confirm("Reset profile + preferences?")) return;
    try { localStorage.removeItem(PKEY); localStorage.removeItem(SKEY); } catch (e) {}
    location.reload();
  });
});
