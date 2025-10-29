import { useState } from 'react';

/**
 * Gestiona el estado de la selección de archivos (para preview y para acciones).
 */
export function useFileSelection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileIds, setSelectedFileIds] = useState([]);

  const handleToggleSelection = (fileId) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setSelectedFileIds([]);
  };

  return {
    selectedFile,
    setSelectedFile,
    selectedFileIds,
    setSelectedFileIds,
    handleToggleSelection,
    resetSelection
  };
}