import React from 'react';
import { Metrics } from './Metrics';
import { ViewSwitch } from './ViewComponents';

export default function HeaderBar({
  filesCount,
  breadcrumbString,
  activeView,
  setActiveView,
  query,
  setQuery,
  sortOption,
  setSortOption,
  setPage,
  onCreateFolder,
  onUploadFile,
  onDownloadSelected,
  onDeleteSelected,
  navigate,
}) {
  return (
    <>
      <Metrics totalFiles={filesCount} usedSpace={'1.2 GB'} breadcrumb={breadcrumbString} />
      <ViewSwitch activeView={activeView} onChange={setActiveView} />
    </>
  );
}
