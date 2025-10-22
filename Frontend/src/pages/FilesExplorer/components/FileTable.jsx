import React from 'react';

export default function FileTable({
  pageItems,
  selectedFile,
  selectedFileIds,
  handleToggleSelection,
  openSidePreview,
  setPage,
  page,
  totalPages,
  sortedFiltered,
}) {
  return (
    <div className="lg:col-span-2">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-200 bg-slate-50">
              <th className="py-4 px-4 text-center w-12" />
              <th className="py-4 px-4 text-left font-semibold text-slate-700">Nombre</th>
              <th className="py-4 px-4 text-left font-semibold text-slate-700">Tamaño (KB)</th>
              <th className="py-4 px-4 text-left font-semibold text-slate-700">Fecha</th>
              <th className="py-4 px-4 text-left font-semibold text-slate-700">Tipo</th>
              <th className="py-4 px-4 text-left font-semibold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((f) => (
              <tr key={f.id} className={`border-b border-slate-100 transition-colors ${selectedFile?.id === f.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                <td className="py-4 px-4 text-center">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" aria-label={`Seleccionar archivo ${f.name}`} checked={selectedFileIds.includes(f.id)} onChange={() => handleToggleSelection(f.id)} />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-lg">{f.type === 'folder' ? '📁' : f.type === 'xlsx' ? '📊' : f.type === 'csv' ? '📋' : f.type === 'png' ? '🖼️' : '📄'}</span>
                    </div>
                    <span onClick={() => openSidePreview(f)} className="font-medium text-slate-800 cursor-pointer hover:text-blue-600 transition-colors">{f.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-600 font-medium">{f.size}</td>
                <td className="py-4 px-4 text-slate-600">{f.date}</td>
                <td className="py-4 px-4"><span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase">{f.type}</span></td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button onClick={() => openSidePreview(f)} className="px-3 py-1.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200">{f.type === 'folder' ? 'Abrir' : 'Ver'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-slate-600 font-medium">Mostrando {pageItems.length} de {sortedFiltered.length} archivos</div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors">Anterior</button>
          <span className="text-sm font-medium text-slate-700">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors">Siguiente</button>
        </div>
      </div>
    </div>
  );
}
