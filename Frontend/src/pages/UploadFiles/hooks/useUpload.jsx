import { useState, useRef } from 'react'

export default function useUpload(initial = {}) {
  const [selectedFile, setSelectedFile] = useState(initial.selectedFile || null)
  const [destFolder, setDestFolder] = useState(initial.destFolder || 'Raíz > Proyectos')
  const [overwrite, setOverwrite] = useState(initial.overwrite || false)
  const [selectedCloud, setSelectedCloud] = useState(initial.selectedCloud || 'aws');
  const [progress, setProgress] = useState(0)
  const uploadIntervalRef = useRef(null)

  const startUpload = () => {
    setProgress(0)
    if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current)
    uploadIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadIntervalRef.current)
          uploadIntervalRef.current = null
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const cancel = () => {
    setSelectedFile(null)
    setProgress(0)
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current)
      uploadIntervalRef.current = null
    }
  }

  return {
    selectedFile, setSelectedFile,
    destFolder, setDestFolder,
    overwrite, setOverwrite,
    selectedCloud, setSelectedCloud,
    progress, setProgress,
    startUpload,
    cancel
  }
}
