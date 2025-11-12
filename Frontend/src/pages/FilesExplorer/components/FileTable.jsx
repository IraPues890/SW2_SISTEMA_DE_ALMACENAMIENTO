import React from 'react';
import PaginationControls from './PaginationControls'; // <-- Componente reutilizable
import { FileRow } from './FileRow'; // <-- Componente reutilizable
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
            {pageItems.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                isSelected={selectedFile?.id === file.id}
                isChecked={selectedFileIds.includes(file.id)}
                onToggleSelection={handleToggleSelection}
                onPreview={openSidePreview}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <PaginationControls 
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        itemsLength={pageItems.length}
        totalLength={sortedFiltered.length}
      />
    </div>
  );
}