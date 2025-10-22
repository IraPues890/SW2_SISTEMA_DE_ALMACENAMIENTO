import React from 'react';

export default function ExplorerLayout({ activeView, children }) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
      {children}
    </div>
  );
}
