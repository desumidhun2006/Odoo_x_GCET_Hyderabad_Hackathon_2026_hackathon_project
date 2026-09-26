# StockSense Features API Contract (for M2 Auth, M3 Dashboard, M1 Innovation)

Base: `http://localhost:5000/api` (see `../.env.example`)

Auth: all routes use `protect` stub now (`server/middleware/auth.js`). M2 to replace with JWT verify; contract: `req.user = { id, email }`.

## Products / Warehouses / Stock
- `GET /products?q=&category=` `GET /products/search?q=` `GET /products/:id/stock`
- `POST /products {name,sku,category,uom,reorderLevel,warehouseId?,location?,initialQty?}`
- `GET /warehouses` `POST /warehouses {name,code,locations[]}`

## Operations (status: Draft|Waiting|Ready|Done|Canceled)
- `POST /receipts {supplier,warehouse,lines:[{product,qty}]}` → `POST /receipts/:id/validate {location?}` (+stock + ledger)
- `POST /deliveries {customer,warehouse,lines}` → `POST /deliveries/:id/validate` (−stock, 400 if insufficient)
- `POST /transfers {fromWarehouse,fromLocation,toWarehouse,toLocation,lines}` → `POST /transfers/:id/validate` (−from/+to)
- `POST /adjustments {product,warehouse,location,countedQty,reason}` (sets stock, logs diff)

## Ledger / Dashboard (for M3)
- `GET /ledger?type=&productId=&warehouseId=&from=&to=`
- `GET /ledger/low-stock` → `[{product,warehouse,location,qty,reorderLevel}]`
- `GET /ledger/dashboard-summary` → `{totalProducts,lowStock,outOfStock,pendingReceipts,pendingDeliveries,scheduledTransfers}`

## Demo flow (matches PDF simplified example)
1. Seed: `npm run seed` (needs MONGO_URI) → WH-01, Steel STL-001, Chairs CHR-010
2. Receipt 100kg Steel → validate → +100 Main Store
3. Transfer Main Store → Production Rack → total unchanged
4. Delivery 20 steel → validate → −20
5. Adjustment counted −3 damaged → diff logged
6. `GET /ledger` shows all 4 moves; M3 KPIs read from dashboard-summary.
