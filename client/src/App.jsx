export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>StockSense — Inventory Management</h1>
      <nav style={{ display: 'flex', gap: 12 }}>
        <a href="#products">Products</a><a href="#receipts">Receipts</a>
        <a href="#delivery">Delivery</a><a href="#transfers">Transfers</a>
        <a href="#adjust">Adjustments</a><a href="#history">Move History</a>
      </nav>
      <div id="inventory-root" />
    </div>
  );
}
