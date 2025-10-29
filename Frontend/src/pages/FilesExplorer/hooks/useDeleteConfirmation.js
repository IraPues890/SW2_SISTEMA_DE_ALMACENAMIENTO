import { useState, useRef } from 'react';
import FileDeletionCommand from '../services/FileDeletionCommand';

/**
 * Gestiona la lógica y el estado del diálogo de confirmación de borrado.
 */
export function useDeleteConfirmation({ deleteFn, onDeleteSuccess }) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [toDeleteIds, setToDeleteIds] = useState([]);
  const deletionCommandRef = useRef(null);

  const requestDeletion = (ids) => {
    const effectiveIds = Array.isArray(ids) ? ids : [ids];
    if (!effectiveIds || effectiveIds.length === 0) {
      alert('Seleccionar al menos un archivo para eliminar');
      return;
    }
    setToDeleteIds(effectiveIds);
    // Inyectamos la dependencia de la función de borrado al crear el comando
    deletionCommandRef.current = new FileDeletionCommand(deleteFn);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setToDeleteIds([]);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deletionCommandRef.current) {
        await deletionCommandRef.current.execute(toDeleteIds);
      } else {
        // Fallback por si acaso
        await deleteFn(toDeleteIds);
      }
    } catch (err) {
      console.error('Error deleting files:', err);
    } finally {
      closeDeleteConfirm();
      onDeleteSuccess?.(); // Llama al callback (ej. resetSelection)
    }
  };

  return {
    isDeleteConfirmOpen,
    requestDeletion,
    deleteConfirmDialogProps: {
      isOpen: isDeleteConfirmOpen,
      title: '¿Seguro que quieres eliminar?',
      message: 'Esta acción eliminará los archivos seleccionados. ¿Deseas continuar?',
      onCancel: closeDeleteConfirm,
      onConfirm: handleConfirmDelete,
      confirmText: 'Sí, eliminar',
      cancelText: 'No'
    }
  };
}