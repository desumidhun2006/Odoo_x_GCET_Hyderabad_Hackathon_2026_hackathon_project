import ProductsPage from './features/inventory/ProductsPage.jsx';
import OpsPage from './features/inventory/OpsPage.jsx';
import HistoryPage from './features/inventory/HistoryPage.jsx';
import DashboardPanel from './features/inventory/DashboardPanel.jsx';
export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 900 }}>
      <h1>StockSense — Inventory Management</h1>
      <nav style={{ display: 'flex', gap: 12 }}>
        <a href="#products">Products</a><a href="#ops">Operations</a>
        <a href="#history">Move History</a><a href="#dashboard-kpis">KPIs</a>
      </nav>
      <DashboardPanel /><ProductsPage /><OpsPage /><HistoryPage />
    </div>
  );
}
