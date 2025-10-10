import React, { createContext, useState } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  function login({ username, role, userId }) {
    // Login simple sin tokens - solo guardamos datos básicos del usuario
    const payload = { username, role, userId }
    setUser(payload)
    // Persistencia simple en localStorage
    try { localStorage.setItem('ulstorage_user', JSON.stringify(payload)) } catch (e) {}
  }

  function logout() {
    setUser(null)
    try { localStorage.removeItem('ulstorage_user') } catch (e) {}
  }

  // Hydrate desde localStorage (sincrónico y simple)
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('ulstorage_user')
      if (raw && !user) setUser(JSON.parse(raw))
    } catch (e) {}
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
