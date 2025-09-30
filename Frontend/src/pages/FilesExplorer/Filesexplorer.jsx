import './Filesexplorer.css';
import { useState } from 'react';

// S: Componente para la cabecera de usuario
function UserHeader({ name, role, type }) {
  return (
    <header className="fe-header">
      <div className="fe-user-info">
        <span className="fe-user-name">{name}</span>
        <span className="fe-user-role">{role}</span>
        <span className="fe-user-type">Rol: {type}</span>
      </div>
    </header>
  );
}

// S: Componente para cambiar la vista
function ViewSwitch({ views, activeView, onChange }) {
  return (
    <div className="fe-view-switch">
      <span>Cambiar vista:</span>
      {views.map(view => (
        <button
          key={view.key}
          className={activeView === view.key ? 'active' : ''}
          onClick={() => onChange(view.key)}
          title={view.label}
        >
          {view.icon} {view.label}
        </button>
      ))}
    </div>
  );
}

// S: Componente para acciones de archivos
function FileActions() {
  return (
    <div className="fe-file-actions">
      <button title="Subir archivo">📤 Subir archivo</button>
      <button title="Descargar archivo">📥 Descargar archivo</button>
      <button title="Crear carpeta">➕ Crear carpeta</button>
      <button title="Organizar en carpetas">📂 Organizar en carpetas</button>
    </div>
  );
}

// S: Componente para métricas
function Metrics({ totalFiles, usedSpace, breadcrumb }) {
  return (
    <section className="fe-metrics">
      <div>
        <strong>Número total de archivos:</strong> {totalFiles}
      </div>
      <div>
        <strong>Espacio utilizado:</strong> {usedSpace}
      </div>
      <div className="fe-breadcrumb">
        <strong>Carpeta actual:</strong> {breadcrumb}
      </div>
    </section>
  );
}

// S: Componente para mostrar la vista activa
function ViewContent({ activeView }) {
  const views = {
    table: <div className="fe-table-view"><p>Vista de tabla de archivos (demo)</p></div>,
    large: <div className="fe-large-icons-view"><p>Vista de iconos grandes (demo)</p></div>,
    medium: <div className="fe-medium-icons-view"><p>Vista de iconos medianos (demo)</p></div>,
    small: <div className="fe-small-icons-view"><p>Vista de iconos pequeños (demo)</p></div>,
  };
  return <section className="fe-view-content">{views[activeView]}</section>;
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

  return (
    <div className="Files_explorer">
      <UserHeader name="Pedro Vazques" role="Analista de datos" type="Usuario" />
      <section className="fe-main-options">
        <ViewSwitch views={VIEWS} activeView={activeView} onChange={setActiveView} />
        <FileActions />
      </section>
      <Metrics totalFiles={12} usedSpace="1.2 GB" breadcrumb="Raíz > Proyectos > 2025" />
      <ViewContent activeView={activeView} />
    </div>
  );
}

export default Filesexplorer;