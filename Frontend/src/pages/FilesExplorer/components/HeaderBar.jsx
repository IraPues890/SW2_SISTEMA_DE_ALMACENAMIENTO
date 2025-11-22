import React, { useMemo } from 'react';
import { Metrics } from './Metrics';
import { ViewSwitch } from './ViewComponents';

export default function HeaderBar({
  files = [], 
  filesCount,
  breadcrumbString,
  activeView,
  setActiveView,
}) {

  const usedSpace = useMemo(() => {
    if (!files || files.length === 0) return '0 KB';

    const totalKB = files.reduce((acc, file) => {
      const sizeNum = parseFloat(file.size) || 0; 
      return acc + sizeNum;
    }, 0);

    if (totalKB < 1024) {
      return `${totalKB.toFixed(1)} KB`;
    }

    const totalMB = totalKB / 1024;
    if (totalMB < 1024) {
      return `${totalMB.toFixed(2)} MB`;
    }

    const totalGB = totalMB / 1024;
    return `${totalGB.toFixed(2)} GB`;

  }, [files]); 

  return (
    <>
      <Metrics 
        totalFiles={filesCount} 
        usedSpace={usedSpace} 
        breadcrumb={breadcrumbString} 
      />
      
      <ViewSwitch activeView={activeView} onChange={setActiveView} />
    </>
  );
}