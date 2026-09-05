import React, { useState } from 'react';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { StoreConfig } from '../../types';

interface FloatingWhatsAppButtonProps {
  config: StoreConfig;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({ config }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const phone = config.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `¡Hola ${config.storeName}! Estuve viendo el catálogo online y quería hacerles una consulta sobre los equipos disponibles.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <aside
      aria-label="Atención por WhatsApp"
      className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-3 select-none"
    >
      {/* Tooltip / Pill informativo con estética dark liquid */}
      <div
        className={`px-3.5 py-2 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 text-white shadow-2xl transition-all duration-300 pointer-events-none flex items-center gap-2 ${
          isHovered
            ? 'opacity-100 translate-x-0 scale-100 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'opacity-0 translate-x-3 scale-95'
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold tracking-tight text-slate-200 whitespace-nowrap">
          ¿Dudas con un equipo? <strong className="text-emerald-400 font-bold">Chateá con nosotros</strong>
        </span>
      </div>

      {/* Botón Flotante de WhatsApp */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Chatear por WhatsApp"
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 ring-1 ring-white/20 cursor-pointer"
      >
        {/* Pulsito online en la esquina superior */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-black"></span>
        </span>

        <WhatsAppIcon size={22} className="text-white fill-white group-hover:scale-110 transition-transform" />
        <span className="text-xs tracking-wide font-extrabold hidden md:inline whitespace-nowrap">
          WhatsApp
        </span>
      </button>
    </aside>
  );
};
