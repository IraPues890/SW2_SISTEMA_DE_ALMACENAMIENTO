import React from 'react';
import { Metrics } from './Metrics';
import { ViewSwitch } from './ViewComponents';

// AHORA: Solo recibe las props que SÍ utiliza.
export default function HeaderBar({
  filesCount,
  breadcrumbString,
  activeView,
  setActiveView,
}) {
  return (
    <>
      {/* Metrics usa filesCount y breadcrumbString */}
      <Metrics totalFiles={filesCount} usedSpace={'1.2 GB'} breadcrumb={breadcrumbString} />
      
      {/* ViewSwitch usa activeView y setActiveView */}
      <ViewSwitch activeView={activeView} onChange={setActiveView} />
    </>
  );
}