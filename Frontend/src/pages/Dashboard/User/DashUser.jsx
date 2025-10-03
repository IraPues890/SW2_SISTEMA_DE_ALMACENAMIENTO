
import './DashUser.css';
import { useState } from 'react';

//class
import { User } from '../User';
import { Metrics } from '../Metrics';
import { Action } from '../Action';
import { Active } from '../Active';

//functions
import UserHeader from '../../../components/Dashboard/UserHeader';
import GlobalMetrics from '../../../components/Dashboard/GlobalMetrics';
import QuickActions from '../../../components/Dashboard/QuickActions';
import ActiveFilesTable from '../../../components/Dashboard/User/ActiveFilesTable';

function DashUser() {
  const admin = new User("María López", "Jefa de TI", "Administrador")
  const metrics = [
    new Metrics( 'Archivos almacenados:', '120' ),
    new Metrics( 'Espacio utilizado:', '2.5 GB' ),
    new Metrics( 'Última actividad:', '29/09/2025 14:32' )
  ]
  
  const actions = [
    new Action( 'Subir archivo', '📤', 'Subir archivo' ),
    new Action( 'Buscar archivo', '👁️', 'Buscar archivo' )
  ]
  const [actives,setActives] = useState([
    new Active( 'reporte_ventas.xlsx', '1.2', '29/09/2025' ),
    new Active( 'datos_clientes.csv', '800', '28/09/2025' ),
    new Active( 'grafico_anual.png', '500', '27/09/2025' )
  ])

  return (
    <div className="dashboard_user">
      <UserHeader administrator={admin} />
      <GlobalMetrics metrics={metrics} />
      <QuickActions actions={actions} />
      <ActiveFilesTable actives={actives} />
    </div>
  )
}
export default DashUser