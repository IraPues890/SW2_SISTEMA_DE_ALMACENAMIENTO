import React from 'react'

export default function UserHeader({ name, role, type }) {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="w-full px-4 lg:px-6 py-4">
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
  )
}
