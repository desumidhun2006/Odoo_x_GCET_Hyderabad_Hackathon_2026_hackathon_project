/* StockSense Sign In — talks to the integrated /api/auth (standalone-auth branch code). */
const $ = (id) => document.getElementById(id);
let mode = 'login'; // 'login' | 'register'

async function api(path, body) {
  const r = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.message || data.error || ('HTTP ' + r.status));
  return data;
}

function toast(msg) {
  const t = $('toast');
  t.innerText = msg;
  t.classList.remove('hidden');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.add('hidden'), 3200);
}

function showError(msg) {
  const box = $('errBox');
  box.innerText = msg;
  box.classList.remove('hidden');
}

function setMode(next) {
  mode = next;
  const login = mode === 'login';
  $('tabLogin').className = login ? 'crystal-btn primary' : 'crystal-btn secondary';
  $('tabRegister').className = login ? 'crystal-btn secondary' : 'crystal-btn primary';
  $('tabLogin').style.flex = '1'; $('tabRegister').style.flex = '1';
  $('nameGroup').style.display = login ? 'none' : '';
  $('submitBtn').innerText = login ? 'Sign In →' : 'Create Account →';
  $('errBox').classList.add('hidden');
}

function enterApp(user) {
  try {
    localStorage.setItem('stocksense_profile', JSON.stringify({
      name: user.name, email: user.email,
      role: user.role === 'admin' ? 'Inventory Admin' : 'Inventory Staff',
    }));
  } catch (e) {}
  location.href = '/dashboard/';
}

async function submit() {
  $('errBox').classList.add('hidden');
  const email = $('fEmail').value.trim();
  const password = $('fPass').value;
  if (!email || !password) { showError('Email and password are required.'); return; }
  $('submitBtn').innerText = 'Please wait…';
  try {
    if (mode === 'login') {
      const res = await api('/api/auth/login', { email, password });
      enterApp(res.user);
    } else {
      const name = $('fName').value.trim();
      if (name.length < 2) { showError('Enter your full name (2+ characters).'); return; }
      await api('/api/auth/register', { name, email, password });
      const res = await api('/api/auth/login', { email, password });
      enterApp(res.user);
    }
  } catch (e) {
    showError(e.message);
  } finally {
    $('submitBtn').innerText = mode === 'login' ? 'Sign In →' : 'Create Account →';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Already signed in? Go straight to the app.
  try {
    const r = await fetch('/api/auth/me', { credentials: 'include' });
    if (r.ok) { location.href = '/dashboard/'; return; }
  } catch (e) { /* API offline — stay and show the form */ }

  $('tabLogin').addEventListener('click', () => setMode('login'));
  $('tabRegister').addEventListener('click', () => setMode('register'));
  $('submitBtn').addEventListener('click', submit);
  $('demoBtn').addEventListener('click', () => {
    $('fEmail').value = 'demo@stocksense.io';
    $('fPass').value = 'Demo@1234';
    setMode('login');
    toast('Demo credentials filled — hit Sign In');
  });
  [$('fName'), $('fEmail'), $('fPass')].forEach(el => el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit();
  }));
});
