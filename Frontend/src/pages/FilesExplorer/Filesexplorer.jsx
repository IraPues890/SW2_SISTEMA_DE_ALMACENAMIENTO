import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFiles } from './hooks/useFiles';
import { UserHeader } from './components/UserHeader';
import { FileActions } from './components/FileActions';
import SearchSortControls from './components/SearchSortControls';
import { ViewContent } from './components/ViewComponents';
import ConfirmDialog from './components/ConfirmDialog';
import CreateFolderModal from './components/CreateFolderModal';
import FileTable from './components/FileTable';
import FilePreview from './components/FilePreview';
import HeaderBar from './components/HeaderBar';
import ExplorerLayout from './components/ExplorerLayout';
import createFileOperations from './services/FileOperations';

// Hooks
import { useFileSelection } from './hooks/useFileSelection';
import { useCreateFolder } from './hooks/useCreateFolder';
import { useDeleteConfirmation } from './hooks/useDeleteConfirmation';


export default function Filesexplorer() {
  const navigate = useNavigate();

  const {
    files, addFile, query, setQuery, sortOption, setSortOption,
    currentFolderId, setCurrentFolderId, page, setPage,
    pageItems, totalPages, sortedFiltered, breadcrumbString,
    deleteFiles
  } = useFiles();

  const [activeView, setActiveView] = useState('table');

  const {
    selectedFile,
    setSelectedFile,
    selectedFileIds,
    handleToggleSelection,
    resetSelection
  } = useFileSelection();

  const {
    isCreateOpen,
    openCreateFolder,
    createFolderModalProps
  } = useCreateFolder({
    files, currentFolderId, addFile, setCurrentFolderId, setSelectedFile
  });

  const {
    isDeleteConfirmOpen,
    requestDeletion,
    deleteConfirmDialogProps
  } = useDeleteConfirmation({
    deleteFn: deleteFiles, // Inyectamos la función de borrado
    onDeleteSuccess: () => {
      resetSelection(); // Limpiamos selección al borrar
      setPage(1);
    }
  });

  const fileOps = useMemo(() => createFileOperations({ deleteFn: deleteFiles, getFiles: () => files }), [deleteFiles, files]);

  // Funciones compuestas que unen navegación, selección y paginación
  const resetSelectionAndPage = () => {
    resetSelection();
    setPage(1);
  };

  const goToFolderId = (id) => {
    setCurrentFolderId(id ?? null);
    resetSelectionAndPage();
  };

  const openSidePreview = (f) => {
    if (!f) return;
    if (f.type === 'folder') {
      setCurrentFolderId(f.id);
      resetSelectionAndPage();
      return;
    }
    setSelectedFile(f);
  };

  const handleDownloadSelected = (fileIds) => {
    let idsToDownload = [];
    if (Array.isArray(fileIds) && fileIds.length) idsToDownload = fileIds;
    else if (fileIds) idsToDownload = [fileIds];
    else if (selectedFileIds && selectedFileIds.length) idsToDownload = selectedFileIds;
    else idsToDownload = sortedFiltered.filter(f => f.type !== 'folder').map(f => f.id);

    if (!idsToDownload || idsToDownload.length === 0) {
      alert('No hay archivos disponibles para descargar.');
      return;
    }

    console.debug('[Filesexplorer] downloading ids:', idsToDownload);
    fileOps.download(idsToDownload);
  };

  const previewUrl = useMemo(() => {
    if (!selectedFile || !selectedFile.URL) return null;
    const url = selectedFile.URL;
    if (url.includes('docs.google.com')) return url.replace('/edit', '/preview');
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.split('/d/')[1].split('/')[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  }, [selectedFile]);

  const fileActionsList = [
    { key: 'upload', icon: '📤', text: 'Subir archivo',     color: 'bg-gradient-to-r from-green-600 to-emerald-700', onClick: () => navigate('/upload') },
    { key: 'download', icon: '📥', text: 'Descargar archivo', color: 'bg-gradient-to-r from-blue-600 to-cyan-700', onClick: handleDownloadSelected },
    { key: 'delete', icon: '🗑️', text: 'Eliminar archivo', color: 'bg-gradient-to-r from-red-600 to-rose-700', onClick: () => requestDeletion(selectedFileIds) },
    { key: 'new-folder', icon: '➕', text: 'Crear carpeta',   color: 'bg-gradient-to-r from-yellow-600 to-orange-700', onClick: openCreateFolder },
    // { key: 'organize', icon: '📂', text: 'Organizar carpetas', color: 'bg-gradient-to-r from-purple-600 to-indigo-700' } // Ahora aquí añadimos cualquier acción
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
      <UserHeader name="Pedro Vazques" role="Analista de datos" type="Usuario" />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <HeaderBar
          filesCount={files.length}
          breadcrumbString={breadcrumbString}
          activeView={activeView}
          setActiveView={setActiveView}
        />

        <div className="mb-6">
          <FileActions
            actions={fileActionsList} // Pasamos el array de acciones
            controls={<SearchSortControls query={query} setQuery={setQuery} sortOption={sortOption} setSortOption={setSortOption} setPage={setPage} />}
          />
        </div>

        <ExplorerLayout activeView={activeView}>
          {activeView === 'table' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <FileTable
                pageItems={pageItems}
                selectedFile={selectedFile}
                selectedFileIds={selectedFileIds}
                handleToggleSelection={handleToggleSelection}
                openSidePreview={openSidePreview}
                setPage={setPage}
                page={page}
                totalPages={totalPages}
                sortedFiltered={sortedFiltered} // Usado para "Mostrando X de Y"
              />
              <FilePreview
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                handleDownloadSelected={handleDownloadSelected}
                setSelectedFile={setSelectedFile} // Para el botón 'x' de cerrar
              />
            </div>
          ) : (
            <ViewContent
              activeView={activeView}
              files={sortedFiltered}
              onOpen={openSidePreview}
              selectedFileIds={selectedFileIds}
              onToggleSelection={handleToggleSelection}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              filteredCount={sortedFiltered.length}
            />
          )}
        </ExplorerLayout>
      </div>

      {/* Los modales ahora reciben sus props directamente desde los hooks */}
      <CreateFolderModal {...createFolderModalProps} />
      <ConfirmDialog {...deleteConfirmDialogProps} />
    </div>
  );
}