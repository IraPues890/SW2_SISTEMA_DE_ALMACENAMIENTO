import useUpload from './hooks/useUpload'
import UserHeader from './components/UserHeader'
import FileSelector from './components/FileSelector'
import UploadOptions from './components/UploadOptions'
import UploadProgress from './components/UploadProgress'
import UploadActions from './components/UploadActions'

function Uploadfiles() {
  const { selectedFile, setSelectedFile, destFolder, setDestFolder, overwrite, setOverwrite, progress, startUpload, cancel } = useUpload()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <UserHeader name="Pedro Vazques" role="Analista de datos" type="Usuario" />
      
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <FileSelector selectedFile={selectedFile} onSelect={setSelectedFile} />
        <UploadOptions
          destFolder={destFolder}
          onFolderChange={setDestFolder}
          overwrite={overwrite}
          onOverwriteChange={setOverwrite}
        />
        <UploadProgress progress={progress} />
        <UploadActions
          onUpload={startUpload}
          onCancel={cancel}
          disabled={!selectedFile || progress > 0}
        />
      </main>
    </div>
  )
}

export default Uploadfiles;