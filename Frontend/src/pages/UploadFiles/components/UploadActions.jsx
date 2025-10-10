import React from 'react'

export default function UploadActions({ onUpload, onCancel, disabled }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
      <div className="flex space-x-4">
        <button
          className={`flex-1 px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 active:scale-[0.98] shadow-lg hover:shadow-xl ${
            disabled 
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-700 hover:to-emerald-800 focus:ring-green-500/50'
          }`}
          disabled={disabled}
          onClick={onUpload}
        >
          ✅ Subir archivo
        </button>
        
        <button
          className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 hover:from-red-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 active:scale-[0.98] shadow-lg hover:shadow-xl"
          onClick={onCancel}
        >
          ❌ Cancelar
        </button>
      </div>
    </div>
  )
}
