import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  const location = useLocation()

  // If not logged in, redirect to login with return path
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
} 