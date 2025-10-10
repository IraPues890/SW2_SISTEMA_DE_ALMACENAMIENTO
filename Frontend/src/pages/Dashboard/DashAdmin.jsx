
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

//class
import { User } from './classes/User';
import { Metrics } from './classes/Metrics';
import { Status } from './classes/Status';
import { Action } from './classes/Action';
import { Active } from './classes/Active';

//functions
import { createActionHandlers, handleAction } from './components/CreateActions';

function DashAdmin() {
  const navigate = useNavigate()

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

  const actionHandlers = createActionHandlers(navigate, actions)
  const onAction = (actionName) => handleAction(actionName, actionHandlers)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🏢</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{admin.getName}</h1>
                <p className="text-blue-200 text-sm">{admin.getPosicion} • {admin.getRole}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-sm">Panel de Administración</p>
              <p className="text-blue-300 text-xs">Sistema UlStorage</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{metric.getName}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{metric.getValue}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-slate-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">
                    {index === 0 ? '👥' : index === 1 ? '📁' : '💾'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Server Status */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <span className="mr-2">🖥️</span>
            Estado de Servidores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {status.map((server, index) => (
              <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{server.getName}</p>
                    <p className="text-green-600 text-sm font-medium">{server.getStatus}</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => onAction(action.getLabel)}
                className="bg-gradient-to-r from-blue-600 to-slate-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span className="text-xl">{action.getIcon}</span>
                <span>{action.getLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Users Table */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <span className="mr-2">👥</span>
            Usuarios Activos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Usuario</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Espacio (GB)</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Última Actividad</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {actives.map((user, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-slate-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{user.getName.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-slate-800">{user.getName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{user.getSpace}</td>
                    <td className="py-3 px-4 text-slate-600">{user.getDate}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        En línea
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
export default DashAdmin