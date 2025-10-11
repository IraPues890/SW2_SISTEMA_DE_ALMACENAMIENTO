import { useState, useMemo } from 'react';

const demoFiles = [
    { id: 1, name: 'informe2025.pdf', size: '2300', date: '30/09/2025', type: 'pdf', parentId: null },
    { id: 2, name: 'reporte_ventas.xlsx', size: '1200', date: '29/09/2025', type: 'xlsx', parentId: null },
    { id: 3, name: 'datos_clientes.csv', size: '800', date: '28/09/2025', type: 'csv', parentId: null },
    { id: 4, name: 'grafico_anual.png', size: '500', date: '27/09/2025', type: 'png', parentId: null },
    { id: 5, name: 'presentacion.pptx', size: '4500', date: '25/09/2025', type: 'pptx', parentId: null },
];

export function useFiles() {
    const [files, setFiles] = useState(demoFiles);
    const [query, setQuery] = useState('');
    const [sortOption, setSortOption] = useState('name-asc');
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
        const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });
        switch (sortOption) {
            case 'name-asc': items.sort((a, b) => collator.compare(a.name, b.name)); break;
            case 'name-desc': items.sort((a, b) => collator.compare(b.name, a.name)); break;
            case 'date-asc': items.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
            case 'date-desc': items.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
            case 'size-asc': items.sort((a, b) => Number(a.size) - Number(b.size)); break;
            case 'size-desc': items.sort((a, b) => Number(b.size) - Number(a.size)); break;
            default: break;
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

    return {
        files,
        addFile,
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
