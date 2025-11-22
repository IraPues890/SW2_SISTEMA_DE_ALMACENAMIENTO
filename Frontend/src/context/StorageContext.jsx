import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { getAllFiles } from '../pages/FilesExplorer/services/apiServices'; 
import ToastNotification from '../pages/FilesExplorer/components/ToastNotification';

const StorageContext = createContext();

const DEFAULT_LIMIT_KB = 200 * 1024; 

export function StorageProvider({ children }) {
  const [files, setFiles] = useState([]);
  const [limitKB, setLimitKB] = useState(DEFAULT_LIMIT_KB); 
  const [toast, setToast] = useState(null);

  const refreshStorage = async () => {
    try {
      const apiData = await getAllFiles();
      const allFiles = apiData.objects.flatMap(bucket => 
        bucket.objects.map(item => ({
          size: (item.size / 1024).toFixed(2), // KB
        }))
      );
      setFiles(allFiles);
    } catch (error) {
      console.error("Error calculando almacenamiento:", error);
    }
  };

  useEffect(() => {
    refreshStorage();
  }, []);

  const usedKB = useMemo(() => {
    return files.reduce((acc, f) => acc + (parseFloat(f.size) || 0), 0);
  }, [files]);

  const validateUpload = (fileSizeBytes) => {
    const fileSizeKB = fileSizeBytes / 1024;
    
    if (usedKB + fileSizeKB > limitKB) {
      const exceso = ((usedKB + fileSizeKB) - limitKB) / 1024; 
      setToast({
        message: `¡Espacio insuficiente! Excederías el límite por ${exceso.toFixed(2)} MB.`,
        type: 'error'
      });
      return false; 
    }
    return true; 
  };

  const updateLimit = (newLimitMB) => {
    setLimitKB(newLimitMB * 1024);
    setToast({ message: `Límite actualizado a ${newLimitMB} MB`, type: 'success' });
  };

  return (
    <StorageContext.Provider value={{ 
      usedKB, 
      limitKB, 
      validateUpload, 
      updateLimit, 
      refreshStorage 
    }}>
      {children}
      {toast && <ToastNotification {...toast} onClose={() => setToast(null)} />}
    </StorageContext.Provider>
  );
}

export const useStorage = () => useContext(StorageContext);