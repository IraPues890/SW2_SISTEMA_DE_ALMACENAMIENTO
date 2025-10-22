import React from 'react'

export function FileActions({ onCreateFolder, onUploadFile, onDownloadSelected, onDeleteSelected, controls = null }) {
  const actions = [
    { key: 'upload', icon: '📤', text: 'Subir archivo',     color: 'bg-gradient-to-r from-green-600 to-emerald-700', onClick: onUploadFile },
    { key: 'download', icon: '📥', text: 'Descargar archivo', color: 'bg-gradient-to-r from-blue-600 to-cyan-700', onClick: onDownloadSelected },
    { key: 'delete', icon: '🗑️', text: 'Eliminar archivo', color: 'bg-gradient-to-r from-red-600 to-rose-700', onClick: onDeleteSelected },
    { key: 'new-folder', icon: '➕', text: 'Crear carpeta',   color: 'bg-gradient-to-r from-yellow-600 to-orange-700', onClick: onCreateFolder },
    { key: 'organize', icon: '📂', text: 'Organizar carpetas', color: 'bg-gradient-to-r from-purple-600 to-indigo-700' }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-6 w-full max-w-full">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Acciones de Archivos</h3>
        {controls ? (
          <div className="flex items-center space-x-3">
            {controls}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => { if (typeof action.onClick === 'function') action.onClick(); }}
            className={`${action.color} text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 w-full`}
            title={action.text}
          >
            <span className="hidden lg:inline text-sm">{action.text}</span>
            <span className="text-lg ml-3">{action.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
