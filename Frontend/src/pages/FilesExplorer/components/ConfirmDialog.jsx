import React from 'react';

export function ConfirmDialog({ title = 'Confirmar', message = '', isOpen, onCancel, onConfirm, confirmText = 'Sí', cancelText = 'No' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="bg-white rounded-xl p-6 z-10 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">{cancelText}</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
