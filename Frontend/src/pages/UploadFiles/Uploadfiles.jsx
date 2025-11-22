import useUpload from './hooks/useUpload'
import UserHeader from './components/UserHeader'
import FileSelector from './components/FileSelector'
import UploadOptions from './components/UploadOptions'
import UploadProgress from './components/UploadProgress'
import UploadActions from './components/UploadActions'
import CloudSelector from './components/CloudSelector'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useStorage } from '../../context/StorageContext' 

function Uploadfiles() {
  const {
    selectedFile, setSelectedFile,
    destFolder, setDestFolder,
    overwrite, setOverwrite,
    selectedCloud, setSelectedCloud,
    progress, startUpload, cancel
  } = useUpload()
  
  const { user } = useContext(AuthContext)
  const { validateUpload, refreshStorage } = useStorage() 
  
  const token = user?.token || ''

  const handleUploadClick = async () => {
    if (!selectedFile) return;

    const canUpload = validateUpload(selectedFile.size);
    
    if (!canUpload) return; 

    await startUpload(token);
    
    refreshStorage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <UserHeader name="Pedro Vazques" role="Analista de datos" type="Usuario" />
      
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <CloudSelector selectedCloud={selectedCloud} onChange={setSelectedCloud} />
        <FileSelector selectedFile={selectedFile} onSelect={setSelectedFile} />
        <UploadOptions
          destFolder={destFolder}
          onFolderChange={setDestFolder}
          overwrite={overwrite}
          onOverwriteChange={setOverwrite}
        />
        <UploadProgress progress={progress} />
        
        <UploadActions
          onUpload={handleUploadClick} 
          onCancel={cancel}
          disabled={!selectedFile || progress > 0}
        />
      </main>
    </div>
  )
}

export default Uploadfiles;