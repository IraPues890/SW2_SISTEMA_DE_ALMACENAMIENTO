import { useState, useEffect, useRef } from 'react';

export default function CreateFolderModal({ isOpen, onClose, onCreate, validateName }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = (e) => {
    e?.preventDefault?.();
    const msg = validateName ? validateName(name) : null;
    if (msg) {
      setError(msg);
      return;
    }
    onCreate(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="create-folder-title">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <form onSubmit={submit} className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white flex items-center justify-center shadow"><span className="text-2xl">➕</span></div>
            <div>
              <h3 id="create-folder-title" className="text-xl font-semibold text-slate-900">Crear carpeta</h3>
              <p className="text-slate-500 text-sm">Asigna un nombre y la añadiremos a la ubicación actual.</p>
            </div>
          </div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la carpeta</label>
          <input ref={inputRef} value={name} onChange={(e) => setName(e.target.value)} placeholder="p. ej., Reportes 2025" className={`w-full px-4 py-2 rounded-lg border ${error ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'} focus:border-transparent outline-none`} />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-yellow-600 to-orange-700 shadow hover:shadow-lg transition-all">Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
}
