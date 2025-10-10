import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

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
function FileActions() {
  const actions = [
    { icon: '📤', text: 'Subir archivo', color: 'bg-gradient-to-r from-green-600 to-emerald-700' },
    { icon: '📥', text: 'Descargar archivo', color: 'bg-gradient-to-r from-blue-600 to-cyan-700' },
    { icon: '➕', text: 'Crear carpeta', color: 'bg-gradient-to-r from-yellow-600 to-orange-700' },
    { icon: '📂', text: 'Organizar carpetas', color: 'bg-gradient-to-r from-purple-600 to-indigo-700' }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Acciones de Archivos</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
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


// O: Permite extensión por props
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
// Ícono según tipo
function FileEmoji({ type }) {
  const map = { xlsx: '📊', csv: '📋', png: '🖼️', pdf: '📄', pptx: '📄' };
  return <span>{map[type] ?? '📄'}</span>;
}

// Nuevo por MAU
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
          {file.type === 'xlsx' ? '📊' : file.type === 'csv' ? '📋' : file.type === 'png' ? '🖼️' : '📄'}
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


function Filesexplorer() {
  const [activeView, setActiveView] = useState('table');
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState(null)
  // Datos de ejemplo (en producción vendrían del backend)
  const [files, setFiles] = useState([
    { id: 1, name: 'informe2025.pdf', size: '2300', date: '30/09/2025', type: 'pdf' },
    { id: 2, name: 'reporte_ventas.xlsx', size: '1200', date: '29/09/2025', type: 'xlsx' },
    { id: 3, name: 'datos_clientes.csv', size: '800', date: '28/09/2025', type: 'csv' },
    { id: 4, name: 'grafico_anual.png', size: '500', date: '27/09/2025', type: 'png' },
    { id: 5, name: 'presentacion.pptx', size: '4500', date: '25/09/2025', type: 'pptx' },
  ])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 5

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return files
    return files.filter(f => f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q))
  }, [files, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage)

  const demoPdf = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'

  function openSidePreview(f) {
    setSelectedFile(f)
    setSelectedPreviewUrl(f.url ?? demoPdf)
  }

  function closeSidePreview() {
    setSelectedFile(null)
    setSelectedPreviewUrl(null)
  }

  // select first file by default when component mounts (if any)
  useEffect(() => {
    if (files && files.length > 0) {
      // only set if nothing selected yet
      if (!selectedFile) openSidePreview(files[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
      <UserHeader name="Pedro Vazques" role="Analista de datos" type="Usuario" />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Metrics totalFiles={files.length} usedSpace={'1.2 GB'} breadcrumb={'Raíz > Proyectos > 2025'} />
        <ViewSwitch views={VIEWS} activeView={activeView} onChange={setActiveView} />
        <FileActions />

        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Archivos</h2>
            <input 
              value={query} 
              onChange={e => { setQuery(e.target.value); setPage(1); }} 
              placeholder="Buscar archivos..." 
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
            />
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
                                <span className="text-white text-lg">{f.type === 'xlsx' ? '📊' : f.type === 'csv' ? '📋' : f.type === 'png' ? '🖼️' : '📄'}</span>
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
                              <button 
                                onClick={() => {
                                  const content = `Archivo: ${f.name}`
                                  const blob = new Blob([content], { type: 'text/plain' })
                                  const url = URL.createObjectURL(blob)
                                  const a = document.createElement('a')
                                  a.href = url
                                  a.download = f.name
                                  document.body.appendChild(a)
                                  a.click()
                                  a.remove()
                                  URL.revokeObjectURL(url)
                                }} 
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                              >
                                📥 Descargar
                              </button>
                              <button 
                                onClick={() => navigate('/preview', { state: { file: f, previewUrl: f.url ?? demoPdf } })} 
                                className="px-3 py-1.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                              >
                                Ver
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
                    Mostrando {pageItems.length} de {filtered.length} archivos
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
                          <iframe 
                            src={selectedPreviewUrl && (selectedPreviewUrl.endsWith('.pdf') ? `https://docs.google.com/gview?url=${encodeURIComponent(selectedPreviewUrl)}&embedded=true` : selectedPreviewUrl)} 
                            title={`Preview ${selectedFile.name}`} 
                            className="w-full h-full border-0" 
                          />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
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
              files={filtered}
              onOpen={openSidePreview} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Filesexplorer;