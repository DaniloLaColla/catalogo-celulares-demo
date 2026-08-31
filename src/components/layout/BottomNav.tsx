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
    const message = encodeURIComponent(`¡Hola ${config.storeName}! Estuve viendo el catálogo online y quería hacerles una consulta sobre los equipos disponibles.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <nav aria-label="Navegación Móvil" className="fixed bottom-4 inset-x-0 z-40 px-4 sm:hidden pointer-events-none">
      <div className="max-w-xs mx-auto pointer-events-auto rounded-3xl p-1.5 liquid-glass-elevated border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.85)] grid grid-cols-3 items-center gap-1.5">
        {/* Tab 1: Catálogo */}
        <button
          type="button"
          onClick={() => onSelectTab('catalog')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-2xl transition-all ${
            currentTab === 'catalog'
              ? 'text-white bg-white/15 shadow-sm font-black'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers size={18} />
          <span className="text-[10px] font-bold tracking-tight">Catálogo</span>
        </button>

        {/* Tab 2: Plan Canje */}
        <button
          type="button"
          onClick={() => onSelectTab('canje')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-2xl transition-all ${
            currentTab === 'canje'
              ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.35)] font-black'
              : 'text-cyan-400 bg-white/5 hover:bg-white/10 hover:text-cyan-300 border border-white/5'
          }`}
        >
          <RefreshCw size={18} className="animate-spin-slow text-cyan-300" />
          <span className="text-[10px] font-extrabold tracking-tight">Plan Canje</span>
        </button>

        {/* Tab 3: WhatsApp Directo */}
        <button
          type="button"
          onClick={openDirectWhatsApp}
          className="flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-2xl text-[#25D366] hover:bg-white/5 transition-all group"
        >
          <WhatsAppIcon size={18} className="text-[#25D366] fill-[#25D366] group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold tracking-tight">WhatsApp</span>
        </button>
      </div>
    </nav>
  );
};

