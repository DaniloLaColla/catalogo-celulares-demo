import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRightLeft, 
  BatteryCharging,
  Box
} from 'lucide-react';
import { Product, StoreConfig } from '../../types';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

interface ProductCardProps {
  product: Product;
  config: StoreConfig;
  onOpenDetail: (product: Product) => void;
  onOpenCanje: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  config,
  onOpenDetail,
  onOpenCanje,
  onQuickBuy
}) => {
  const isUsado = product.productType === 'Usado';
  const arsPrice = product.priceUSD * config.usdToArsRate;
  const isLeather = config.customSettings?.aesthetic === 'leather-luxury';

  return (
    <div
      className={`group relative rounded-3xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-1 ${
        isLeather
          ? 'bg-[#121216] border border-zinc-800/90 hover:border-zinc-500/60 shadow-[0_15px_35px_rgba(0,0,0,0.9)]'
          : isUsado 
            ? 'liquid-glass hover:border-purple-500/50 hover:shadow-[0_12px_35px_rgba(168,85,247,0.15)]' 
            : 'liquid-glass hover:border-white/40 hover:shadow-[0_12px_35px_rgba(255,255,255,0.1)]'
      }`}
    >
      <div>
        {/* Badges superiores */}
        <div className="flex items-center justify-between gap-1.5 mb-3">
          {/* Badge Sellado vs Usado con Batería */}
          {isUsado ? (
            <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide border ${
              isLeather
                ? 'bg-zinc-800/90 text-zinc-300 border-zinc-700/80'
                : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
            }`}>
              <BatteryCharging size={13} className={isLeather ? 'text-zinc-400' : 'text-purple-400'} />
              <span>Batería: {product.batteryPercentage || 90}%</span>
            </div>
          ) : (
            <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide border ${
              isLeather
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-white/15 text-slate-100 border-white/20'
            }`}>
              <Box size={13} className="text-white" />
              <span>Sellado · Nuevo</span>
            </div>
          )}

          {/* Estado de Stock */}
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
            product.inStock 
              ? isLeather ? 'bg-zinc-800/80 text-emerald-400 border-emerald-500/30' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
          }`}>
            {product.inStock ? 'Stock Inmediato' : 'Consultar'}
          </span>
        </div>

        {/* Imagen del Producto */}
        <div 
          onClick={() => onOpenDetail(product)}
          className="relative w-full aspect-square rounded-2xl flex items-center justify-center p-3 mb-3 cursor-pointer group-hover:bg-white/[0.02] transition-colors"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badge indicador de galería múltiple */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 border border-white/15 text-[10px] font-bold text-slate-300 backdrop-blur-md">
              📸 {product.gallery.length}
            </div>
          )}
        </div>

        {/* Info del Producto */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>{product.brand} · {product.category}</span>
            <span>{product.storageOptions[0] || '128GB'}</span>
          </div>

          <h3 
            onClick={() => onOpenDetail(product)}
            className="text-base font-bold text-white tracking-tight group-hover:text-slate-200 cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-1">{product.specs}</p>
        </div>

        {/* Garantía */}
        <div className="mt-2.5 py-1.5 px-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-1.5 text-[11px] text-slate-300">
          <ShieldCheck size={13} className={isUsado ? 'text-purple-400' : 'text-slate-300'} />
          <span className="truncate">{product.warranty}</span>
        </div>
      </div>

      {/* Precios & Botones de Acción */}
      <div className="mt-4 pt-3 border-t border-white/10 space-y-3">
        {/* Precios */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white font-display">
              ${product.priceUSD.toLocaleString('en-US')}
            </span>
            <span className="text-xs font-bold text-slate-400">USD</span>
          </div>

          {config.showArsPrice && (
            <div className="mt-0.5">
              <p className="text-xs font-bold text-emerald-400">
                ≈ ${Math.round(arsPrice).toLocaleString('es-AR')} ARS
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                *Cotización sujeta al Dólar Blue al abonar
              </p>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="grid grid-cols-2 gap-2">
          {/* Botón Plan Canje */}
          <button
            type="button"
            onClick={() => onOpenCanje(product)}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
              isLeather
                ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/70'
                : 'bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10 hover:border-white/20'
            }`}
          >
            <ArrowRightLeft size={13} className="text-slate-300" />
            <span>Canjear</span>
          </button>

          {/* Botón WhatsApp Oficial (Consultar) */}
          <button
            type="button"
            onClick={() => onQuickBuy(product)}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl text-xs font-black active:scale-95 transition-all ${
              isLeather
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md'
                : 'btn-liquid-whatsapp shadow-[0_0_15px_rgba(37,211,102,0.3)]'
            }`}
          >
            <WhatsAppIcon size={15} className="text-black fill-black shrink-0" />
            <span className="truncate">Me interesa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
