import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import './Filesexplorer.css'

// S: Componente para la cabecera de usuario
function UserHeader({ name, role, type }) {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="w-full px-4 lg:px-6 py-4">
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

// S: Componente para cambiar la vista
function ViewSwitch({ views, activeView, onChange }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <span className="text-slate-700 font-medium">Cambiar vista:</span>
        <div className="flex space-x-2">
          {views.map(view => (
            <button
              key={view.key}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeView === view.key 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-700 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              onClick={() => onChange(view.key)}
              title={view.label}
            >
              <span className="mr-2">{view.icon}</span>
              {view.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// S: Componente para acciones de archivos
function FileActions() {
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
  );
}

// S: Componente para métricas
function Metrics({ totalFiles, usedSpace, breadcrumb }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total de archivos</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{totalFiles}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">📁</span>
          </div>
        </div>
      </div>
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Espacio utilizado</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{usedSpace}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">💾</span>
          </div>
        </div>
      </div>
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Ubicación actual</p>
            <p className="text-lg font-bold text-slate-800 mt-1 break-all">{breadcrumb}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">📍</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// S: Componente para mostrar la vista activa
function ViewContent({ activeView }) {
  const views = {
    table: (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📋</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Vista de Tabla</h3>
          <p className="text-slate-600">Los archivos se mostrarán en formato de tabla detallada</p>
        </div>
      </div>
    ),
    large: (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🖼️</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Iconos Grandes</h3>
          <p className="text-slate-600">Vista de iconos grandes para fácil identificación</p>
        </div>
      </div>
    ),
    medium: (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🗂️</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Iconos Medianos</h3>
          <p className="text-slate-600">Balance perfecto entre detalle y espacio</p>
        </div>
      </div>
    ),
    small: (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🔹</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Iconos Pequeños</h3>
          <p className="text-slate-600">Vista compacta para máxima eficiencia</p>
        </div>
      </div>
    ),
  };
  return <section className="space-y-6">{views[activeView]}</section>;
}

// O: Permite extensión por props
const VIEWS = [
  { key: 'table', label: 'Tabla', icon: '📋' },
  { key: 'large', label: 'Iconos grandes', icon: '🖼️' },
  { key: 'medium', label: 'Iconos medianos', icon: '🗂️' },
  { key: 'small', label: 'Iconos pequeños', icon: '🔹' },
];

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
    <div className="Files_explorer">
      {/* moved metrics above header as requested */}
      <div className="fe-metrics-wrapper mb-4">
        <Metrics totalFiles={files.length} usedSpace={'1.2 GB'} breadcrumb={'Raíz > Proyectos > 2025'} />
      </div>

      <div className="fe-header">
        <div className="fe-user-info">
          <div>
            <h2 style={{fontSize: '1.15rem', margin: 0}}>Cambiar vista:</h2>
            <div className="fe-view-switch mt-2">
              {VIEWS.map(v => (
                <button key={v.key} className={v.key===activeView? 'active':''} onClick={()=>setActiveView(v.key)}>{v.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{marginLeft: 'auto'}}>
          <div className="fe-file-actions">
            <FileActions />
          </div>
        </div>
      </div>

  <div className="fe-main-options w-full px-4 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="fe-view-content">
              {activeView === 'table' ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Archivos</h2>
                    <input value={query} onChange={e=>{ setQuery(e.target.value); setPage(1)}} placeholder="Buscar..." className="px-3 py-2 border rounded-md" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="py-3 px-4 font-semibold text-slate-700">Nombre</th>
                          <th className="py-3 px-4 font-semibold text-slate-700">Tamaño (KB)</th>
                          <th className="py-3 px-4 font-semibold text-slate-700">Fecha</th>
                          <th className="py-3 px-4 font-semibold text-slate-700">Tipo</th>
                          <th className="py-3 px-4 font-semibold text-slate-700">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageItems.map((f) => (
                          <tr key={f.id} className={`border-b border-slate-100 transition-colors ${selectedFile?.id === f.id ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-sm">{f.type === 'xlsx' ? '📊' : f.type === 'csv' ? '📋' : f.type === 'png' ? '🖼️' : '📄'}</span>
                                </div>
                                <span onClick={() => openSidePreview(f)} className="font-medium text-slate-800 cursor-pointer">{f.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{f.size}</td>
                            <td className="py-3 px-4 text-slate-600">{f.date}</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{f.type.toUpperCase()}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button onClick={() => {
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
                                }} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-md text-sm shadow">📥 Descargar</button>

                                <button onClick={() => navigate('/preview', { state: { file: f, previewUrl: f.url ?? demoPdf } })} className="px-3 py-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-md text-sm shadow">Previsualizar</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-slate-600">Mostrando {pageItems.length} de {filtered.length} archivos</div>
                    <div className="flex items-center space-x-2">
                      <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 bg-slate-200 rounded">Anterior</button>
                      <span className="text-sm">{page} / {totalPages}</span>
                      <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1 bg-slate-200 rounded">Siguiente</button>
                    </div>
                  </div>
                </div>
              ) : (
                <ViewContent activeView={activeView} />
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="fe-preview-panel">
              {selectedFile ? (
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{selectedFile.name}</h3>
                      <div className="text-sm text-slate-600">{selectedFile.type.toUpperCase()} • {selectedFile.size} KB</div>
                    </div>
                    <button onClick={closeSidePreview} className="ml-2 bg-red-500 text-white px-3 py-1 rounded">Cerrar</button>
                  </div>

                  <div className="mb-3">
                    <div className="bg-slate-100 rounded overflow-hidden" style={{height: 360}}>
                      {/* PDF viewer: use Google gview for compatibility */}
                      <iframe src={selectedPreviewUrl && (selectedPreviewUrl.endsWith('.pdf') ? `https://docs.google.com/gview?url=${encodeURIComponent(selectedPreviewUrl)}&embedded=true` : selectedPreviewUrl)} title={`Preview ${selectedFile.name}`} className="w-full h-full border-0" />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button onClick={() => {
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
                    }} className="px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded">Descargar archivo</button>

                    <button onClick={() => window.print()} className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded">Imprimir</button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-600">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white">🔍</div>
                  <h4 className="font-semibold mb-1">Selecciona un archivo para previsualizar</h4>
                  <p className="text-sm">La vista previa aparecerá aquí.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filesexplorer;