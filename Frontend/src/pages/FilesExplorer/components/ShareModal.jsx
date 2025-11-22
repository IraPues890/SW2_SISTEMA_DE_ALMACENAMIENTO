import React, { useState } from 'react';
import { shareFolder, listShared, revokeShare } from '../services/apiServices';

export default function ShareModal({ folderId, open, onClose }) {
  const [email, setEmail] = useState('');
  const [sharedList, setSharedList] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (open) {
      // cargar lista de compartidos
      listShared(folderId).then(r => {
        if (r && r.data) setSharedList(r.data);
      }).catch(() => {});
    }
  }, [open, folderId]);

  const handleShare = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await shareFolder(folderId, email);
      setEmail('');
      const updated = await listShared(folderId);
      if (updated && updated.data) setSharedList(updated.data);
    } catch (err) {
      console.error('Error sharing:', err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (shareId) => {
    try {
      await revokeShare(folderId, shareId);
      const updated = await listShared(folderId);
      if (updated && updated.data) setSharedList(updated.data);
    } catch (err) {
      console.error('Error revoke:', err.message || err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-3">Compartir carpeta</h3>
        <div className="mb-3">
          <input
            className="border px-2 py-1 w-full"
            placeholder="Email del usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 mb-4">
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleShare} disabled={loading}>
            {loading ? 'Compartiendo...' : 'Compartir'}
          </button>
          <button className="bg-gray-200 px-3 py-1 rounded" onClick={onClose}>Cerrar</button>
        </div>

        <div>
          <h4 className="font-medium mb-2">Compartido con</h4>
          <ul className="space-y-2 max-h-40 overflow-auto">
            {sharedList.length === 0 && <li className="text-sm text-slate-500">No hay usuarios</li>}
            {sharedList.map(p => (
              <li key={p.id} className="flex justify-between items-center text-sm">
                <span>{p.usuario_id ? `Usuario ${p.usuario_id}` : p.usuario?.email || 'Desconocido'}</span>
                <button className="text-red-600 text-xs" onClick={() => handleRevoke(p.id)}>Revocar</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
