import { useState, useMemo, useEffect } from 'react'

export default function useFiles(initialFiles = []) {
  const [files, setFiles] = useState(initialFiles)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 5
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return files
    return files.filter(f => f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q))
  }, [files, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage)

  useEffect(() => {
    if (files && files.length > 0) {
      if (!selectedFile) openSidePreview(files[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  function openSidePreview(f) {
    setSelectedFile(f)
    setSelectedPreviewUrl(f.url ?? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')
  }

  function closeSidePreview() {
    setSelectedFile(null)
    setSelectedPreviewUrl(null)
  }

  return {
    files, setFiles,
    query, setQuery,
    page, setPage,
    perPage,
    filtered, totalPages, pageItems,
    selectedFile, selectedPreviewUrl, openSidePreview, closeSidePreview
  }
}
