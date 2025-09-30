import './DashAdmin.css';

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

// S: Métricas globales
function GlobalMetrics({ metrics }) {
  return (
    <section className="global-metrics">
      {metrics.map(({ label, value, className }) => (
        <div className="metric" key={label}>
          <span>{label}</span>
          <strong className={className}>{value}</strong>
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

// S: Vista global de usuarios activos
function ActiveUsersTable({ users }) {
  return (
    <section className="active-users">
      <h3>Usuarios activos</h3>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Espacio usado</th>
            <th>Última actividad</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ name, space, activity }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{space}</td>
              <td>{activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// O: Permite extensión por props
function DashAdmin() {
  const metrics = [
    { label: 'Total de usuarios:', value: '15' },
    { label: 'Archivos almacenados:', value: '1,250' },
    { label: 'Espacio global usado:', value: '120 GB' },
    { label: 'Estado de servidores:', value: 'Online', className: 'server-status online' },
  ];
  const actions = [
    { label: 'Subir archivo', icon: '📤', title: 'Subir archivo' },
    { label: 'Descargar archivo', icon: '📥', title: 'Descargar archivo' },
    { label: 'Ver archivo', icon: '👁️', title: 'Ver archivo' },
    { label: 'Acceso a servidores', icon: '🖥️', title: 'Acceso a servidores' },
  ];
  const users = [
    { name: 'Giomar Castillo', space: '2.5 GB', activity: '29/09/2025 14:32' },
    { name: 'Pedro Sánchez', space: '1.8 GB', activity: '29/09/2025 13:10' },
    { name: 'Ana Torres', space: '3.1 GB', activity: '28/09/2025 17:45' },
  ];

  return (
    <div className="dashboard-admin">
      <UserHeader name="María López" position="Jefa de TI" role="Administrador" />
      <GlobalMetrics metrics={metrics} />
      <QuickActions actions={actions} />
      <ActiveUsersTable users={users} />
    </div>
  );
}

export default DashAdmin;