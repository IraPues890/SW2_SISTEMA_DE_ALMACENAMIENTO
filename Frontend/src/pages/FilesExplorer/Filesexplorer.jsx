import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFiles } from './hooks/useFiles';
import { UserHeader } from './components/UserHeader';
import { Metrics } from './components/Metrics';
import { FileActions } from './components/FileActions';
import SearchSortControls from './components/SearchSortControls';
import { ViewSwitch, ViewContent, VIEWS } from './components/ViewComponents';
import ConfirmDialog from './components/ConfirmDialog';
import FileDeletionCommand from './services/FileDeletionCommand';
import CreateFolderModal from './components/CreateFolderModal';
import FileTable from './components/FileTable';
import FilePreview from './components/FilePreview';
import HeaderBar from './components/HeaderBar';
import ExplorerLayout from './components/ExplorerLayout';
import createFileOperations from './services/FileOperations';
import FilesExplorerView from './components/FilesExplorerView';

// Recreated clean Filesexplorer component after previous duplicated/merged edits.
// Keeps behavior: selection, preview, create folder modal and delete-confirm using Command pattern.
export default function Filesexplorer() {
  const navigate = useNavigate();
  const {
    files, addFile, query, setQuery, sortOption, setSortOption,
    currentFolderId, setCurrentFolderId, page, setPage,
    pageItems, totalPages, sortedFiltered, breadcrumbNodes, breadcrumbString,
    deleteFiles
  } = useFiles();

  const [activeView, setActiveView] = useState('table');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [toDeleteIds, setToDeleteIds] = useState([]);
  const deletionCommandRef = useRef(null);

  const handleToggleSelection = (fileId) => {
    setSelectedFileIds((prev) => prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]);
  };

  const enterFolder = (folder) => {
    setCurrentFolderId(folder.id);
    resetSelectionAndPage();
  };

  const goToFolderId = (id) => {
    setCurrentFolderId(id ?? null);
    resetSelectionAndPage();
  };

  const resetSelectionAndPage = () => {
    setSelectedFile(null);
    setPage(1);
    setSelectedFileIds([]);
  };

  const openSidePreview = (f) => {
    if (!f) return;
    if (f.type === 'folder') {
      enterFolder(f);
      return;
    }
    setSelectedFile(f);
  };

  // Memoize file operations so we reuse the same object and don't recreate factory every call
  const fileOps = useMemo(() => createFileOperations({ deleteFn: deleteFiles, getFiles: () => files }), [deleteFiles, files]);

  const handleDownloadSelected = (fileIds) => {
    // Resolve ids: prefer explicit argument, then selected files, then visible list
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

  const handleDeleteSelected = (fileIds) => {
    const ids = Array.isArray(fileIds) ? fileIds : selectedFileIds;
    if (!ids || ids.length === 0) {
      alert('Seleccionar al menos un archivo para eliminar');
      return;
    }
    setToDeleteIds(ids);
    deletionCommandRef.current = new FileDeletionCommand(fileOps.delete);
    setIsDeleteConfirmOpen(true);
  };

  const validateFolderName = (raw) => {
    const name = (raw || '').trim();
    if (!name) return 'Escribe un nombre.';
    if (!/^[\w\-\s]{1,64}$/.test(name)) return 'Usa letras, números, espacios o guiones (máx. 64).';
    const dup = files.some((f) => (f.type === 'folder') && (f.name.toLowerCase() === name.toLowerCase()) && ((f.parentId ?? null) === currentFolderId));
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
    setCurrentFolderId(newFolder.id);
    setSelectedFile(newFolder);
    setIsCreateOpen(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
      <UserHeader name="Pedro Vazques" role="Analista de datos" type="Usuario" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <HeaderBar
          filesCount={files.length}
          breadcrumbString={breadcrumbString}
          activeView={activeView}
          setActiveView={setActiveView}
          query={query}
          setQuery={setQuery}
          sortOption={sortOption}
          setSortOption={setSortOption}
          setPage={setPage}
          onCreateFolder={() => setIsCreateOpen(true)}
          onUploadFile={() => navigate('/upload')}
          onDownloadSelected={handleDownloadSelected}
          onDeleteSelected={handleDeleteSelected}
          navigate={navigate}
        />

        {/* Actions row: search/sort controls + actions card (full width) */}
        <div className="mb-6">
          <FileActions
            onCreateFolder={() => setIsCreateOpen(true)}
            onUploadFile={() => navigate('/upload')}
            onDownloadSelected={handleDownloadSelected}
            onDeleteSelected={handleDeleteSelected}
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
                sortedFiltered={sortedFiltered}
              />
              <FilePreview selectedFile={selectedFile} previewUrl={previewUrl} handleDownloadSelected={handleDownloadSelected} setSelectedFile={setSelectedFile} />
            </div>
          ) : (
            <ViewContent activeView={activeView} files={sortedFiltered} onOpen={openSidePreview} selectedFileIds={selectedFileIds} onToggleSelection={handleToggleSelection} />
          )}
        </ExplorerLayout>
      </div>

      <CreateFolderModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreate={handleConfirmCreateFolder} validateName={validateFolderName} />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="¿Seguro que quieres eliminar?"
        message="Esta acción eliminará los archivos seleccionados. ¿Deseas continuar?"
        onCancel={() => { setIsDeleteConfirmOpen(false); setToDeleteIds([]); }}
        onConfirm={async () => {
          try {
            if (deletionCommandRef.current) {
              await deletionCommandRef.current.execute(toDeleteIds);
            } else {
              await deleteFiles(toDeleteIds);
            }
          } catch (err) {
            console.error('Error deleting files:', err);
          } finally {
            setIsDeleteConfirmOpen(false);
            setToDeleteIds([]);
            setSelectedFileIds([]);
          }
        }}
        confirmText="Sí, eliminar"
        cancelText="No"
      />
    </div>
  );
}