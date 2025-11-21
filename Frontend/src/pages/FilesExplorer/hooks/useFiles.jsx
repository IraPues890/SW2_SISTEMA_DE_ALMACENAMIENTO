import { useState, useMemo, useEffect, useCallback } from 'react';
import { SORT_OPTIONS_CONFIG, DEFAULT_SORT_OPTION } from '../config/SortOptions';
import { getAllFiles, deleteFilesBatch } from '../services/apiServices';

function transformApiData(apiData) {
    const allFiles = apiData.objects.flatMap(bucketData => {
        return bucketData.objects.map(item => {
            const { fileName, size, lastModified, cloud } = item;

            // Partes de la ruta, eliminando strings vacíos
            const parts = fileName.split('/').filter(p => p.length > 0);

            let name = parts[parts.length - 1] || fileName;
            let parentId = null;

            if (parts.length > 1) {
                const parentParts = parts.slice(0, parts.length - 1);
                parentId = parentParts.join('/') + '/';
            }

            return {
                id: fileName,
                name: name,
                parentId: parentId,
                size: (size / 1024).toFixed(0), // Esto dará KB
                date: new Date(lastModified).toLocaleDateString('es-PE'),
                URL: null,
                cloud: cloud
            };
        });
    });

    return allFiles;
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
            const apiData = await getAllFiles();
            console.log(apiData);
            const transformedData = transformApiData(apiData);
            console.log(transformedData);
            setFiles(transformedData);
        } catch (err) {
            setError(err.message || 'Error al cargar los archivos');
            setFiles([]);
        } finally {
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
        return items.filter(f => f.name.toLowerCase().includes(q) || f.name.toLowerCase().includes(q));
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

    const deleteFiles = useCallback(async (ids) => {
        const idSet = new Set(Array.isArray(ids) ? ids : [ids]);

        const filesToProcess = files.filter(f => idSet.has(f.id));

        const payload = filesToProcess.map(f => ({
            fileName: f.id,
            provider: f.cloud 
        }));

        if (payload.length === 0) {
            console.warn("No se encontraron archivos para los IDs seleccionados.");
            return; 
        }

        try {
            const report = await deleteFilesBatch(payload);

            const successfulDeletes = new Set();
            const failedReport = [];

            report.forEach(r => {
                if (r.status === 'deleted') {
                    successfulDeletes.add(r.fileName);
                } else {
                    failedReport.push(r);
                }
            });

            setFiles(currentFiles =>
                currentFiles.filter(f => !successfulDeletes.has(f.id))
            );

            if (failedReport.length > 0) {
                console.error("Fallaron algunas eliminaciones:", failedReport);
                setError(`No se pudieron eliminar ${failedReport.length} archivos.`);
            } else {
                setError(null); 
            }

        } catch (error) {
            console.error("Error en la operación de borrado:", error);
            setError(error.message || "Error fatal en el borrado.");
            throw error;
        }
    }, [files, setError]);

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