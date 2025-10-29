import React from 'react';
import { SORT_OPTIONS_LIST } from '../config/SortOptions';

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
        {/* Mapeamos la lista de opciones dinámicamente */}
        {SORT_OPTIONS_LIST.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}