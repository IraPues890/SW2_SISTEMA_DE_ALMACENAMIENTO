import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login/Login';
import Dashboardadmin from './pages/Dashboard/Admin/DashAdmin';
import Previewfiles from './pages/PreviewFiles/PreviewFiles';
import Uploadfiles from './pages/UploadFiles/UploadFiles';
import Filesexplorer from './pages/FilesExplorer/Filesexplorer';
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />

        <Route path='/admin' element={<ProtectedRoute roles={["Administrador"]}><Dashboardadmin /></ProtectedRoute>} />
        
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
