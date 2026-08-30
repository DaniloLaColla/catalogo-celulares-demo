import React from 'react';
import { Search, X, Box, RefreshCw } from 'lucide-react';
import { ProductType } from '../../types';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTypeFilter: 'Todos' | ProductType;
  onSelectTypeFilter: (type: 'Todos' | ProductType) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc';
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc') => void;
  onlyInStock: boolean;
  onToggleOnlyInStock: () => void;
  totalResults: number;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedTypeFilter,
  onSelectTypeFilter,
  sortBy,
  onSortChange,
  onlyInStock,
  onToggleOnlyInStock,
  totalResults
}) => {
  return (
    <div className="w-full px-4 sm:px-6 my-3 space-y-3">
      {/* ─── FILTRO RÁPIDO: SELLADOS VS USADOS ─── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => onSelectTypeFilter('Todos')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedTypeFilter === 'Todos'
              ? 'bg-white/20 text-white border border-white/30 shadow-sm'
              : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
          }`}
        >
          Todos los Equipos ({totalResults})
        </button>

        <button
          onClick={() => onSelectTypeFilter('Sellado')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedTypeFilter === 'Sellado'
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              : 'bg-white/5 text-slate-400 border border-white/10 hover:text-cyan-300'
          }`}
        >
          <Box size={13} className="text-cyan-400" />
          <span>📦 Sellados (Garantía Apple)</span>
        </button>

        <button
          onClick={() => onSelectTypeFilter('Usado')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedTypeFilter === 'Usado'
              ? 'bg-purple-500/25 text-purple-300 border border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
              : 'bg-white/5 text-slate-400 border border-white/10 hover:text-purple-300'
          }`}
        >
          <RefreshCw size={13} className="text-purple-400" />
          <span>🔄 Usados Seleccionados (1 Mes Gtía)</span>
        </button>
      </div>

      {/* ─── BARRA DE BÚSQUEDA Y CONTROLES ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Input Buscador */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por modelo, capacidad o batería..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl liquid-pill text-xs sm:text-sm font-medium text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/40 transition-all"
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filtros de Orden y Stock */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="liquid-pill text-xs font-semibold text-slate-200 py-2 px-3 rounded-2xl focus:outline-none border-white/10 cursor-pointer bg-dark-900"
          >
            <option value="featured">✨ Destacados</option>
            <option value="price-asc">💵 Menor Precio</option>
            <option value="price-desc">💎 Mayor Precio</option>
          </select>

          <button
            onClick={onToggleOnlyInStock}
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold border transition-all ${
              onlyInStock
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                : 'liquid-pill text-slate-400 border-white/10 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyInStock ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span>En Stock</span>
          </button>
        </div>
      </div>
    </div>
  );
};
