import React from 'react';
import { Layers, RefreshCw, Lock } from 'lucide-react';
import { StoreConfig } from '../../types';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

interface BottomNavProps {
  currentTab: 'catalog' | 'canje' | 'admin';
  onSelectTab: (tab: 'catalog' | 'canje' | 'admin') => void;
  config: StoreConfig;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  config
}) => {
  const openDirectWhatsApp = () => {
    const phone = config.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hola ${config.storeName}! Quería hacer una consulta sobre el catálogo.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 px-4 sm:hidden pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto rounded-3xl p-2 liquid-glass-elevated border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex items-center justify-around">
        {/* Tab 1: Catálogo */}
        <button
          onClick={() => onSelectTab('catalog')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all ${
            currentTab === 'catalog'
              ? 'text-white bg-white/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers size={18} />
          <span className="text-[10px] font-bold">Catálogo</span>
        </button>

        {/* Tab 2: Plan Canje (Destacado) */}
        <button
          onClick={() => onSelectTab('canje')}
          className="relative -top-2 flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-white via-slate-300 to-zinc-600 p-[1.5px] shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            <div className="w-full h-full rounded-full bg-[#08080A] flex items-center justify-center text-white">
              <RefreshCw size={20} className="animate-spin-slow" />
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-white mt-0.5">Plan Canje</span>
        </button>

        {/* Tab 3: WhatsApp Directo Oficial */}
        <button
          onClick={openDirectWhatsApp}
          className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-[#25D366] hover:text-[#28e06c] transition-all group"
        >
          <WhatsAppIcon size={19} className="text-[#25D366] fill-[#25D366] group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold">WhatsApp</span>
        </button>

        {/* Tab 4: Admin */}
        <button
          onClick={() => onSelectTab('admin')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all ${
            currentTab === 'admin'
              ? 'text-purple-400 bg-purple-400/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock size={18} />
          <span className="text-[10px] font-bold">Admin</span>
        </button>
      </div>
    </div>
  );
};
