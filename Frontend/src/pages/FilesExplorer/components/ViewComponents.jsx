import React from 'react';

export const VIEWS = [
  { key: 'table', label: 'Tabla', icon: '📋' },
  { key: 'large', label: 'Iconos grandes', icon: '🖼️' },
  { key: 'medium', label: 'Iconos medianos', icon: '🗂️' },
  { key: 'small', label: 'Iconos pequeños', icon: '🔹' },
];

const ICON_SIZES = {
  large:  { box: 'w-28 h-28', icon: 'text-6xl', name: 'text-base' },
  medium: { box: 'w-20 h-20', icon: 'text-4xl', name: 'text-sm' },
  small:  { box: 'w-14 h-14', icon: 'text-2xl', name: 'text-xs' },
};

function FileIcon({ file, size = 'medium', onOpen, selected, onToggleSelection }) {
  const sz = ICON_SIZES[size] ?? ICON_SIZES.medium;
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleSelection?.(file.id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => onOpen?.(file)}
        className={`group bg-white/95 border rounded-xl p-4 shadow hover:shadow-lg transition-all hover:-translate-y-0.5 text-left w-full ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'}`}
        title={file.name}
      >
        <div className={`mx-auto ${sz.box} rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow`}>
          <span className={`text-white ${sz.icon}`}>{file.type === 'xlsx' ? '📊' : file.type === 'csv' ? '📋' : file.type === 'png' ? '🖼️' : file.type === 'pptx' ? '📄': file.type === 'pdf' ? '📄' : '📁'}</span>
        </div>
        <div className="mt-3">
          <div className={`font-medium text-slate-800 line-clamp-2 ${sz.name}`}>{file.name}</div>
          <div className="text-slate-500 text-xs mt-1">{file.size} KB • {file.type.toUpperCase()}</div>
        </div>
      </button>
      <div className="absolute top-2 left-2 cursor-pointer" onClick={handleCheckboxClick}>
        <input type="checkbox" checked={selected} readOnly className={`pointer-events-none rounded border-slate-400 bg-white/50 text-blue-600 focus:ring-blue-500 ${size === 'large' ? 'h-5 w-5' : size === 'medium' ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} aria-label={`Seleccionar archivo ${file.name}`} />
      </div>
    </div>
  );
}

function IconGrid({ files, viewSize, onOpen, selectedFileIds, onToggleSelection }) {
  const cols = viewSize === 'large' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : viewSize === 'medium' ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8' : 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10';
  return (
    <div className={`grid ${cols} gap-5`}>
      {files.map(f => <FileIcon key={f.id} file={f} size={viewSize} onOpen={onOpen} selected={selectedFileIds.includes(f.id)} onToggleSelection={onToggleSelection} />)}
    </div>
  );
}

export function ViewSwitch({ activeView, onChange }) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <span className="text-slate-700 font-semibold text-lg">Cambiar vista:</span>
        <div className="flex space-x-3">
          {VIEWS.map(view => (
            <button key={view.key} className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeView === view.key ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'}`} onClick={() => onChange(view.key)} title={view.label}>
              <span className="text-lg">{view.icon}</span>
              <span className="hidden sm:inline">{view.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ViewContent({ activeView, files, onOpen, selectedFileIds, onToggleSelection }) {
  if (activeView === 'table') return null;
  const size = activeView === 'large' ? 'large' : activeView === 'small' ? 'small' : 'medium';
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
      <IconGrid files={files} viewSize={size} onOpen={onOpen} selectedFileIds={selectedFileIds} onToggleSelection={onToggleSelection} />
    </div>
  );
}
