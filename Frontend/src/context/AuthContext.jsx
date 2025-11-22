import React, { createContext, useState } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  function login({ email, password }) {
    // Realizar login al backend con JWT
    return fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const userData = {
          ...data.data.usuario,
          role: data.data.usuario.rol?.nombre || 'Usuario' // Mapear rol.nombre a role
        }
        
        setUser(userData)
        setToken(data.data.token)
        
        // Guardar en localStorage
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(userData))
        
        return { success: true, user: userData }
      } else {
        throw new Error(data.message || 'Error en login')
      }
    })
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Cargar datos desde localStorage al iniciar
  React.useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (e) {
        // Si hay error, limpiar datos corruptos
        logout()
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
