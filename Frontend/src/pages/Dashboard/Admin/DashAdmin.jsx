
import './DashAdmin.css';
import { useState } from 'react';

//class
import { User } from '../User';
import { Metrics } from '../Metrics';
import { Status } from './Status';
import { Action } from '../Action';
import { Active } from '../Active';

//functions
import UserHeader from '../../../components/Dashboard/UserHeader';
import GlobalMetrics from '../../../components/Dashboard/GlobalMetrics';
import ServerStatus from '../../../components/Dashboard/Admin/ServersStatus';
import QuickActions from '../../../components/Dashboard/QuickActions';
import ActiveUserTable from '../../../components/Dashboard/Admin/ActiveUserTable';

function DashAdmin() {

  const admin = new User("María López", "Jefa de TI", "Administrador")
  const metrics = [
    new Metrics( 'Total de usuarios:', '15' ),
    new Metrics( 'Archivos almacenados:', '1,250' ),
    new Metrics( 'Espacio global usado:', '120 GB' )
  ]

  const status = [
    new Status( 'Server 1', 'Online' ),
    new Status( 'Server 2', 'Online' ),
    new Status( 'Server 3', 'Online' )
  ];
  const actions = [
    new Action( 'Subir archivo', '📤', 'Subir archivo' ),
    new Action( 'Buscar archivo', '👁️', 'Buscar archivo' ),
    new Action( 'Validar permisos', '🔑', 'Validar permisos' )
  ]
  
  const [actives,setActives] = useState([
    new Active( 'Raul Romero', '2.5', '29/09/2025 14:32' ),
    new Active( 'Pedro Sánchez', '1.8', '29/09/2025 13:10' ),
    new Active( 'Ana Torres', '3.1', '28/09/2025 17:45' )
  ])

  return (
    <div className="dashboard_admin">
      <UserHeader administrator={admin} />
      <GlobalMetrics metrics={metrics} />
      <ServerStatus status={status} />
      <QuickActions actions={actions} />
      <ActiveUserTable actives={actives} />
    </div>
  )
}
export default DashAdmin