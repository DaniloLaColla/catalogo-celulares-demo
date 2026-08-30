import React, { useState } from 'react';
import { 
  RefreshCw, 
  Lock, 
  MapPin, 
  X, 
  Truck,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreConfig } from '../../types';
import { AppleLogo } from '../ui/AppleLogo';

interface NavbarProps {
  config: StoreConfig;
  isUpdatingDollar?: boolean;
  onRefreshDollar?: () => void;
  onOpenCanje: () => void;
  onOpenAdmin: () => void;
  totalProductsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  isUpdatingDollar = false,
  onRefreshDollar,
  onOpenCanje,
  onOpenAdmin,
  totalProductsCount
}) => {
  const [showLocationsModal, setShowLocationsModal] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyLocation = (loc: string, index: number) => {
    navigator.clipboard.writeText(loc);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleOpenInstagram = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rawHandle = config.instagramUser || 'teststore.oficial';
    const cleanHandle = rawHandle.replace('@', '').trim();
    window.open(`https://instagram.com/${cleanHandle}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-3 sm:px-8 py-2.5 sm:py-3.5 backdrop-blur-2xl bg-[#000000]/85 border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          {/* Brand Logo & Info */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group min-w-0 flex-1 sm:flex-initial"
            title="Ir al inicio del catálogo"
          >
            {config.logoUrl ? (
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden bg-white/5 border border-white/15 flex items-center justify-center p-1 shadow-lg shrink-0">
                <img
                  src={config.logoUrl}
                  alt={config.storeName}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-white/20 via-zinc-400/20 to-transparent p-[1.5px] shadow-[0_0_20px_rgba(255,255,255,0.15)] shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#08080A] flex items-center justify-center">
                  <AppleLogo size={18} className="text-white fill-white sm:w-5 sm:h-5" />
                </div>
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-sm sm:text-lg font-black tracking-tight text-white font-display truncate max-w-[120px] xs:max-w-[160px] sm:max-w-none">
                  {config.storeName}
                </span>

                {/* Badge Tienda Verificada con Link a Instagram */}
                <button
                  type="button"
                  onClick={handleOpenInstagram}
                  title={`Tienda Verificada · Clic para ver @${(config.instagramUser || 'teststore.oficial').replace('@', '')} en Instagram`}
                  className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-500/20 to-blue-500/20 hover:from-sky-500/30 hover:to-blue-500/30 border border-sky-400/40 hover:border-sky-400 text-sky-300 hover:text-sky-200 transition-all shadow-[0_0_12px_rgba(56,189,248,0.25)] active:scale-95 group/badge cursor-pointer shrink-0"
                >
                  <BadgeCheck size={12} className="text-sky-400 fill-sky-400/30 group-hover/badge:scale-110 transition-transform shrink-0" />
                  <span className="text-[9px] sm:text-[10px] font-black tracking-tight">
                    Verificada
                  </span>
                </button>
              </div>

              {/* Botón Puntos de Retiro */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLocationsModal(true);
                }}
                className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-300 hover:text-white transition-all -mt-0.5 group py-0.5"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-semibold underline decoration-slate-600 group-hover:decoration-white truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[280px]">
                  {config.deliveryLocations && config.deliveryLocations.length > 0
                    ? `${config.deliveryLocations.length} Puntos de Retiro & Envíos`
                    : 'Puntos de Entrega'}
                </span>
              </button>
            </div>
          </div>

          {/* Acciones de Cabecera */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Badge Dólar Blue Venta */}
            {config.showArsPrice && (
              <button
                type="button"
                onClick={onRefreshDollar}
                title={`Dólar Blue Venta en Vivo · Última actualización: ${config.lastDollarFetchTime || 'Reciente'}. Clic para refrescar.`}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-[11px] sm:text-xs font-semibold text-slate-200 transition-all cursor-pointer group shrink-0"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[10px] sm:text-[11px] text-slate-400 hidden md:inline">Blue Venta:</span>
                <span className="text-emerald-400 font-extrabold text-[11px] sm:text-xs">
                  ${config.usdToArsRate.toLocaleString('es-AR')}
                </span>
                <RefreshCw 
                  size={10} 
                  className={`text-slate-400 group-hover:text-emerald-300 shrink-0 ${isUpdatingDollar ? 'animate-spin text-emerald-400' : ''}`} 
                />
              </button>
            )}

            {/* Botón Plan Canje (Visible en Pantallas Grandes) */}
            <button
              type="button"
              onClick={onOpenCanje}
              className="hidden sm:flex items-center gap-1.5 py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95 transition-all"
            >
              <RefreshCw size={13} className="animate-spin-slow text-slate-200" />
              <span>Plan Canje</span>
            </button>

            {/* Botón Acceso Admin */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all shrink-0"
              title="Panel de Administración"
            >
              <Lock size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── MODAL INDEPENDIENTE PUNTOS DE ENTREGA & RETIRO ─── */}
      <AnimatePresence>
        {showLocationsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop con desenfoque profundo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocationsModal(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl"
            />

            {/* Ventana Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative w-full max-w-lg rounded-3xl p-6 sm:p-7 bg-[#0A0A0E] border border-white/20 text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-10 my-auto space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Puntos de Retiro & Envíos
                    </h3>
                    <p className="text-xs text-slate-400">
                      Disponibles para retiro en mano o envíos asegurados
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowLocationsModal(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Lista de Puntos de Retiro con Tarjetas Táctiles */}
              <div className="space-y-2.5 max-h-[55vh] overflow-y-auto no-scrollbar pr-1">
                {config.deliveryLocations && config.deliveryLocations.length > 0 ? (
                  config.deliveryLocations.map((loc, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-emerald-500/30">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <h5 className="text-sm font-bold text-white leading-snug break-words">
                            {loc}
                          </h5>
                          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Retiro disponible de Lunes a Sábados
                          </span>
                        </div>
                      </div>

                      {/* Botón copiar dirección */}
                      <button
                        onClick={() => handleCopyLocation(loc, idx)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-colors shrink-0"
                        title="Copiar dirección"
                      >
                        {copiedIndex === idx ? (
                          <Check size={16} className="text-emerald-400" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No hay direcciones configuradas actualmente.
                  </p>
                )}

                {/* Banner de Modalidad de Envíos */}
                {config.shippingInfo && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 to-blue-950/20 border border-cyan-500/30 flex items-start gap-3 mt-4">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                      <Truck size={18} />
                    </div>
                    <div>
                      <h6 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                        Modalidad de Envíos
                      </h6>
                      <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                        {config.shippingInfo}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de Cierre */}
              <div className="pt-2">
                <button
                  onClick={() => setShowLocationsModal(false)}
                  className="w-full btn-liquid-cyan py-3 rounded-2xl text-xs font-bold text-black shadow-lg"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
