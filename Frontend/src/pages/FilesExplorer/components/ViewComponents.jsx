import React from 'react'

export function ViewSwitch({ views, activeView, onChange }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <span className="text-slate-700 font-medium">Cambiar vista:</span>
        <div className="flex space-x-2">
          {views.map(view => (
            <button
              key={view.key}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeView === view.key 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-700 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              onClick={() => onChange(view.key)}
              title={view.label}
            >
              <span className="mr-2">{view.icon}</span>
              {view.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ViewContent({ activeView }) {
  const views = {
    table: (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📋</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Vista de Tabla</h3>
          <p className="text-slate-600">Los archivos se mostrarán en formato de tabla detallada</p>
        </div>
      </div>
    ),
    large: (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🖼️</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Iconos Grandes</h3>
          <p className="text-slate-600">Vista de iconos grandes para fácil identificación</p>
        </div>
      </div>
    ),
    medium: (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🗂️</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Iconos Medianos</h3>
          <p className="text-slate-600">Balance perfecto entre detalle y espacio</p>
        </div>
      </div>
    ),
    small: (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🔹</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Iconos Pequeños</h3>
          <p className="text-slate-600">Vista compacta para máxima eficiencia</p>
        </div>
      </div>
    ),
  };
  return <section className="space-y-6">{views[activeView]}</section>;
}
