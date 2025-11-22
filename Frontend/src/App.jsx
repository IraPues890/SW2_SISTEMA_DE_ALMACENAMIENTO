import { Routes, Route } from 'react-router-dom'
import { StorageProvider } from './context/StorageContext';
import AuthProvider from './context/AuthContext';

import Login from './pages/Login/Login';
import DashAdmin from './pages/Dashboard/DashAdmin';
import PaymentOptions from './pages/Dashboard/PaymentOptions';
import AuditLogs from './pages/AuditLogs/AuditLogs';
import Previewfiles from './pages/PreviewFiles/PreviewFiles';
import Uploadfiles from './pages/UploadFiles/UploadFiles';
import Filesexplorer from './pages/FilesExplorer/Filesexplorer';
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <div>
      <AuthProvider>
        <StorageProvider>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />

            {/* Rutas de Administrador */}
            <Route path='/admin' element={<ProtectedRoute roles={["Administrador"]}><DashAdmin /></ProtectedRoute>} />
            <Route path='/admin/dashboard' element={<ProtectedRoute roles={["Administrador"]}><DashAdmin /></ProtectedRoute>} />
            <Route path='/admin/pago-servicios' element={<ProtectedRoute roles={["Administrador"]}><PaymentOptions /></ProtectedRoute>} />
            <Route path='/admin/audit-logs' element={<ProtectedRoute roles={["Administrador"]}><AuditLogs /></ProtectedRoute>} />

            {/* Rutas de Usuarios (todos los roles excepto Admin para estas funcionalidades) */}
            <Route path='/user' element={<ProtectedRoute roles={["Editor", "Viewer"]}><Filesexplorer /></ProtectedRoute>} />
            <Route path='/user/files' element={<ProtectedRoute roles={["Editor", "Viewer"]}><Filesexplorer /></ProtectedRoute>} />
            <Route path='/user/upload' element={<ProtectedRoute roles={["Editor"]}><Uploadfiles /></ProtectedRoute>} />
            <Route path='/user/preview' element={<ProtectedRoute><Previewfiles /></ProtectedRoute>} />

            {/* Rutas legacy (mantenemos por compatibilidad pero redirigen según rol) */}
            <Route path='/preview' element={<ProtectedRoute><Previewfiles /></ProtectedRoute>} />
            <Route path='/upload' element={<ProtectedRoute><Uploadfiles /></ProtectedRoute>} />
            <Route path='/explorer' element={<ProtectedRoute><Filesexplorer /></ProtectedRoute>} />

            {/* fallback */}
            <Route path='*' element={<Login />} />
          </Routes>
        </StorageProvider>
      </AuthProvider>
    </div>
  )
}

export default App;
