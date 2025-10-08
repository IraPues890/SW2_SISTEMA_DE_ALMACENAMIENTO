import { Routes, Route} from 'react-router-dom'

import Login from './pages/Login/Login';
import Dashboardadmin from './pages/Dashboard/Admin/DashAdmin';
import Dashboarduser from './pages/Dashboard/User/DashUser';
import Previewfiles from './pages/PreviewFiles/PreviewFiles';
import Uploadfiles from './pages/UploadFiles/UploadFiles';
import Filesexplorer from './pages/FilesExplorer/FilesExplorer';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/admin' element={<Dashboardadmin />} />
        <Route path='/user' element={<Dashboarduser />} />
        <Route path='/preview' element={<Previewfiles />} />
        <Route path='/upload' element={<Uploadfiles />} />
        <Route path='/explorer' element={<Filesexplorer />} />
      </Routes>
    </div>
  )
}

export default App;
