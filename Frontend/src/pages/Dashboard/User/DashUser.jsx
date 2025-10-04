
import './DashUser.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

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
import { createActionHandlers, handleAction } from '../../../components/Dashboard/CreateActions';

function DashUser() {
  const navigate = useNavigate()

  const admin = new User("Pedro Vazques", "Analista de datos", "Usuario")
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

  const actionHandlers = createActionHandlers(navigate, actions)
  const onAction = (actionName) => handleAction(actionName, actionHandlers)

  return (
    <div className="dashboard_user">
      <UserHeader administrator={admin} />
      <GlobalMetrics metrics={metrics} />
      <QuickActions actions={actions} onAction={onAction} />
      <ActiveFilesTable actives={actives} />
    </div>
  )
}
export default DashUser