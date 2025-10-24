import React from 'react';

export default function PaginationControls({ page, totalPages, setPage, itemsLength, totalLength }) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-slate-600 font-medium">Mostrando {itemsLength} de {totalLength} archivos</div>
      <div className="flex items-center space-x-3">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors">Anterior</button>
        <span className="text-sm font-medium text-slate-700">{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors">Siguiente</button>
      </div>
    </div>
  );
}