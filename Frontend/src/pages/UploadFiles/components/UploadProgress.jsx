import React from 'react'

export default function UploadProgress({ progress }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Progreso de Carga
      </h2>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-700">Progreso</span>
          <span className="text-sm font-bold text-slate-800">{progress}%</span>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {progress > 0 && (
          <p className="text-xs text-slate-600 mt-2">
            {progress === 100 ? '¡Carga completada!' : 'Subiendo archivo...'}
          </p>
        )}
      </div>
    </div>
  )
}
