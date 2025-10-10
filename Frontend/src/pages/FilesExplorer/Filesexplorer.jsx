import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import UserHeader from './components/UserHeader'
import FileActions from './components/FileActions'
import Metrics from './components/Metrics'
import { ViewSwitch, ViewContent } from './components/ViewComponents'
import useFiles from './hooks/useFiles'

const VIEWS = [
  { key: 'table', label: 'Tabla', icon: '📋' },
  { key: 'large', label: 'Iconos grandes', icon: '🖼️' },
  { key: 'medium', label: 'Iconos medianos', icon: '🗂️' },
  { key: 'small', label: 'Iconos pequeños', icon: '🔹' },
];

function Filesexplorer() {
  const [activeView, setActiveView] = useState('table');
  const navigate = useNavigate()

  // ejemplo inicial -> en producción se setea con setFiles desde fetch
  const initialFiles = [
    { id: 1, name: 'informe2025.pdf', size: '2300', date: '30/09/2025', type: 'pdf' },
    { id: 2, name: 'reporte_ventas.xlsx', size: '1200', date: '29/09/2025', type: 'xlsx' },
    { id: 3, name: 'datos_clientes.csv', size: '800', date: '28/09/2025', type: 'csv' },
    { id: 4, name: 'grafico_anual.png', size: '500', date: '27/09/2025', type: 'png' },
    { id: 5, name: 'presentacion.pptx', size: '4500', date: '25/09/2025', type: 'pptx' },
  ]

  const { files, setFiles, query, setQuery, page, setPage, perPage, filtered, totalPages, pageItems, selectedFile, selectedPreviewUrl, openSidePreview, closeSidePreview } = useFiles(initialFiles)

  return (
    <div className="Files_explorer">
      <div className="fe-metrics-wrapper mb-4">
        <Metrics totalFiles={files.length} usedSpace={'1.2 GB'} breadcrumb={'Raíz > Proyectos > 2025'} />
      </div>

      <UserHeader name={'Usuario Demo'} role={'Administrador'} type={'Organización'} />

      <div className="fe-main-options w-full px-4 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="fe-view-content">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Archivos</h2>
                <input value={query} onChange={e=>{ setQuery(e.target.value); setPage(1)}} placeholder="Buscar..." className="px-3 py-2 border rounded-md" />
              </div>

              {activeView === 'table' ? (
                <div>
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

                                <button onClick={() => navigate('/preview', { state: { file: f, previewUrl: f.url ?? ( 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' ) } })} className="px-3 py-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-md text-sm shadow">Previsualizar</button>
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
  )
}

export default Filesexplorer;