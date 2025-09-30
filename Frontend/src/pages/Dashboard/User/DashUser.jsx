import './DashUser.css';

// S: Cabecera de identidad
function UserHeader({ name, position, role }) {
  return (
    <header className="identity-header">
      <div className="identity-info">
        <h2>{name}</h2>
        <p>Puesto laboral: {position}</p>
        <p>Rol en el sistema: {role}</p>
      </div>
    </header>
  );
}

// S: Métricas personales
function PersonalMetrics({ metrics }) {
  return (
    <section className="personal-metrics">
      {metrics.map(({ label, value }) => (
        <div className="metric" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}

// S: Acciones rápidas
function QuickActions({ actions }) {
  return (
    <section className="quick-actions">
      {actions.map(({ label, icon, title, onClick }) => (
        <button key={label} title={title} onClick={onClick}>
          {icon} {label}
        </button>
      ))}
    </section>
  );
}

// S: Archivos recientes
function RecentFilesTable({ files }) {
  return (
    <section className="recent-files">
      <h3>Archivos recientes</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Tamaño</th>
          </tr>
        </thead>
        <tbody>
          {files.map(({ name, date, size }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{date}</td>
              <td>{size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// O: Permite extensión por props
function DashUser() {
  const metrics = [
    { label: 'Archivos almacenados:', value: '120' },
    { label: 'Espacio utilizado:', value: '2.5 GB' },
    { label: 'Última actividad:', value: '29/09/2025 14:32' },
  ];
  const actions = [
    { label: 'Subir archivo', icon: '📤', title: 'Subir archivo' },
    { label: 'Descargar archivo', icon: '📥', title: 'Descargar archivo' },
    { label: 'Ver archivo', icon: '👁️', title: 'Ver archivo' },
  ];
  const files = [
    { name: 'reporte_ventas.xlsx', date: '29/09/2025', size: '1.2 MB' },
    { name: 'datos_clientes.csv', date: '28/09/2025', size: '800 KB' },
    { name: 'grafico_anual.png', date: '27/09/2025', size: '500 KB' },
  ];

  return (
    <div className="dashboard-user">
      <UserHeader name="Pedro Vazques" position="Analista de datos" role="Usuario" />
      <PersonalMetrics metrics={metrics} />
      <QuickActions actions={actions} />
      <RecentFilesTable files={files} />
    </div>
  );
}

export default DashUser;