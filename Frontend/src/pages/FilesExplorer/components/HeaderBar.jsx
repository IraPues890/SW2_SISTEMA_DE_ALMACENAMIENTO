import React from 'react';
import { Metrics } from './Metrics';
import { ViewSwitch } from './ViewComponents';
import { useStorage } from '../../../context/StorageContext'; 

export default function HeaderBar({ breadcrumbString, activeView, setActiveView, isAdmin }) { 
  
  const { usedKB, limitKB, updateLimit } = useStorage();

  const format = (kb) => {
    if (kb > 1024 * 1024) return `${(kb / (1024*1024)).toFixed(2)} GB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleEditLimit = () => {
    
    const input = prompt("Nuevo límite máximo en MB:", (limitKB/1024).toFixed(0));
    if (input && !isNaN(input)) {
      updateLimit(parseFloat(input));
    }
  };

  return (
    <>
      <Metrics 
        usedSpace={`${format(usedKB)} / ${format(limitKB)}`} 
        breadcrumb={breadcrumbString}
        canEdit={true} 
        onEditStorage={handleEditLimit}
        usagePercentage={(usedKB / limitKB) * 100}
      />
      
      <ViewSwitch activeView={activeView} onChange={setActiveView} />
    </>
  );
}