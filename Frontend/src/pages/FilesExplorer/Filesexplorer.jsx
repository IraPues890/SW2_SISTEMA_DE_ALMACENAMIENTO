import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFiles } from './hooks/useFiles';
import { UserHeader } from './components/UserHeader';
import { Metrics } from './components/Metrics';
import { FileActions } from './components/FileActions';
import { ViewSwitch, ViewContent, VIEWS } from './components/ViewComponents';

// Mover CreateFolderModal a su propio archivo también sería una buena práctica.
function CreateFolderModal({ isOpen, onClose, onCreate, validateName }) {
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

function Filesexplorer() {
  const navigate = useNavigate();
  const {
    files, addFile, query, setQuery, sortOption, setSortOption,
    currentFolderId, setCurrentFolderId, page, setPage,
    pageItems, totalPages, sortedFiltered, breadcrumbNodes, breadcrumbString
  } = useFiles();

  const [activeView, setActiveView] = useState('table');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState(null);
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const demoPdf = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

  const handleToggleSelection = (fileId) => {
    setSelectedFileIds((prev) => prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]);
  };

  const areAllOnPageSelected = useMemo(() => {
    const currentPageIds = pageItems.map((f) => f.id);
    return currentPageIds.length > 0 && currentPageIds.every((id) => selectedFileIds.includes(id));
  }, [pageItems, selectedFileIds]);

  function enterFolder(folder) {
    setCurrentFolderId(folder.id);
    resetSelectionAndPage();
  }

  function goToFolderId(id) {
    setCurrentFolderId(id ?? null);
    resetSelectionAndPage();
  }
  
  function resetSelectionAndPage() {
    setSelectedFile(null);
    setSelectedPreviewUrl(null);
    setPage(1);
    setSelectedFileIds([]);
  }

  function openSidePreview(f) {
    if (!f) return;
    if (f.type === 'folder') {
      enterFolder(f);
      return;
    }
    setSelectedFile(f);
    setSelectedPreviewUrl(f.url ?? demoPdf);
  }

  function handleDownloadSelected(fileIds) {
    const idsToDownload = Array.isArray(fileIds) ? fileIds : selectedFileIds;
    if (!idsToDownload || idsToDownload.length === 0) {
      alert('Seleccionar al menos un archivo');
      return;
    }
    idsToDownload.forEach(fileId => {
      const fileToDownload = files.find(f => f.id === fileId);
      if (fileToDownload && fileToDownload.type !== 'folder') {
        const content = `Archivo: ${fileToDownload.name}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileToDownload.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    });
  }

  function validateFolderName(raw) {
    const name = (raw || '').trim();
    if (!name) return 'Escribe un nombre.';
    if (!/^[\w\-\s]{1,64}$/.test(name)) return 'Usa letras, números, espacios o guiones (máx. 64).';
    const dup = files.some((f) => (f.type === 'folder') && (f.name.toLowerCase() === name.toLowerCase()) && ((f.parentId ?? null) === currentFolderId));
    if (dup) return 'Ya existe una carpeta con ese nombre en esta ubicación.';
    return null;
  }

  function handleConfirmCreateFolder(name) {
    const newFolder = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name,
      size: '0',
      date: new Date().toLocaleDateString('es-PE'),
      type: 'folder',
      parentId: currentFolderId ?? null,
    };
    addFile(newFolder);
    setCurrentFolderId(newFolder.id);
    setSelectedFile(newFolder);
    setIsCreateOpen(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
      <UserHeader name="Pedro Vazques" role="Analista de datos" type="Usuario" />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Metrics totalFiles={files.length} usedSpace={'1.2 GB'} breadcrumb={breadcrumbString} />
        <ViewSwitch views={VIEWS} activeView={activeView} onChange={setActiveView} />
        <FileActions onCreateFolder={() => setIsCreateOpen(true)} onUploadFile={() => navigate('/upload')} onDownloadSelected={handleDownloadSelected} />

        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-slate-600 mb-2">
                <button onClick={() => goToFolderId(null)} className="text-blue-600 font-medium hover:underline">Raíz</button>
                {breadcrumbNodes.map((node) => (
                  <span key={node.id}>
                    <span className="mx-2">/</span>
                    <button onClick={() => goToFolderId(node.id)} className="text-slate-700 hover:underline">{node.name}</button>
                  </span>
                ))}
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Archivos</h2>
            </div>
            <div className="flex items-center space-x-3">
              <input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Buscar archivos..." className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              <select value={sortOption} onChange={(e) => { setSortOption(e.target.value); setPage(1); }} className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm" aria-label="Ordenar archivos">
                <option value="name-asc">Nombre A → Z</option>
                <option value="name-desc">Nombre Z → A</option>
                <option value="date-desc">Fecha (más reciente)</option>
                <option value="date-asc">Fecha (más antigua)</option>
                <option value="size-desc">Tamaño (mayor)</option>
                <option value="size-asc">Tamaño (menor)</option>
              </select>
            </div>
          </div>

          {activeView === 'table' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200 bg-slate-50">
                        <th className="py-4 px-4 text-center w-12"/>
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
              <div className="lg:col-span-1">
                <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
                  {selectedFile ? (
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">{selectedFile.name}</h3>
                          <div className="text-sm text-slate-600 mt-1">{selectedFile.type.toUpperCase()} • {selectedFile.size} KB</div>
                        </div>
                        <button onClick={() => setSelectedFile(null)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors">✕</button>
                      </div>
                      <div className="mb-4">
                        <div className="bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200" style={{height: 300}}>
                          {selectedFile.type === 'folder' ? (<div className="w-full h-full flex items-center justify-center text-slate-500">Esta es una carpeta. (Sin vista previa)</div>) : (<iframe src={selectedPreviewUrl && (selectedPreviewUrl.endsWith('.pdf') ? `https://docs.google.com/gview?url=${encodeURIComponent(selectedPreviewUrl)}&embedded=true` : selectedPreviewUrl)} title={`Preview ${selectedFile.name}`} className="w-full h-full border-0" />)}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {selectedFile.type !== 'folder' && (<button onClick={() => handleDownloadSelected([selectedFile.id])} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200">📥 Descargar archivo</button>)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-600 py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white shadow-lg"><span className="text-2xl">🔍</span></div>
                      <h4 className="font-semibold mb-2 text-slate-800">Selecciona un archivo</h4>
                      <p className="text-sm">La vista previa aparecerá aquí</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <ViewContent activeView={activeView} files={sortedFiltered} onOpen={openSidePreview} selectedFileIds={selectedFileIds} onToggleSelection={handleToggleSelection} />
          )}
        </div>
      </div>
      <CreateFolderModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreate={handleConfirmCreateFolder} validateName={validateFolderName} />
    </div>
  );
}

export default Filesexplorer;