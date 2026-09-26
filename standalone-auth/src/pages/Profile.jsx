import { ArrowLeft, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const createdAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not available'
  const role = (user?.role || 'user').replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase())

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="dashboard-page">
      <header className="topbar">
        <Link className="brand-lockup" to="/dashboard">
          <span className="brand-mark"><span className="brand-symbol">S</span></span>
          <span className="brand-name">Stock<span>Sense</span></span>
        </Link>
        <div className="topbar-actions">
          <span className="topbar-user">{user?.name}</span>
          <Link className="topbar-link" to="/dashboard"><ArrowLeft /> Dashboard</Link>
        </div>
      </header>
      <section className="dashboard-content profile-content">
        <p className="dashboard-label">Account / Profile</p>
        <h1>Your profile</h1>
        <p className="profile-intro">Account details for your StockSense access.</p>
        <dl className="profile-sheet">
          <div className="profile-row"><dt>Full name</dt><dd>{user?.name || 'Not available'}</dd></div>
          <div className="profile-row"><dt>Email address</dt><dd>{user?.email || 'Not available'}</dd></div>
          <div className="profile-row"><dt>Role</dt><dd>{role}</dd></div>
          <div className="profile-row"><dt>Account created</dt><dd>{createdAt}</dd></div>
          <div className="profile-row"><dt>Email status</dt><dd>{user?.isVerified ? 'Verified' : 'Not verified'}</dd></div>
        </dl>
        <button className="icon-button profile-logout" type="button" onClick={handleLogout}><LogOut /> Log out</button>
      </section>
    </main>
  )
}

export default Profile