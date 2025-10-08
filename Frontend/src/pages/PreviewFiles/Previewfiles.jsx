import { useState } from 'react';

// S: Cabecera de identidad
function UserHeader({ name, role, type }) {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">👁️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{name}</h1>
              <p className="text-blue-200 text-sm">{role} • {type}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white text-sm">Vista Previa</p>
            <p className="text-blue-300 text-xs">Sistema UlStorage</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// S: Encabezado del archivo
function FileHeader({ file, onClose }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center">
          <span className="mr-2">📄</span>
          Información del Archivo
        </h2>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-red-600 to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:from-red-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 active:scale-[0.98] shadow-lg hover:shadow-xl"
          title="Cerrar vista previa"
        >
          ❌ Cerrar
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Nombre:</span>
            <span className="text-slate-600">{file.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Tipo:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {file.type}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Tamaño:</span>
            <span className="text-slate-600">{file.size}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Modificado:</span>
            <span className="text-slate-600">{file.modified}</span>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center space-x-2">
          <span>📥</span>
          <span>Descargar</span>
        </button>
        <button className="bg-gradient-to-r from-green-600 to-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-green-500/50 active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center space-x-2">
          <span>🖨️</span>
          <span>Imprimir</span>
        </button>
      </div>
    </div>
  );
}

// S: Área principal de vista previa
function FilePreview({ file, showPreview }) {
  if (!showPreview) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">❌</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Vista previa cerrada</h3>
          <p className="text-slate-600">La vista previa del archivo ha sido cerrada</p>
        </div>
      </div>
    );
  }
  
  if (!file.previewable) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Vista previa no disponible</h3>
          <p className="text-slate-600 mb-4">Este tipo de archivo no puede ser previsualizado en el navegador</p>
          <button className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-[0.98] shadow-lg hover:shadow-xl">
            📥 Descargar archivo
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
        <span className="mr-2">👁️</span>
        Vista Previa del Documento
      </h2>
      <div className="bg-slate-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
        <iframe
          src="https://docs.google.com/gview?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true"
          title="Visor PDF"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}

// O: Permite extensión por props
function Previewfiles() {
  const [showPreview, setShowPreview] = useState(true);
  const file = {
    name: 'informe2025.pdf',
    type: 'PDF',
    size: '2.3 MB',
    modified: '30/09/2025 14:32',
    previewable: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <UserHeader name="Pedro Vazques" role="Analista de datos" type="Usuario" />
      
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <FileHeader file={file} onClose={() => setShowPreview(false)} />
        <FilePreview file={file} showPreview={showPreview} />
      </main>
    </div>
  );
}

export default Previewfiles;