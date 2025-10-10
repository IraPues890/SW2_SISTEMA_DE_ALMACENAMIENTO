import React from 'react'

export default function FileSelector({ selectedFile, onSelect }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <span className="mr-2">📂</span>
        Seleccionar Archivo
      </h2>
      
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">📁</span>
        </div>
        
        <button
          className="bg-gradient-to-r from-blue-600 to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-[0.98] shadow-lg hover:shadow-xl mb-4"
          onClick={() => document.getElementById('fileInput').click()}
        >
          📂 Seleccionar archivo
        </button>
        
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={e => onSelect(e.target.files[0])}
        />
        
        <p className="text-slate-600 text-sm">
          {selectedFile ? (
            <span className="text-green-600 font-medium">✓ {selectedFile.name}</span>
          ) : (
            'Ningún archivo seleccionado'
          )}
        </p>
      </div>
    </div>
  )
}
