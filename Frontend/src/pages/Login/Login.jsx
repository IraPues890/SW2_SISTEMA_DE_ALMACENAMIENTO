import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de autenticación: rol por nombre de usuario (solo demo)
    const role = username.toLowerCase().includes('admin') ? 'Administrador' : 'Usuario'
    login({ username, role })
    // Redirigir según rol
    if (role === 'Administrador') navigate('/admin')
    else navigate('/user')
  };

  const handleLogoClick = (e) => {
    // Efecto de pulso en el elemento
    e.currentTarget.style.animation = 'pulse 0.3s ease-in-out';
    setTimeout(() => {
      e.currentTarget.style.animation = '';
    }, 300);
    
    // Mostrar popup con confeti
    setShowPopup(true);
    setShowConfetti(true);
    
    // Quitar confeti después de 3 segundos
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  // Quick/demo helpers
  const handleQuickAdmin = () => {
    login({ username: 'admin_demo', role: 'Administrador' })
    navigate('/admin')
  }

  const handleQuickUser = () => {
    login({ username: 'user_demo', role: 'Usuario' })
    navigate('/user')
  }

  const handleQuickPreview = () => {
    const demoFile = {
      name: 'informe2025.pdf',
      type: 'pdf',
      size: '2300',
      modified: '30/09/2025 14:32',
      previewable: true,
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    }
    login({ username: 'preview_demo', role: 'Usuario' })
    navigate('/preview', { state: { file: demoFile } })
  }

  const closePopup = () => {
    setShowPopup(false);
    setShowConfetti(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative">
      {/* Overlay pattern para textura empresarial */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]"></div>
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-slate-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-lg mx-4">
        {/* Header empresarial */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-slate-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 
              className="text-3xl font-bold text-white tracking-tight cursor-pointer hover:text-blue-300 hover:scale-105 active:scale-95 transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] select-none"
              onClick={handleLogoClick}
              title="🎉 ¡ZAPEROKO LA LEYENDA! - ¡Haz clic!"
              style={{
                textShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
              }}
            >
              UlStorage
            </h1>
          </div>
          <p className="text-slate-300 text-sm font-medium">
            Sistema Empresarial de Almacenamiento en la Nube
          </p>
        </div>

        {/* Card de login */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              Acceso al Sistema
            </h2>
            <p className="text-slate-600 text-sm">
              Ingrese sus credenciales corporativas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Usuario Corporativo
              </label>
              <input
                type="text"
                placeholder="usuario@empresa.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base outline-none bg-white text-slate-800 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base outline-none bg-white text-slate-800 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400"
                autoComplete="current-password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-slate-700 text-white font-semibold text-base rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Acceder al Sistema
            </button>
          </form>

          {/* Quick access buttons for demo/testing */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button onClick={handleQuickAdmin} className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg">Entrar como Admin</button>
            <button onClick={handleQuickUser} className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg">Entrar como Usuario</button>
            <button onClick={handleQuickPreview} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg">Preview demo</button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center text-xs text-slate-500 space-x-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Conexión Segura
              </span>
              <span>•</span>
              <span>OCI • AWS • GCP</span>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP ÉPICO CON CONFETI */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          {/* Confeti animado */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 2}s`,
                    fontSize: `${20 + Math.random() * 20}px`,
                  }}
                >
                  {['🎉', '🎊', '⭐', '✨', '🌟', '💫', '🎈', '🎆'][Math.floor(Math.random() * 8)]}
                </div>
              ))}
            </div>
          )}
          
          {/* Popup principal */}
          <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-2xl shadow-2xl border-4 border-yellow-300 p-8 max-w-2xl mx-4 animate-pulse">
            {/* Botón cerrar */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold transition-colors"
            >
              ×
            </button>
            
            {/* Texto épico */}
            <div className="text-center mb-6">
              <h2 className="text-6xl font-black text-white mb-4 animate-bounce" style={{
                textShadow: '4px 4px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000',
                fontFamily: 'Impact, Arial Black, sans-serif'
              }}>
                🎉 ZAPEROKO 🎉
              </h2>
              <h3 className="text-4xl font-bold text-yellow-100 animate-pulse" style={{
                textShadow: '2px 2px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000'
              }}>
                ⚡ LA LEYENDA ⚡
              </h3>
            </div>
            
            {/* Imagen */}
            <div className="bg-white p-2 rounded-xl shadow-2xl">
              <img
                src="/images/LEYENDAS.jpg"
                alt="ZAPEROKO LA LEYENDA"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/800x400?text=LEYENDAS' }}
                className="w-full h-auto rounded-lg max-h-96 object-contain"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))'
                }}
              />
            </div>
            
            {/* Texto adicional épico */}
            <div className="text-center mt-6">
              <p className="text-2xl font-bold text-yellow-100 animate-bounce" style={{
                textShadow: '2px 2px 0px #000'
              }}>
                🏆 ¡EL MISMÍSIMO! 🏆
              </p>
              <div className="flex justify-center space-x-4 mt-4 text-3xl animate-spin">
                <span>🎊</span>
                <span>🎉</span>
                <span>🎊</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
