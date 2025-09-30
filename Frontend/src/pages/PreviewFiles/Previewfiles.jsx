import './Previewfiles.css';
import { useState } from 'react';

// S: Cabecera de identidad
function UserHeader({ name, role, type }) {
  return (
    <header className="pf-header">
      <div className="pf-user-info">
        <span className="pf-user-name">{name}</span>
        <span className="pf-user-role">{role}</span>
        <span className="pf-user-type">Rol: {type}</span>
      </div>
    </header>
  );
}

// S: Encabezado del archivo
function FileHeader({ file, onClose }) {
  return (
    <section className="pf-file-header">
      <div>
        <strong>Nombre del archivo:</strong> {file.name}
      </div>
      <div>
        <strong>Tipo:</strong> {file.type}
      </div>
      <div>
        <strong>Tamaño:</strong> {file.size}
      </div>
      <div>
        <strong>Última modificación:</strong> {file.modified}
      </div>
      <div className="pf-file-actions">
        <button title="Descargar archivo">📥 Descargar archivo</button>
        <button title="Imprimir">🖨️ Imprimir</button>
        <button title="Cerrar vista previa" onClick={onClose}>❌ Cerrar vista previa</button>
      </div>
    </section>
  );
}

// S: Área principal de vista previa
function FilePreview({ file, showPreview }) {
  if (!showPreview) {
    return <div className="pf-preview-closed">Vista previa cerrada.</div>;
  }
  if (!file.previewable) {
    return (
      <div className="pf-preview-unavailable">
        Vista previa no disponible, descargue el archivo para verlo.
      </div>
    );
  }
  return (
    <div className="pf-preview-viewer">
      <iframe
        src="https://docs.google.com/gview?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true"
        title="Visor PDF"
        className="pf-pdf-viewer"
      ></iframe>
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
    <div className="Preview_files">
      <UserHeader name="Pedro Vazques" role="Analista de datos" type="Usuario" />
      <FileHeader file={file} onClose={() => setShowPreview(false)} />
      <section className="pf-preview-area">
        <FilePreview file={file} showPreview={showPreview} />
      </section>
    </div>
  );
}

export default Previewfiles;