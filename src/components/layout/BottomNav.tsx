import React from 'react';
import { Layers, RefreshCw } from 'lucide-react';
import { StoreConfig } from '../../types';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

interface BottomNavProps {
  currentTab: 'catalog' | 'canje';
  onSelectTab: (tab: 'catalog' | 'canje') => void;
  config: StoreConfig;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  config
}) => {
  const openDirectWhatsApp = () => {
    const phone = config.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hola ${config.storeName}! Quería hacer una consulta sobre los productos disponibles.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <nav aria-label="Navegación Móvil" className="fixed bottom-4 inset-x-0 z-40 px-4 sm:hidden pointer-events-none">
      <div className="max-w-xs mx-auto pointer-events-auto rounded-3xl p-1.5 liquid-glass-elevated border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.85)] flex items-center justify-between gap-1">
        {/* Tab 1: Catálogo */}
        <button
          type="button"
          onClick={() => onSelectTab('catalog')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-2xl transition-all ${
            currentTab === 'catalog'
              ? 'text-white bg-white/15 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers size={19} />
          <span className="text-[10px] font-bold tracking-tight">Catálogo</span>
        </button>

        {/* Tab 2: Plan Canje (Destacado Central) */}
        <button
          type="button"
          onClick={() => onSelectTab('canje')}
          className="relative -top-2 flex flex-col items-center shrink-0 px-2 group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-white via-slate-200 to-zinc-600 p-[1.5px] shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-[#08080A] flex items-center justify-center text-white">
              <RefreshCw size={20} className="animate-spin-slow text-cyan-300" />
            </div>
          </div>
          <span className="text-[10px] font-black text-white mt-0.5 tracking-tight">Plan Canje</span>
        </button>

        {/* Tab 3: WhatsApp Directo */}
        <button
          type="button"
          onClick={openDirectWhatsApp}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-2xl text-[#25D366] hover:bg-white/5 transition-all group"
        >
          <WhatsAppIcon size={19} className="text-[#25D366] fill-[#25D366] group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold tracking-tight">WhatsApp</span>
        </button>
      </div>
    </nav>
  );
};

