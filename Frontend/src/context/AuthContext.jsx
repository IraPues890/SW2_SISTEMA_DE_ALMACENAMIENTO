import React, { createContext, useState } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  function login({ username, role }) {
    // En una implementación real, aquí harías POST al backend para autenticar
    // y guardar token. Ahora simulamos el login localmente.
    const payload = { username, role }
    setUser(payload)
    // Persistencia simple
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
