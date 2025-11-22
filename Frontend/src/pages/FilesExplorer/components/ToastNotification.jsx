import React, { useEffect } from 'react';

export default function ToastNotification({ message, type = 'error', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000); // Desaparece a los 4 seg
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    error: 'bg-red-600 border-red-700',
    success: 'bg-green-600 border-green-700',
    info: 'bg-blue-600 border-blue-700'
  };

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white border-b-4 animate-bounce-in ${colors[type] || colors.info}`}>
      <span className="text-2xl">{type === 'error' ? '🚫' : '✅'}</span>
      <div>
        <p className="font-bold uppercase text-xs opacity-80">{type}</p>
        <p className="font-medium">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">✖</button>
    </div>
  );
}