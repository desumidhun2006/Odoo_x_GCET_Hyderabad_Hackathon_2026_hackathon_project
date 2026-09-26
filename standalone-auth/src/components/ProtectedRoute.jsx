import { LoaderCircle } from 'lucide-react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function ProtectedRoute() {
  const { authenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="loading-screen" role="status" aria-label="Loading account"><LoaderCircle size={24} /></div>
  }

  return authenticated
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />
}

export default ProtectedRoute