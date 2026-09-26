/* Settings & Profile Management — UI-only mock (Member 4). Saved in browser. */
const PKEY = "stocksense_profile_v1", SKEY = "stocksense_settings_v1";
const $ = (id) => document.getElementById(id);

function load(k, fb) { try { const v = JSON.parse(localStorage.getItem(k)); if (v) return v; } catch (e) {} return fb; }
function toast(msg) {
  const t = $("toast");
  t.textContent = msg; t.classList.remove("hidden");
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.add("hidden"), 3000);
}
async function requireAuth() {
  try {
    const r = await fetch('/api/auth/me', { credentials: 'include' });
    if (r.ok) return true;
  } catch (e) {}
  location.href = '/login/';
  return false;
}
async function doLogout() {
  try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch (e) {}
  try { localStorage.removeItem('stocksense_profile'); } catch (e) {}
  location.href = '/login/';
}
function paint(name) {
  const clean = (name || "").trim();
  const ini = clean ? clean.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  $("avatar").textContent = ini;
  if ($("navAvatar")) $("navAvatar").textContent = ini;
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!(await requireAuth())) return;
  const prof = load(PKEY, { name: "", email: "", role: "Inventory Lead", phone: "" });
  const prefs = load(SKEY, { theme: "light", wh: "All Warehouses", size: "25", date: "DD/MM/YYYY", nLow: "on", nRec: "on", nDel: "off" });
  // migrate legacy boolean prefs to on/off selects
  ["nLow", "nRec", "nDel"].forEach((k) => { if (prefs[k] === true) prefs[k] = "on"; if (prefs[k] === false) prefs[k] = "off"; });

  $("pName").value = prof.name; $("pEmail").value = prof.email;
  $("pRole").value = prof.role; $("pPhone").value = prof.phone || "";
  $("prefTheme").value = prefs.theme; $("prefWh").value = prefs.wh;
  $("prefSize").value = prefs.size; $("prefDate").value = prefs.date;
  $("nLow").value = prefs.nLow; $("nRec").value = prefs.nRec; $("nDel").value = prefs.nDel;
  paint(prof.name);

  $("saveProfile").addEventListener("click", () => {
    const next = { name: $("pName").value.trim(), email: $("pEmail").value.trim(), role: $("pRole").value, phone: $("pPhone").value.trim() };
    if (!next.name || !next.email) { toast("Name and email are required"); return; }
    try { localStorage.setItem(PKEY, JSON.stringify(next)); } catch (e) {}
    paint(next.name);
    toast("Profile saved (mock)");
  });

  $("savePrefs").addEventListener("click", () => {
    const next = { theme: $("prefTheme").value, wh: $("prefWh").value, size: $("prefSize").value, date: $("prefDate").value, nLow: $("nLow").value, nRec: $("nRec").value, nDel: $("nDel").value };
    try { localStorage.setItem(SKEY, JSON.stringify(next)); } catch (e) {}
    toast("Preferences saved (mock)");
  });

  $("passBtn").addEventListener("click", () => {
    const n = $("newPass").value, c = $("confirmPass").value;
    if (!n || n.length < 6) { toast("New password must be 6+ chars (mock)"); return; }
    if (n !== c) { toast("Passwords do not match"); return; }
    $("curPass").value = $("newPass").value = $("confirmPass").value = "";
    toast("Password updated (mock)");
  });

  $("signOutBtn").addEventListener("click", doLogout);
  $("resetBtn").addEventListener("click", () => {
    if (!confirm("Reset profile + preferences?")) return;
    try { localStorage.removeItem(PKEY); localStorage.removeItem(SKEY); } catch (e) {}
    location.reload();
  });
});
