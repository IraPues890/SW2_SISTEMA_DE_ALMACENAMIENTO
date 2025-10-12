import { Routes, Route } from 'react-router-dom'
import ThemeToggle from './components/ThemeToggle'

import Login from './pages/Login/Login';
import DashAdmin from './pages/Dashboard/DashAdmin';
import PaymentOptions from './pages/Dashboard/PaymentOptions';
import Previewfiles from './pages/PreviewFiles/PreviewFiles';
import Uploadfiles from './pages/UploadFiles/UploadFiles';
import Filesexplorer from './pages/FilesExplorer/Filesexplorer';
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
  <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <header className="flex justify-end p-3">
        <ThemeToggle />
      </header>
      <Routes>
        <Route path='/' element={<Login />} />

  <Route path='/admin' element={<ProtectedRoute roles={["Administrador"]}><DashAdmin /></ProtectedRoute>} />
  <Route path='/admin/pago-servicios' element={<ProtectedRoute roles={["Administrador"]}><PaymentOptions /></ProtectedRoute>} />
        
        <Route path='/preview' element={<ProtectedRoute><Previewfiles /></ProtectedRoute>} />
        <Route path='/upload' element={<ProtectedRoute><Uploadfiles /></ProtectedRoute>} />
        <Route path='/explorer' element={<ProtectedRoute><Filesexplorer /></ProtectedRoute>} />

        {/* fallback */}
        <Route path='*' element={<Login />} />
      </Routes>
    </div>
  )
}

export default App;
