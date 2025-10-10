import React from 'react'

export default function FileActions() {
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
               style={{
                 background: `linear-gradient(90deg, ${action.color})`,
                 color: '#fff',
               }}
               className="font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-[0.98] flex items-center justify-center space-x-2"
               title={action.text}
             >
               <span className="text-lg">{action.icon}</span>
               <span className="hidden sm:inline text-sm">{action.text}</span>
             </button>
           ))}
         </div>
    </div>
  )
}
