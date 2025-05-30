import { Navigate } from 'react-router-dom'

export default function PublicRoute({ children }) {
  const token = localStorage.getItem('token')

  // If logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return children
} 