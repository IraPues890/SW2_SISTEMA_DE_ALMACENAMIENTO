import { useState, useRef } from 'react'

export default function useUpload(initial = {}) {
  const [selectedFile, setSelectedFile] = useState(initial.selectedFile || null)
  const [destFolder, setDestFolder] = useState(initial.destFolder || 'Raíz > Proyectos')
  const [overwrite, setOverwrite] = useState(initial.overwrite || false)
  const [selectedCloud, setSelectedCloud] = useState(initial.selectedCloud || 'aws');
  const [progress, setProgress] = useState(0)
  const xhrRef = useRef(null)

  const startUpload = async (authToken) => {
    if (!selectedFile) return
    setProgress(0)

    try {
        if (selectedCloud === 'aws') {
          // 1) ask backend for presigned URL
          const key = `${Date.now()}-${selectedFile.name}`
          const params = new URLSearchParams({ key, contentType: selectedFile.type })
          const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
          const presignEndpoint = `${API_BASE}/api/files/s3-presign?${params.toString()}`
          console.log('[upload] requesting presign URL from', presignEndpoint)
          const presignRes = await fetch(presignEndpoint, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${authToken}` }
          })

          // better error handling: if backend returns HTML (vite index) or non-JSON, show body
          if (!presignRes.ok) {
            const txt = await presignRes.text().catch(() => null)
            console.error('[upload] presign request failed', presignRes.status, txt)
            throw new Error(txt || `Presign request failed with status ${presignRes.status}`)
          }

          let presignJson
          try {
            presignJson = await presignRes.json()
          } catch (e) {
            const txt = await presignRes.text().catch(() => null)
            console.error('[upload] presign response is not JSON:', txt)
            throw new Error('Presign response is not valid JSON')
          }

          if (!presignJson.success) throw new Error(presignJson.message || 'Presign failed')

          const url = presignJson.url

          console.log('[upload] got presigned URL, starting PUT to S3')

          // 2) upload file directly to S3 with progress
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhrRef.current = xhr
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100))
            }
          })
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setProgress(100)
              resolve(true)
            } else {
              reject(new Error('Upload failed with status ' + xhr.status))
            }
          })
          xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
          xhr.open('PUT', url)
          xhr.setRequestHeader('Content-Type', selectedFile.type)
          xhr.send(selectedFile)
        })

      } else {
        // Fallback: upload via backend multipart/form-data
        const form = new FormData()
        form.append('file', selectedFile)
        form.append('provider', selectedCloud)
        if (destFolder) form.append('carpeta_id', destFolder)

        const res = await fetch('/api/files/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` },
          body: form
        })
        if (!res.ok) {
          const j = await res.json().catch(()=>({message:'upload failed'}))
          throw new Error(j.message || 'Upload failed')
        }
        setProgress(100)
      }

    } catch (err) {
      console.error('Upload error', err)
      setProgress(0)
      throw err
    } finally {
      xhrRef.current = null
    }
  }

  const cancel = () => {
    if (xhrRef.current) {
      try { xhrRef.current.abort() } catch (e) {}
      xhrRef.current = null
    }
    setSelectedFile(null)
    setProgress(0)
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
