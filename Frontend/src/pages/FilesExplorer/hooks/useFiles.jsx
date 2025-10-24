import { useState, useMemo } from 'react';
import { SORT_OPTIONS_CONFIG, DEFAULT_SORT_OPTION } from '../config/SortOptions';

const demoFiles = [
    { id: 1, name: 'informe2025.pdf', size: '2300', date: '30/09/2025', type: 'pdf', parentId: null, URL: 'https://drive.google.com/file/d/1b6ZAymwziRp62wUPJygTsMMGdfbjH9oB/view?usp=sharing' },
    { id: 2, name: 'reporte_ventas.xlsx', size: '1200', date: '29/09/2025', type: 'xlsx', parentId: null, URL: 'https://docs.google.com/spreadsheets/d/1k02PRDG5DW_sGh1iM4vryIgMdrbO5JAt/edit?usp=sharing&ouid=100955731275521423402&rtpof=true&sd=true' },
    { id: 3, name: 'datos_clientes.csv', size: '800', date: '28/09/2025', type: 'csv', parentId: null, URL: 'https://drive.google.com/file/d/1EsLOeRZdm1sjZKWH2Va_OKA02JmYJVW7/view?usp=sharing' },
    { id: 4, name: 'grafico_anual.png', size: '500', date: '27/09/2025', type: 'png', parentId: null, URL: 'https://drive.google.com/file/d/1LqTRDDGHyCQcyELh_SCWnY2g11xmK1Co/view?usp=sharing' },
    { id: 5, name: 'presentacion.pptx', size: '4500', date: '25/09/2025', type: 'pptx', parentId: null, URL: 'https://docs.google.com/presentation/d/1oJjLOOOvamp4CNq8uzESltCT-MAoCqv6/edit?usp=sharing&ouid=100955731275521423402&rtpof=true&sd=true' },
];

export function useFiles() {
    const [files, setFiles] = useState(demoFiles);
    const [query, setQuery] = useState('');
    const [sortOption, setSortOption] = useState(DEFAULT_SORT_OPTION); 
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [page, setPage] = useState(1);
    const perPage = 5;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let items = files.filter(f => (f.parentId ?? null) === currentFolderId);
        if (!q) return items;
        return items.filter(f => f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q));
    }, [files, query, currentFolderId]);

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
            const node = files.find(f => f.id === id);
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