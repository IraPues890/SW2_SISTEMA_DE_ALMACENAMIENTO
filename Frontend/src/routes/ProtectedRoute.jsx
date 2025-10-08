import React from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function ProtectedRoute({ children, roles }) {
  const { user } = React.useContext(AuthContext)
  if (!user) return <Navigate to='/' replace />
  if (roles && roles.length > 0 && !roles.includes(user.role)) return <Navigate to='/' replace />
  return children
}

export default ProtectedRoute
