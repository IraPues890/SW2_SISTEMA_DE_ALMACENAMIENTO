import { useState } from 'react';

// S: Cabecera de identidad
function UserHeader({ name, role, type }) {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">📤</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{name}</h1>
              <p className="text-blue-200 text-sm">{role} • {type}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white text-sm">Subir Archivos</p>
            <p className="text-blue-300 text-xs">Sistema UlStorage</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// S: Selector de archivo
function FileSelector({ selectedFile, onSelect }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <span className="mr-2">📂</span>
        Seleccionar Archivo
      </h2>
      
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">📁</span>
        </div>
        
        <button
          className="bg-gradient-to-r from-blue-600 to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-[0.98] shadow-lg hover:shadow-xl mb-4"
          onClick={() => document.getElementById('fileInput').click()}
        >
          📂 Seleccionar archivo
        </button>
        
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={e => onSelect(e.target.files[0])}
        />
        
        <p className="text-slate-600 text-sm">
          {selectedFile ? (
            <span className="text-green-600 font-medium">✓ {selectedFile.name}</span>
          ) : (
            'Ningún archivo seleccionado'
          )}
        </p>
      </div>
    </div>
  );
}

// S: Opciones adicionales
function UploadOptions({ destFolder, onFolderChange, overwrite, onOverwriteChange }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
        <span className="mr-2">⚙️</span>
        Opciones de Carga
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Carpeta destino:
          </label>
          <select
            value={destFolder}
            onChange={e => onFolderChange(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base outline-none bg-white text-slate-800 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400"
          >
            <option>Raíz &gt; Proyectos</option>
            <option>Raíz &gt; Documentos</option>
            <option>Raíz &gt; Imágenes</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="overwrite"
            checked={overwrite}
            onChange={e => onOverwriteChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="overwrite" className="text-sm font-medium text-slate-700">
            Sobrescribir si ya existe
          </label>
        </div>
      </div>
    </div>
  );
}

// S: Barra de progreso
function UploadProgress({ progress }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Progreso de Carga
      </h2>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-700">Progreso</span>
          <span className="text-sm font-bold text-slate-800">{progress}%</span>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {progress > 0 && (
          <p className="text-xs text-slate-600 mt-2">
            {progress === 100 ? '¡Carga completada!' : 'Subiendo archivo...'}
          </p>
        )}
      </div>
    </div>
  );
}

// S: Acciones
function UploadActions({ onUpload, onCancel, disabled }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
      <div className="flex space-x-4">
        <button
          className={`flex-1 px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 active:scale-[0.98] shadow-lg hover:shadow-xl ${
            disabled 
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-700 hover:to-emerald-800 focus:ring-green-500/50'
          }`}
          disabled={disabled}
          onClick={onUpload}
        >
          ✅ Subir archivo
        </button>
        
        <button
          className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 hover:from-red-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 active:scale-[0.98] shadow-lg hover:shadow-xl"
          onClick={onCancel}
        >
          ❌ Cancelar
        </button>
      </div>
    </div>
  );
}

// O: Permite extensión por props
function Uploadfiles() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [destFolder, setDestFolder] = useState('Raíz > Proyectos');
  const [overwrite, setOverwrite] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulación de carga
  const handleUpload = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <UserHeader name="Pedro Vazques" role="Analista de datos" type="Usuario" />
      
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <FileSelector selectedFile={selectedFile} onSelect={setSelectedFile} />
        <UploadOptions
          destFolder={destFolder}
          onFolderChange={setDestFolder}
          overwrite={overwrite}
          onOverwriteChange={setOverwrite}
        />
        <UploadProgress progress={progress} />
        <UploadActions
          onUpload={handleUpload}
          onCancel={handleCancel}
          disabled={!selectedFile || progress > 0}
        />
      </main>
    </div>
  );
}

export default Uploadfiles;