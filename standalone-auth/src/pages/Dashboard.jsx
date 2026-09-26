import { Boxes, CircleUserRound, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="dashboard-page">
      <header className="topbar">
        <Link className="brand-lockup" to="/dashboard">
          <span className="brand-mark"><Boxes size={19} /></span>
          <span className="brand-name">Stock<span>Sense</span></span>
        </Link>
        <div className="topbar-actions">
          <span className="topbar-user">{user?.name}</span>
          <Link className="topbar-link" to="/profile"><CircleUserRound /> Profile</Link>
          <button className="icon-button" type="button" onClick={handleLogout} aria-label="Log out" title="Log out"><LogOut /> <span>Log out</span></button>
        </div>
      </header>
      <section className="dashboard-content">
        <p className="dashboard-label">Workspace / Overview</p>
        <h1>Welcome to StockSense</h1>
        <p>Your secure workspace is ready.</p>
      </section>
    </main>
  )
}

export default Dashboard