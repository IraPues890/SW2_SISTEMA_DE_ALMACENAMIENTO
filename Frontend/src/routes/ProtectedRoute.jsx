import React from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function ProtectedRoute({ children, roles }) {
  const { user } = React.useContext(AuthContext)
  
  // Si no hay usuario, redirigir al login
  if (!user) return <Navigate to='/login' replace />
  
  // Si se especifican roles y el usuario no tiene el rol requerido
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // Redirigir según el rol del usuario
    const userRole = user.role || user.rol?.nombre
    
    if (userRole === 'Administrador') {
      return <Navigate to='/admin' replace />
    } else {
      return <Navigate to='/user' replace />
    }
  }
  
  return children
}

export default ProtectedRoute
