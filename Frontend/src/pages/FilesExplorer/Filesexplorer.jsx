import { useState } from 'react';

// S: Componente para la cabecera de usuario
function UserHeader({ name, role, type }) {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">📁</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{name}</h1>
              <p className="text-blue-200 text-sm">{role} • {type}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white text-sm">Explorador de Archivos</p>
            <p className="text-blue-300 text-xs">Sistema UlStorage</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// S: Componente para cambiar la vista
function ViewSwitch({ views, activeView, onChange }) {
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
  );
}

// S: Componente para acciones de archivos
function FileActions() {
  const actions = [
    { icon: '📤', text: 'Subir archivo', color: 'from-green-600 to-emerald-700' },
    { icon: '📥', text: 'Descargar archivo', color: 'from-blue-600 to-cyan-700' },
    { icon: '➕', text: 'Crear carpeta', color: 'from-yellow-600 to-orange-700' },
    { icon: '📂', text: 'Organizar en carpetas', color: 'from-purple-600 to-indigo-700' }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">Acciones de Archivos</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`bg-gradient-to-r ${action.color} text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-[0.98] flex items-center justify-center space-x-2`}
            title={action.text}
          >
            <span className="text-lg">{action.icon}</span>
            <span className="hidden sm:inline text-sm">{action.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// S: Componente para métricas
function Metrics({ totalFiles, usedSpace, breadcrumb }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total de archivos</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{totalFiles}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">📁</span>
          </div>
        </div>
      </div>
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Espacio utilizado</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{usedSpace}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">💾</span>
          </div>
        </div>
      </div>
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Ubicación actual</p>
            <p className="text-lg font-bold text-slate-800 mt-1 break-all">{breadcrumb}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">📍</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// S: Componente para mostrar la vista activa
function ViewContent({ activeView }) {
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

// O: Permite extensión por props
const VIEWS = [
  { key: 'table', label: 'Tabla', icon: '📋' },
  { key: 'large', label: 'Iconos grandes', icon: '🖼️' },
  { key: 'medium', label: 'Iconos medianos', icon: '🗂️' },
  { key: 'small', label: 'Iconos pequeños', icon: '🔹' },
];

function Filesexplorer() {
  const [activeView, setActiveView] = useState('table');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <UserHeader name="Pedro Vazques" role="Analista de datos" type="Usuario" />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <ViewSwitch views={VIEWS} activeView={activeView} onChange={setActiveView} />
        <FileActions />
        <Metrics totalFiles={12} usedSpace="1.2 GB" breadcrumb="Raíz > Proyectos > 2025" />
        <ViewContent activeView={activeView} />
      </main>
    </div>
  );
}

export default Filesexplorer;