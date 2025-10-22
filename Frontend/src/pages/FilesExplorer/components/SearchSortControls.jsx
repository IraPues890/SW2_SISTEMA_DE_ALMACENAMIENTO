import React from 'react';

export default function SearchSortControls({ query, setQuery, sortOption, setSortOption, setPage }) {
  return (
    <div className="flex items-center space-x-3">
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); setPage(1); }}
        placeholder="Buscar archivos..."
        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
      <select
        value={sortOption}
        onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
        className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
        aria-label="Ordenar archivos"
      >
        <option value="name-asc">Nombre A → Z</option>
        <option value="name-desc">Nombre Z → A</option>
        <option value="date-desc">Fecha (más reciente)</option>
        <option value="date-asc">Fecha (más antigua)</option>
        <option value="size-desc">Tamaño (mayor)</option>
        <option value="size-asc">Tamaño (menor)</option>
      </select>
    </div>
  );
}
