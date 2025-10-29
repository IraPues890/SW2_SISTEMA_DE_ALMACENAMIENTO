import { useState, useMemo, useEffect, useCallback } from 'react';
import { SORT_OPTIONS_CONFIG, DEFAULT_SORT_OPTION } from '../config/SortOptions';
import { getFiles } from '../services/apiServices';

function transformApiData(apiData) {
  const getFileType = (key, size) => {
    if (key.endsWith('/') && size === 0) return 'folder';
    const extension = key.split('.').pop();
    if (extension === key || !extension) return 'file'; // Sin extensión
    return extension.toLowerCase();
  };

  return apiData.map(item => {
    const { Key, Size, LastModified } = item;
    const type = getFileType(Key, Size);

    // Partes de la ruta, eliminando strings vacíos (ej. del slash final)
    const parts = Key.split('/').filter(p => p.length > 0);

    let name = parts[parts.length - 1] || Key; // El último segmento
    let parentId = null;

    if (parts.length > 1) {
      // Si hay más de un segmento (ej. ['carpeta', 'archivo.pdf']), tiene padre
      const parentParts = parts.slice(0, parts.length - 1);
      parentId = parentParts.join('/') + '/'; // Reconstruir la ruta padre
    }

    return {
      id: Key,
      name: name,
      parentId: parentId, // <-- null si parts.length <= 1
      size: (Size / 1024).toFixed(0),
      date: new Date(LastModified).toLocaleDateString('es-PE'),
      type: type,
      URL: null,
    };
  });
}

export function useFiles() {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [query, setQuery] = useState('');
    const [sortOption, setSortOption] = useState(DEFAULT_SORT_OPTION); 
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [page, setPage] = useState(1);
    const perPage = 5;

    const refetchFiles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const apiData = await getFiles(); 
            const transformedData = transformApiData(apiData);
            setFiles(transformedData);
        } catch (err) {
            console.error('[useFiles] 4. CATCH: Error capturado!', err.message);
            setError(err.message || 'Error al cargar los archivos');
            setFiles([]);
        } finally {
            console.log('[useFiles] 5. FINALLY: Limpiando carga.');
            setIsLoading(false);
        }
    }, []); // Ya no depende de currentFolderId, siempre trae todo
    
    useEffect(() => {
        refetchFiles();
    }, [refetchFiles]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let items = files.filter(f => (f.parentId ?? null) === currentFolderId);
        if (!q) return items;
        return items.filter(f => f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q));
    }, [files, query, currentFolderId]); // <-- Añadida dependencia de currentFolderId

    const sortedFiltered = useMemo(() => {
        const items = [...(filtered ?? [])];
        if (!items.length) return items;
        const sortFunction = SORT_OPTIONS_CONFIG[sortOption]?.fn;
        if (typeof sortFunction === 'function') {
            items.sort(sortFunction);
        }
        
        return items;
    }, [filtered, sortOption]);

    const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / perPage));
    const pageItems = sortedFiltered.slice((page - 1) * perPage, page * perPage);

    const breadcrumbNodes = useMemo(() => {
        const nodes = [];
        let id = currentFolderId;
        while (id != null) {
            const node = files.find(f => f.id === id); // Busca en la lista completa
            if (!node) break;
            nodes.push(node);
            id = node.parentId ?? null;
        }
        return nodes.reverse();
    }, [currentFolderId, files]);

    const breadcrumbString = useMemo(() => {
        if (!breadcrumbNodes.length) return 'Raíz';
        return 'Raíz > ' + breadcrumbNodes.map(n => n.name).join(' > ');
    }, [breadcrumbNodes]);

    const addFile = (file) => {
        setFiles(prev => [file, ...prev]);
    };

    const deleteFiles = (ids) => {
        const idSet = Array.isArray(ids) ? ids : [ids];
        setFiles(prev => prev.filter(f => !idSet.includes(f.id)));
    };

return {
        files,
        isLoading,
        error,
        refetchFiles,
        addFile,
        deleteFiles,
        query,
        setQuery,
        sortOption,
        setSortOption,
        currentFolderId,
        setCurrentFolderId,
        page,
        setPage,
        perPage,
        pageItems, 
        totalPages,
        sortedFiltered,
        breadcrumbNodes,
        breadcrumbString
    };
}