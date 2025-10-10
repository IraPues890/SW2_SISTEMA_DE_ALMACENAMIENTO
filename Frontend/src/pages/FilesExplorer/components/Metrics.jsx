import React from 'react'

export default function Metrics({ totalFiles, usedSpace, breadcrumb }) {
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
  )
}
