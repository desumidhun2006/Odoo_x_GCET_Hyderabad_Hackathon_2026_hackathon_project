# StockSense — Inventory Management System

Odoo x GCET Hyderabad Hackathon 2026 project. A full-stack inventory app:
glass-style web UI (dashboard, receipts, stock, settings, login) backed by an
Express + MongoDB API with JWT authentication.

## Requirements

- **Node.js 20+** and **npm** (check: `node -v`, `npm -v`)
- **MongoDB** — either:
  - a local/remote instance with a `MONGO_URI` connection string, **or**
  - nothing at all: the demo below uses an in-memory database automatically
- A modern browser (Chrome recommended)

## Quick start (demo with working data)

```bash
# 1. Install server dependencies
cd server
npm install

# 2. Start the API + web app with demo data (in-memory MongoDB, no setup)
DEMO_PORT=5030 node scripts/live-demo.js
# Then open: http://localhost:5030/
```

> `live-demo.js` seeds 2 warehouses, 4 products, a validated receipt,
> a pending receipt, a validated delivery, a transfer and an audit
> adjustment, so every KPI, table, ledger row and chart has real data.

### Demo login

The app navigates from the login screen. Use the seeded demo account:

- **Email:** `demo@stocksense.io`
- **Password:** `Demo@1234`

Or register a new account from the login screen (name + email + password).

## How to use the web app

1. **Sign in** at `/` (redirects to `/login/` when logged out).
2. **Dashboard** (`/dashboard/`) — KPIs, stock table, receipts / deliveries /
   products / history / adjustments views, velocity + category charts,
   warehouse capacity, global search. Validate documents to move stock.
3. **Receipts** (`/receipts/`) — log inbound shipments, validate to
   auto-increment stock.
4. **Stock** (`/stock/`) — view, add, edit and delete warehouse items;
   CSV export included. (Quantities change via receipts & adjustments.)
5. **Settings** (`/settings/`) — profile, preferences, password change
   (mock), sign out.
6. **Sign out** from the avatar menu (dashboard) or Settings → System.

Every screen talks to the live API — there is no mock data in the UI.
If the API is unreachable, screens show an offline empty state.

## Run with your own MongoDB

```bash
cd server
npm install
export MONGO_URI="mongodb://localhost:27017/stocksense"
export JWT_SECRET="a-long-random-secret-at-least-32-characters"
npm run seed:demo   # load working demo data (optional)
npm start           # serves API + app on http://localhost:5000
```

Useful scripts (`server/package.json`):

| Command              | What it does                                  |
| -------------------- | --------------------------------------------- |
| `npm start`          | Run API + static app (needs `MONGO_URI`)      |
| `npm run dev`        | Same with auto-restart on file changes        |
| `npm run seed`       | Minimal seed (warehouses + 2 products)        |
| `npm run seed:demo`  | Full working demo dataset + demo login        |

## API overview

Base URL: `http://localhost:5000/api` (see `server/API_CONTRACT.md`).

- `POST /api/auth/register|login` · `GET /api/auth/me` · `POST /api/auth/logout`
- `GET/POST /api/products` · `PUT/DELETE /api/products/:id` · `GET /api/products/:id/stock`
- `GET /api/warehouses`
- `POST /api/receipts` → `POST /api/receipts/:id/validate` (adds stock)
- `POST /api/deliveries` → `POST /api/deliveries/:id/validate` (removes stock, 400 if short)
- `POST /api/transfers` → `POST /api/transfers/:id/validate` (moves stock)
- `POST /api/adjustments` (sets counted quantity, logs the difference)
- `GET /api/ledger` · `GET /api/ledger/low-stock` · `GET /api/ledger/dashboard-summary`

## Project layout

```
dashboard/        main SPA (overview, products, receipts, deliveries, history, adjustments)
login/            sign-in / register gate (index.html + app.js + style.css)
receipts/         receipts & incoming goods screen (index.html + app.js + style.css)
stock/            inventory stock management screen (index.html + app.js + style.css)
settings/         settings & profile screen (index.html + app.js + style.css)
server/           Express API (routes, models, JWT auth, seed scripts)
standalone-auth/  original branch auth module (React app + reference server, kept for history)
journey.md        chronological task log
```

See `journey.md` for the full task history.
