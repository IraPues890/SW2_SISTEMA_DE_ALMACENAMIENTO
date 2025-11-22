import React, { useState } from 'react';
import ShareModal from './ShareModal';

const FileIcon = ({ type }) => {
  let icon = '📄'; 
  if (type === 'folder') icon = '📁';
  else if (type === 'xlsx') icon = '📊';
  else if (type === 'csv') icon = '📋';
  else if (type === 'png') icon = '🖼️';

  return (
    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
      <span className="text-white text-lg">{icon}</span>
    </div>
  );
};


// Tu nuevo componente de Fila
export const FileRow = ({ file, isSelected, isChecked, onToggleSelection, onPreview }) => {
  const [openShare, setOpenShare] = useState(false);
  
  // Clases dinámicas para la fila
  const rowClasses = [
    'border-b',
    'border-slate-100',
    'transition-colors',
    isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
  ].join(' ');

  return (
    <tr className={rowClasses}>
      <td className="py-4 px-4 text-center">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          aria-label={`Seleccionar archivo ${file.name}`}
          checked={isChecked}
          onChange={() => onToggleSelection(file.id)}
        />
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center space-x-3">
          <FileIcon type={file.type} />
          <span
            onClick={() => onPreview(file)}
            className="font-medium text-slate-800 cursor-pointer hover:text-blue-600 transition-colors"
          >
            {file.name}
          </span>
        </div>
      </td>
      <td className="py-4 px-4 text-slate-600 font-medium">{file.size}</td>
      <td className="py-4 px-4 text-slate-600">{file.date}</td>
      <td className="py-4 px-4 text-slate-600">{file.cloud}</td>
      <td className="py-4 px-4">
        <div className="flex space-x-2">
          <button
            onClick={() => onPreview(file)} // Usamos la prop
            className="px-3 py-1.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            {file.type === 'folder' ? 'Abrir' : 'Ver'}
          </button>
          {file.type === 'folder' && (
            <button
              onClick={() => setOpenShare(true)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Compartir
            </button>
          )}
        </div>
        <ShareModal folderId={file.id} open={openShare} onClose={() => setOpenShare(false)} />
      </td>
    </tr>
  );
};