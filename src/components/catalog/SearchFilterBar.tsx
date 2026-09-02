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
  aesthetic?: string;
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
  totalResults,
  aesthetic
}) => {
  const isLeather = aesthetic === 'leather-luxury';

  return (
    <div className="w-full px-3 sm:px-6 my-2.5 sm:my-3 space-y-2.5 sm:space-y-3">
      {/* ─── FILTRO RÁPIDO: SELLADOS VS USADOS ─── */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => onSelectTypeFilter('Todos')}
          className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
            selectedTypeFilter === 'Todos'
              ? isLeather ? 'bg-white text-black font-extrabold shadow-sm border border-white' : 'bg-white/20 text-white border border-white/30 shadow-sm'
              : isLeather ? 'bg-[#141418] text-zinc-400 border border-zinc-800 hover:text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
          }`}
        >
          Todos ({totalResults})
        </button>

        <button
          type="button"
          onClick={() => onSelectTypeFilter('Sellado')}
          className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
            selectedTypeFilter === 'Sellado'
              ? isLeather ? 'bg-white text-black font-extrabold shadow-sm border border-white' : 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              : isLeather ? 'bg-[#141418] text-zinc-400 border border-zinc-800 hover:text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:text-cyan-300'
          }`}
        >
          <Box size={13} className={selectedTypeFilter === 'Sellado' && isLeather ? 'text-black' : isLeather ? 'text-zinc-400' : 'text-cyan-400'} />
          <span>Sellados (Gtía Apple)</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTypeFilter('Usado')}
          className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
            selectedTypeFilter === 'Usado'
              ? isLeather ? 'bg-white text-black font-extrabold shadow-sm border border-white' : 'bg-purple-500/25 text-purple-300 border border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
              : isLeather ? 'bg-[#141418] text-zinc-400 border border-zinc-800 hover:text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:text-purple-300'
          }`}
        >
          <RefreshCw size={13} className={selectedTypeFilter === 'Usado' && isLeather ? 'text-black' : isLeather ? 'text-zinc-400' : 'text-purple-400'} />
          <span>Usados (Peritados)</span>
        </button>
      </div>

      {/* ─── BARRA DE BÚSQUEDA Y CONTROLES ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
        {/* Input Buscador */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por modelo, capacidad o batería..."
            className={`w-full pl-9 pr-9 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all focus:outline-none ${
              isLeather
                ? 'bg-[#121216] border border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-600'
                : 'liquid-pill text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/40'
            }`}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filtros de Orden y Stock */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className={`flex-1 sm:flex-initial text-[11px] sm:text-xs font-semibold py-2 px-2.5 sm:px-3 rounded-2xl focus:outline-none cursor-pointer ${
              isLeather
                ? 'bg-[#121216] text-zinc-300 border border-zinc-800 focus:border-zinc-600'
                : 'liquid-pill text-slate-200 border-white/10 bg-dark-900'
            }`}
          >
            <option value="featured">✨ Destacados</option>
            <option value="price-asc">💵 Menor Precio</option>
            <option value="price-desc">💎 Mayor Precio</option>
          </select>

          <button
            type="button"
            onClick={onToggleOnlyInStock}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] sm:text-xs font-semibold border transition-all shrink-0 ${
              onlyInStock
                ? isLeather ? 'bg-zinc-800 text-emerald-400 border-emerald-500/40' : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                : isLeather ? 'bg-[#121216] text-zinc-400 border-zinc-800 hover:text-white' : 'liquid-pill text-slate-400 border-white/10 hover:text-slate-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${onlyInStock ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span>En Stock</span>
          </button>
        </div>
      </div>
    </div>
  );
};
