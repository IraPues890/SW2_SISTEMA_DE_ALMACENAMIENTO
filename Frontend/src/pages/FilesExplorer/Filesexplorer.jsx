import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'

// helper: parsear fechas en formato DD/MM/YYYY de forma segura
function parseDMY(dateStr) {
  if (!dateStr) return new Date(0);
  const parts = String(dateStr).split('/');
  if (parts.length !== 3) return new Date(dateStr);
  const [d, m, y] = parts.map(n => Number(n));
  return new Date(y, (m || 1) - 1, d || 1);
}

// Componente para la cabecera de usuario
function UserHeader({ name, role, type }) {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">📁</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{name}</h1>
              <p className="text-blue-200 text-sm">{role} • {type}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white text-sm">Explorador de Archivos</p>
            <p className="text-blue-300 text-xs">Sistema UlStorage</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// Componente para cambiar la vista
function ViewSwitch({ views, activeView, onChange }) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <span className="text-slate-700 font-semibold text-lg">Cambiar vista:</span>
        <div className="flex space-x-3">
          {views.map(view => (
            <button
              key={view.key}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeView === view.key
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
              }`}
              onClick={() => onChange(view.key)}
              title={view.label}
            >
              <span className="text-lg">{view.icon}</span>
              <span className="hidden sm:inline">{view.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente para acciones de archivos
function FileActions({ onCreateFolder }) {
  const actions = [
    { key: 'upload', icon: '📤', text: 'Subir archivo',     color: 'bg-gradient-to-r from-green-600 to-emerald-700' },
    { key: 'download', icon: '📥', text: 'Descargar archivo', color: 'bg-gradient-to-r from-blue-600 to-cyan-700' },
    { key: 'new-folder', icon: '➕', text: 'Crear carpeta',   color: 'bg-gradient-to-r from-yellow-600 to-orange-700', onClick: onCreateFolder },
    { key: 'organize', icon: '📂', text: 'Organizar carpetas', color: 'bg-gradient-to-r from-purple-600 to-indigo-700' }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Acciones de Archivos</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={action.onClick ?? (() => {})}
            className={`${action.color} text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2`}
            title={action.text}
          >
            <span className="text-lg">{action.icon}</span>
            <span className="hidden lg:inline text-sm">{action.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Componente para métricas
function Metrics({ totalFiles, usedSpace, breadcrumb }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total de archivos</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">{totalFiles}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📁</span>
          </div>
        </div>
      </div>
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Espacio utilizado</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">{usedSpace}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">💾</span>
          </div>
        </div>
      </div>
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-4">
            <p className="text-slate-600 text-sm font-medium">Ubicación actual</p>
            <p className="text-lg font-bold text-slate-800 mt-2 break-all">{breadcrumb}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📍</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// S: Componente para mostrar la vista activa
function ViewContent({ activeView, files, onOpen }) {
  if (activeView === 'table') return null;

  const size =
    activeView === 'large' ? 'large' :
    activeView === 'small' ? 'small' :
    'medium';

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
      <IconGrid files={files} viewSize={size} onOpen={onOpen} />
    </div>
  );
}

// Constantes
const VIEWS = [
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

// Tamaño de íconos
function FileIcon({ file, size = 'medium', onOpen }) {
  const sz = ICON_SIZES[size] ?? ICON_SIZES.medium;
  return (
    <button
      onClick={() => onOpen?.(file)}
      className="group bg-white/95 border border-white/20 rounded-xl p-4 shadow hover:shadow-lg transition-all hover:-translate-y-0.5 text-left"
      title={file.name}
    >
      <div className={`mx-auto ${sz.box} rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow`}>
        <span className={`text-white ${sz.icon}`}>
          {file.type === 'xlsx' ? '📊' : file.type === 'csv' ? '📋' : file.type === 'png' ? '🖼️' : file.type === 'pptx' ? '📄': file.type === 'pdf' ? '📄' : '📁'}
        </span>
      </div>
      <div className="mt-3">
        <div className={`font-medium text-slate-800 line-clamp-2 ${sz.name}`}>{file.name}</div>
        <div className="text-slate-500 text-xs mt-1">{file.size} KB • {file.type.toUpperCase()}</div>
      </div>
    </button>
  );
}

function IconGrid({ files, viewSize, onOpen }) {
  const cols =
    viewSize === 'large'
      ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      : viewSize === 'medium'
      ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'
      : viewSize === 'small'
      ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10'
      : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8';

  return (
    <div className={`grid ${cols} gap-5`}>
      {files.map(f => (
        <FileIcon key={f.id} file={f} size={viewSize} onOpen={onOpen} />
      ))}
    </div>
  );
}

function CreateFolderModal({ isOpen, onClose, onCreate, validateName }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
      // focus al abrir
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

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="fixed inset-0 z-50" onKeyDown={onKeyDown} role="dialog" aria-modal="true" aria-labelledby="create-folder-title">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

      {/* Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <form
          onSubmit={submit}
          className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white flex items-center justify-center shadow">
              <span className="text-2xl">➕</span>
            </div>
            <div>
              <h3 id="create-folder-title" className="text-xl font-semibold text-slate-900">Crear carpeta</h3>
              <p className="text-slate-500 text-sm">Asigna un nombre y la añadiremos a la ubicación actual.</p>
            </div>
          </div>

          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la carpeta</label>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="p. ej., Reportes 2025"
            className={`w-full px-4 py-2 rounded-lg border ${
              error ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
            } focus:border-transparent outline-none`}
          />

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-yellow-600 to-orange-700 shadow hover:shadow-lg transition-all"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function Filesexplorer() {
  const [activeView, setActiveView] = useState('table');
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState(null)

  // current folder (null = root)
  const [currentFolderId, setCurrentFolderId] = useState(null)
  // ordenamiento
  const [sortOption, setSortOption] = useState('name-asc') // opciones: name-asc, name-desc, date-asc, date-desc, size-asc, size-desc

  // Datos de ejemplo (en producción vendrían del backend)
  const [files, setFiles] = useState([
    { id: '1', name: 'informe2025.pdf', size: '2300', date: '30/09/2025', type: 'pdf', parentId: null },
    { id: '2', name: 'reporte_ventas.xlsx', size: '1200', date: '29/09/2025', type: 'xlsx', parentId: null },
    { id: '3', name: 'datos_clientes.csv', size: '800', date: '28/09/2025', type: 'csv', parentId: null },
    { id: '4', name: 'grafico_anual.png', size: '500', date: '27/09/2025', type: 'png', parentId: null },
    { id: '5', name: 'presentacion.pptx', size: '4500', date: '25/09/2025', type: 'pptx', parentId: null },
  ])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 5
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const demoPdf = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'

  // Filtrado por carpeta actual + búsqueda
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let items = files.filter(f => (f.parentId ?? null) === currentFolderId)
    if (!q) return items
    return items.filter(f => f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q))
  }, [files, query, currentFolderId])

  // Ordenar el resultado filtrado (se aplica antes de paginar)
  const sortedFiltered = useMemo(() => {
    const items = [...(filtered ?? [])];
    if (!items.length) return items;

    const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

    switch (sortOption) {
      case 'name-asc':
        items.sort((a, b) => collator.compare(String(a.name), String(b.name)));
        break;
      case 'name-desc':
        items.sort((a, b) => collator.compare(String(b.name), String(a.name)));
        break;
      case 'date-asc':
        items.sort((a, b) => parseDMY(a.date) - parseDMY(b.date));
        break;
      case 'date-desc':
        items.sort((a, b) => parseDMY(b.date) - parseDMY(a.date));
        break;
      case 'size-asc':
        items.sort((a, b) => Number(a.size) - Number(b.size));
        break;
      case 'size-desc':
        items.sort((a, b) => Number(b.size) - Number(a.size));
        break;
      default:
        break;
    }
    return items;
  }, [filtered, sortOption]);

  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / perPage))
  const pageItems = sortedFiltered.slice((page - 1) * perPage, page * perPage)

  // Construir breadcrumb (lista de nodos desde root hasta current)
  const breadcrumbNodes = useMemo(() => {
    const nodes = [];
    let id = currentFolderId;
    while (id != null) {
      const node = files.find(f => f.id === id);
      if (!node) break;
      nodes.push(node);
      id = node.parentId ?? null;
    }
    return nodes.reverse();
  }, [currentFolderId, files]);

  const breadcrumbString = useMemo(() => {
    if (!breadcrumbNodes.length) return 'Raíz';
    return 'Raíz > ' + breadcrumbNodes.map(n => n.name).join(' > ');
  }, [breadcrumbNodes]);

  // Entrar a carpeta
  function enterFolder(folder) {
    setCurrentFolderId(folder.id)
    setSelectedFile(null)
    setSelectedPreviewUrl(null)
    setPage(1)
  }

  // Subir nivel (clic en breadcrumb)
  function goToFolderId(id) {
    setCurrentFolderId(id ?? null)
    setSelectedFile(null)
    setSelectedPreviewUrl(null)
    setPage(1)
  }

  function openSidePreview(f) {
    if (!f) return
    if (f.type === 'folder') {
      enterFolder(f)
      return;
    }
    setSelectedFile(f);
    setSelectedPreviewUrl(f.url ?? demoPdf);
  }

  function closeSidePreview() {
    setSelectedFile(null)
    setSelectedPreviewUrl(null)
  }

  function handleCreateFolder() {
    setIsCreateOpen(true);
  }

  function validateFolderName(raw) {
    const name = (raw || '').trim();
    if (!name) return 'Escribe un nombre.';
    if (!/^[\w\-\s]{1,64}$/.test(name)) return 'Usa letras, números, espacios o guiones (máx. 64).';
    const dup = files.some(
      (f) => (f.type === 'folder') && (f.name.toLowerCase() === name.toLowerCase()) && ((f.parentId ?? null) === currentFolderId)
    );
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
    setFiles((prev) => [newFolder, ...prev]);
    // entrar a la carpeta nueva y seleccionarla
    setCurrentFolderId(newFolder.id);
    setSelectedFile(newFolder);
    setSelectedPreviewUrl(null);
    setIsCreateOpen(false);
    setPage(1);
  }

  // select first file by default when the files or current folder change (if any)
  useEffect(() => {
    if (!selectedFile && filtered && filtered.length > 0) {
      // preferir el primer archivo que NO sea carpeta, para no "entrar" automáticamente en carpetas
      const firstNonFolder = filtered.find(item => item.type !== 'folder');
      if (firstNonFolder) {
        openSidePreview(firstNonFolder);
      }
    }
  }, [filtered, selectedFile]);

  // ajustar la página si la paginación queda fuera de rango tras filtrar/ordenar
  useEffect(() => {
    const total = Math.max(1, Math.ceil(sortedFiltered.length / perPage));
    if (page > total) setPage(total);
  }, [sortedFiltered, page, perPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
      <UserHeader name="Pedro Vazques" role="Analista de datos" type="Usuario" />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Metrics totalFiles={files.length} usedSpace={'1.2 GB'} breadcrumb={breadcrumbString} />
        <ViewSwitch views={VIEWS} activeView={activeView} onChange={setActiveView} />
        <FileActions onCreateFolder={handleCreateFolder} />

        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              {/* Breadcrumb simple y navegable */}
              <div className="text-sm text-slate-600 mb-2">
                <button onClick={() => goToFolderId(null)} className="text-blue-600 font-medium hover:underline">Raíz</button>
                {breadcrumbNodes.map((node, idx) => (
                  <span key={node.id}>
                    <span className="mx-2">/</span>
                    <button
                      onClick={() => goToFolderId(node.id)}
                      className="text-slate-700 hover:underline"
                    >
                      {node.name}
                    </button>
                  </span>
                ))}
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Archivos</h2>
            </div>

            <div className="flex items-center space-x-3">
              <input 
                value={query} 
                onChange={e => { setQuery(e.target.value); setPage(1); }} 
                placeholder="Buscar archivos..." 
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
              />

              <select
                value={sortOption}
                onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
                className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                aria-label="Ordenar archivos"
              >
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
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase">{f.type}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              {f.type !== 'folder' && (
                                <button
                                  onClick={() => {
                                    const content = `Archivo: ${f.name}`;
                                    const blob = new Blob([content], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = f.name;
                                    document.body.appendChild(a);
                                    a.click();
                                    a.remove();
                                    URL.revokeObjectURL(url);
                                  }}
                                  className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                                >
                                  📥 Descargar
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  if (f.type === 'folder') {
                                    enterFolder(f);
                                  } else {
                                    navigate('/preview', { state: { file: f, previewUrl: f.url ?? demoPdf } });
                                  }
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                              >
                                {f.type === 'folder' ? 'Abrir' : 'Ver'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-slate-600 font-medium">
                    Mostrando {pageItems.length} de {sortedFiltered.length} archivos
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p-1))} 
                      disabled={page === 1} 
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
                    >
                      Anterior
                    </button>
                    <span className="text-sm font-medium text-slate-700">{page} / {totalPages}</span>
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p+1))} 
                      disabled={page === totalPages} 
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
                    >
                      Siguiente
                    </button>
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
                        <button 
                          onClick={closeSidePreview} 
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="mb-4">
                        <div className="bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200" style={{height: 300}}>
                          {selectedFile.type === 'folder' ? (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              Esta es una carpeta. (Sin vista previa)
                            </div>
                          ) : (
                            <iframe
                              src={selectedPreviewUrl && (selectedPreviewUrl.endsWith('.pdf') ? `https://docs.google.com/gview?url=${encodeURIComponent(selectedPreviewUrl)}&embedded=true` : selectedPreviewUrl)}
                              title={`Preview ${selectedFile.name}`}
                              className="w-full h-full border-0"
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        {selectedFile.type !== 'folder' && (
                          <button 
                            onClick={() => {
                              const content = `Descarga: ${selectedFile.name}`
                              const blob = new Blob([content], { type: 'text/plain' })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = selectedFile.name
                              document.body.appendChild(a)
                              a.click()
                              a.remove()
                              URL.revokeObjectURL(url)
                            }} 
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            📥 Descargar archivo
                          </button>
                        )}

                        <button 
                          onClick={() => window.print()} 
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          🖨️ Imprimir
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-600 py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white shadow-lg">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <h4 className="font-semibold mb-2 text-slate-800">Selecciona un archivo</h4>
                      <p className="text-sm">La vista previa aparecerá aquí</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <ViewContent
              activeView={activeView}
              files={sortedFiltered}
              onOpen={openSidePreview} 
            />
          )}
        </div>
      </div>
      <CreateFolderModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleConfirmCreateFolder}
        validateName={validateFolderName}
      />
    </div>
  );
}

export default Filesexplorer;