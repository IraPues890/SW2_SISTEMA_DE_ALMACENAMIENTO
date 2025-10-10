import React from 'react'

export function FileActions({ onCreateFolder, onUploadFile, onDownloadSelected }) {
  const actions = [
    { key: 'upload', icon: '📤', text: 'Subir archivo',     color: 'bg-gradient-to-r from-green-600 to-emerald-700', onClick: onUploadFile },
    { key: 'download', icon: '📥', text: 'Descargar archivo', color: 'bg-gradient-to-r from-blue-600 to-cyan-700', onClick: onDownloadSelected },
    { key: 'new-folder', icon: '➕', text: 'Crear carpeta',   color: 'bg-gradient-to-r from-yellow-600 to-orange-700', onClick: onCreateFolder },
    { key: 'organize', icon: '📂', text: 'Organizar carpetas', color: 'bg-gradient-to-r from-purple-600 to-indigo-700' }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Acciones de Archivos</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={action.onClick ?? (() => {})}
            className={`${action.color} text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2`}
            title={action.text}
          >
            <span className="text-lg">{action.icon}</span>
            <span className="hidden lg:inline text-sm">{action.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
