
import { useState, useEffect } from 'react';
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
    new Action( 'Buscar archivo', '👁️', 'Buscar archivo' )
  ]
  
  const [actives, setActives] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  const actionHandlers = createActionHandlers(navigate, actions)
  const onAction = (actionName) => handleAction(actionName, actionHandlers)

  // Role modal state and handlers
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [roleName, setRoleName] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
  const [availablePermissions, setAvailablePermissions] = useState({})
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [loadingPermissions, setLoadingPermissions] = useState(false)

  // Cargar usuarios activos al montar el componente
  useEffect(() => {
    loadActiveUsers()
  }, [])

  // Cargar permisos disponibles cuando se abre el modal
  useEffect(() => {
    if (showRoleModal) {
      loadAvailablePermissions()
    }
  }, [showRoleModal])

  const loadActiveUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await fetch('http://localhost:3000/api/admin/active-users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const activeUsers = data.data.map(user => 
          new Active(user.nombre, user.espacioUsado, user.ultimaActividad, user.estado)
        )
        setActives(activeUsers)
      } else {
        console.error('Error cargando usuarios activos')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const loadAvailablePermissions = async () => {
    setLoadingPermissions(true)
    try {
      const response = await fetch('http://localhost:3000/api/admin/permissions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAvailablePermissions(data.data)
      } else {
        console.error('Error cargando permisos')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoadingPermissions(false)
    }
  }

  const togglePermission = (permisoId) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permisoId)) {
        return prev.filter(id => id !== permisoId)
      } else {
        return [...prev, permisoId]
      }
    })
  }

  const onSaveRole = async () => {
    if (!roleName.trim() || selectedPermissions.length === 0) {
      alert('Por favor complete el nombre del rol y seleccione al menos un permiso')
      return
    }

    try {
      const response = await fetch('http://localhost:3000/api/admin/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          nombre: roleName,
          descripcion: roleDescription,
          permisos: selectedPermissions
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Rol creado exitosamente:', data)
        alert('Rol creado exitosamente')
        
        // Reset and close
        setRoleName('')
        setRoleDescription('')
        setSelectedPermissions([])
        setShowRoleModal(false)
      } else {
        const error = await response.json()
        alert('Error al crear rol: ' + error.message)
      }
    } catch (error) {
      console.error('Error creando rol:', error)
      alert('Error al crear rol')
    }
  }

  const onCancelRole = () => {
    setShowRoleModal(false)
  }

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
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-white text-sm">Panel de Administración</p>
                <p className="text-blue-300 text-xs">Sistema UlStorage</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowRoleModal(true)}
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded shadow hover:from-indigo-600 hover:to-violet-700 transition-all duration-200 font-semibold"
                >
                  Crear roles
                </button>
                <button
                  onClick={() => navigate('/admin/audit-logs')}
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded shadow hover:from-orange-600 hover:to-red-700 transition-all duration-200 font-semibold"
                >
                  📊 Logs de Auditoría
                </button>
                <button
                  onClick={() => navigate('/admin/pago-servicios')}
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-700 text-white rounded shadow hover:from-green-600 hover:to-emerald-800 transition-all duration-200 font-semibold"
                >
                  Pago de servicios
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Role creation modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-slate-800">Crear nuevo rol</h3>
            </div>
            <div className="px-6 py-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del rol</label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Escribe el nombre del rol"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción (opcional)</label>
                <textarea
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  placeholder="Descripción del rol"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Permisos del sistema</p>
                
                {loadingPermissions ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-slate-600">Cargando permisos...</span>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {Object.entries(availablePermissions).map(([categoria, permisos]) => (
                      <div key={categoria} className="border rounded-lg p-3">
                        <h4 className="font-semibold text-slate-700 mb-2 capitalize">
                          📋 {categoria}
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {permisos.map((permiso) => (
                            <label key={permiso.id} className="inline-flex items-start space-x-2 text-sm">
                              <input
                                type="checkbox"
                                checked={selectedPermissions.includes(permiso.id)}
                                onChange={() => togglePermission(permiso.id)}
                                className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <div>
                                <span className="font-medium">{permiso.nombre}</span>
                                <p className="text-xs text-slate-500">{permiso.descripcion}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-3 text-xs text-slate-500">
                  {selectedPermissions.length} permisos seleccionados
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3">
              <button onClick={onCancelRole} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">
                Cancelar
              </button>
              <button 
                onClick={onSaveRole} 
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                disabled={!roleName.trim() || selectedPermissions.length === 0}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

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
            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-slate-600">Cargando usuarios activos...</span>
              </div>
            ) : actives.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No hay usuarios activos en este momento
              </div>
            ) : (
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.getStatus === 'En línea' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <span className={`w-2 h-2 rounded-full mr-1 ${
                            user.getStatus === 'En línea' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></span>
                          {user.getStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
export default DashAdmin