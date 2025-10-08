
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

//class
import { User } from '../User';
import { Metrics } from '../Metrics';
import { Action } from '../Action';
import { Active } from '../Active';

//functions
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">👤</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{admin.getName}</h1>
                <p className="text-blue-200 text-sm">{admin.getPosicion} • {admin.getRole}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-sm">Panel de Usuario</p>
              <p className="text-blue-300 text-xs">Sistema UlStorage</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Personal Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{metric.getName}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{metric.getValue}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">
                    {index === 0 ? '📁' : index === 1 ? '💾' : '🕒'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => onAction(action.getLabel)}
                className="bg-gradient-to-r from-green-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:from-green-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-green-500/50 active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span className="text-xl">{action.getIcon}</span>
                <span>{action.getLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Files Table */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <span className="mr-2">📂</span>
            Archivos Recientes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Archivo</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Tamaño (KB)</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {actives.map((file, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm">
                            {file.getName.includes('.xlsx') ? '📊' : 
                             file.getName.includes('.csv') ? '📋' : 
                             file.getName.includes('.png') ? '🖼️' : '📄'}
                          </span>
                        </div>
                        <span className="font-medium text-slate-800">{file.getName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{file.getSpace}</td>
                    <td className="py-3 px-4 text-slate-600">{file.getDate}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {file.getName.split('.').pop().toUpperCase()}
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
export default DashUser