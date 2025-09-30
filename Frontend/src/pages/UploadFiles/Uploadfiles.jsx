import './Uploadfiles.css';
import { useState } from 'react';

// S: Cabecera de identidad
function UserHeader({ name, role, type }) {
  return (
    <header className="uf-header">
      <div className="uf-user-info">
        <span className="uf-user-name">{name}</span>
        <span className="uf-user-role">{role}</span>
        <span className="uf-user-type">Rol: {type}</span>
      </div>
    </header>
  );
}

// S: Selector de archivo
function FileSelector({ selectedFile, onSelect }) {
  return (
    <section className="uf-file-selector">
      <label className="uf-select-label">
        <button
          className="uf-select-btn"
          onClick={() => document.getElementById('fileInput').click()}
        >
          📂 Seleccionar archivo
        </button>
        <input
          id="fileInput"
          type="file"
          style={{ display: 'none' }}
          onChange={e => onSelect(e.target.files[0])}
        />
      </label>
      <span className="uf-file-name">
        {selectedFile ? selectedFile.name : 'Ningún archivo seleccionado'}
      </span>
    </section>
  );
}

// S: Opciones adicionales
function UploadOptions({ destFolder, onFolderChange, overwrite, onOverwriteChange }) {
  return (
    <section className="uf-options">
      <div>
        <strong>Carpeta destino:</strong>
        <select
          value={destFolder}
          onChange={e => onFolderChange(e.target.value)}
          className="uf-folder-select"
        >
          <option>Raíz &gt; Proyectos</option>
          <option>Raíz &gt; Documentos</option>
          <option>Raíz &gt; Imágenes</option>
        </select>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={overwrite}
            onChange={e => onOverwriteChange(e.target.checked)}
          />
          Sobrescribir si ya existe
        </label>
      </div>
    </section>
  );
}

// S: Barra de progreso
function UploadProgress({ progress }) {
  return (
    <section className="uf-progress">
      <div className="uf-progress-bar">
        <div
          className="uf-progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span>{progress}%</span>
    </section>
  );
}

// S: Acciones
function UploadActions({ onUpload, onCancel, disabled }) {
  return (
    <section className="uf-actions">
      <button
        className="uf-upload-btn"
        disabled={disabled}
        onClick={onUpload}
      >
        ✅ Subir archivo
      </button>
      <button
        className="uf-cancel-btn"
        onClick={onCancel}
      >
        ❌ Cancelar
      </button>
    </section>
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
    <div className="Upload_files">
      <UserHeader name="Pedro Vazques" role="Analista de datos" type="Usuario" />
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
    </div>
  );
}

export default Uploadfiles;