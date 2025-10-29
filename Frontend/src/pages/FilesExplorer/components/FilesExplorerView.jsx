import React from 'react';
import FileTable from './FileTable';
import FilePreview from './FilePreview';
import ExplorerLayout from './ExplorerLayout';

export default function FilesExplorerView({ props }) {
  const {
    activeView, pageItems, selectedFile, selectedFileIds, handleToggleSelection,
    openSidePreview, setPage, page, totalPages, sortedFiltered, previewUrl,
    handleDownloadSelected, setSelectedFile, onToggleSelection
  } = props;

  return (
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
        <div>
          {/* fallback view content */}
        </div>
      )}
    </ExplorerLayout>
  );
}
