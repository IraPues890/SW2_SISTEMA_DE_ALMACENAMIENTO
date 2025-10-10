import React from 'react'

export default function UploadOptions({ destFolder, onFolderChange, overwrite, onOverwriteChange }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
        <span className="mr-2">⚙️</span>
        Opciones de Carga
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Carpeta destino:
          </label>
          <select
            value={destFolder}
            onChange={e => onFolderChange(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base outline-none bg-white text-slate-800 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400"
          >
            <option>Raíz &gt; Proyectos</option>
            <option>Raíz &gt; Documentos</option>
            <option>Raíz &gt; Imágenes</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="overwrite"
            checked={overwrite}
            onChange={e => onOverwriteChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="overwrite" className="text-sm font-medium text-slate-700">
            Sobrescribir si ya existe
          </label>
        </div>
      </div>
    </div>
  )
}
