import { useState } from 'react';

/**
 * Gestiona la lógica y el estado del modal de creación de carpetas.
 */
export function useCreateFolder({
  files,
  currentFolderId,
  addFile,
  setCurrentFolderId,
  setSelectedFile
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const openCreateFolder = () => setIsCreateOpen(true);
  const closeCreateFolder = () => setIsCreateOpen(false);

  const validateFolderName = (raw) => {
    const name = (raw || '').trim();
    if (!name) return 'Escribe un nombre.';
    if (!/^[\w\-\s]{1,64}$/.test(name)) return 'Usa letras, números, espacios o guiones (máx. 64).';
    const dup = files.some((f) => (
      (f.type === 'folder') &&
      (f.name.toLowerCase() === name.toLowerCase()) &&
      ((f.parentId ?? null) === currentFolderId)
    ));
    if (dup) return 'Ya existe una carpeta con ese nombre en esta ubicación.';
    return null;
  };

  const handleConfirmCreateFolder = (name) => {
    const newFolder = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name,
      size: '0',
      date: new Date().toLocaleDateString('es-PE'),
      type: 'folder',
      parentId: currentFolderId ?? null,
    };
    addFile(newFolder);
    setCurrentFolderId(newFolder.id); // Navega a la nueva carpeta
    setSelectedFile(newFolder);      // La selecciona en la vista previa
    setIsCreateOpen(false);
  };

  return {
    isCreateOpen,
    openCreateFolder,
    createFolderModalProps: {
      isOpen: isCreateOpen,
      onClose: closeCreateFolder,
      onCreate: handleConfirmCreateFolder,
      validateName: validateFolderName
    }
  };
}