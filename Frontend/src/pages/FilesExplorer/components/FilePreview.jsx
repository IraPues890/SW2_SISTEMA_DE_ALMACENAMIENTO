import React from 'react';

export default function FilePreview({ selectedFile, previewUrl, handleDownloadSelected, setSelectedFile }) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        {selectedFile ? (
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{selectedFile.name}</h3>
                <div className="text-sm text-slate-600 mt-1">{selectedFile.type.toUpperCase()} • {selectedFile.size} KB</div>
              </div>
              <button onClick={() => setSelectedFile(null)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors">✖</button>
            </div>
            <div className="mb-4">
              <div className="bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200" style={{height: 300}}>
                {selectedFile.type === 'folder' ? (<div className="w-full h-full flex items-center justify-center text-slate-500">Esta es una carpeta. (Sin vista previa)</div>) : (<iframe src={previewUrl} title={`Preview ${selectedFile.name}`} className="w-full h-full border-0" />)}
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
  );
}
