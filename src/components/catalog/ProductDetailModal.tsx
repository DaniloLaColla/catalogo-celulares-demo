import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  BatteryCharging, 
  ArrowRightLeft, 
  MapPin, 
  ChevronLeft,
  ChevronRight,
  Camera
} from 'lucide-react';
import { Product, StoreConfig } from '../../types';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

interface ProductDetailModalProps {
  product: Product | null;
  config: StoreConfig;
  isOpen: boolean;
  onClose: () => void;
  onOpenCanje: (product: Product) => void;
  onBuyWhatsApp: (product: Product, selectedStorage: string, selectedColor: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  config,
  isOpen,
  onClose,
  onOpenCanje,
  onBuyWhatsApp
}) => {
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  // Armar lista completa de fotos sin duplicados
  const photos = React.useMemo(() => {
    if (!product) return [];
    const list = [product.image, ...(product.gallery || [])].filter(Boolean);
    return Array.from(new Set(list));
  }, [product]);

  useEffect(() => {
    if (product) {
      setSelectedStorage(product.storageOptions[0] || '128GB');
      setSelectedColor(product.colorOptions[0]?.name || 'Titanio Natural');
      setCurrentPhotoIndex(0);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const isUsado = product.productType === 'Usado';
  const arsPrice = product.priceUSD * config.usdToArsRate;

  const handleNextPhoto = () => {
    if (photos.length <= 1) return;
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    if (photos.length <= 1) return;
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl p-5 sm:p-8 bg-[#0A0A0E] border border-white/20 z-10 my-auto text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.95)] space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {product.brand} · {product.category}
              </span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                isUsado 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                  : 'bg-white/15 text-slate-100 border-white/20'
              }`}>
                {isUsado ? '🔄 Usado Seleccionado' : '📦 Sellado de Fábrica'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Grid Principal: Galería de Fotos + Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* ─── GALERÍA INTERACTIVA DE FOTOS ─── */}
            <div className="space-y-3">
              <div className="relative w-full aspect-square rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center p-4 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />

                {/* Foto Principal Actual */}
                <motion.img
                  key={currentPhotoIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  src={photos[currentPhotoIndex] || product.image}
                  alt={`${product.name} - Foto ${currentPhotoIndex + 1}`}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)]"
                />

                {/* Flechas de Navegación si hay más de 1 foto */}
                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevPhoto}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all opacity-80 hover:opacity-100 active:scale-90"
                      title="Foto anterior"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPhoto}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all opacity-80 hover:opacity-100 active:scale-90"
                      title="Siguiente foto"
                    >
                      <ChevronRight size={16} />
                    </button>

                    {/* Contador de fotos */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/70 border border-white/20 text-[10px] font-bold text-white flex items-center gap-1">
                      <Camera size={11} />
                      <span>{currentPhotoIndex + 1} / {photos.length}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Tira de Miniaturas Táctiles */}
              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {photos.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border transition-all shrink-0 p-0.5 ${
                        currentPhotoIndex === idx
                          ? 'border-emerald-400 ring-2 ring-emerald-400/30 scale-105'
                          : 'border-white/15 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Badge de Batería si es usado */}
              {isUsado && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-bold shadow-lg w-full justify-center">
                  <BatteryCharging size={16} className="text-emerald-400" />
                  <span>Batería: <strong className="text-white">{product.batteryPercentage || 90}%</strong> (Original)</span>
                </div>
              )}
            </div>

            {/* Configuración del Producto */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {product.description || product.specs}
                </p>
              </div>

              {/* Almacenamiento */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Capacidad:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.storageOptions.map((storage) => (
                    <button
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedStorage === storage
                          ? 'bg-white text-black border-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Color */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Color {isUsado ? 'Publicado:' : 'Disponible:'}
                </label>

                {isUsado ? (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-200">
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: product.colorOptions[0]?.hex || '#7D7E80' }}
                    />
                    <span>{product.colorOptions[0]?.name || 'Titanio Natural'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">(Unidad única publicada)</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {product.colorOptions.map((col) => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col.name)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedColor === col.name
                            ? 'bg-white/20 border-white text-white shadow-sm'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-white/30"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Términos de Garantía */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
                <ShieldCheck size={16} className={`shrink-0 mt-0.5 ${isUsado ? 'text-purple-400' : 'text-slate-200'}`} />
                <div className="text-xs">
                  <span className="font-bold text-white block">
                    {isUsado ? 'Garantía de Tienda (1 Mes)' : 'Garantía Oficial Apple (1 Año)'}
                  </span>
                  <span className="text-slate-400 text-[11px] leading-snug block mt-0.5">
                    {isUsado 
                      ? 'Cobertura total por 30 días ante fallas de hardware. Equipo probado y 100% original.' 
                      : 'Garantía internacional oficial Apple válida en cualquier Apple Store o Service Oficial.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Puntos de Retiro & Envíos */}
          {config.deliveryLocations && config.deliveryLocations.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <MapPin size={15} />
                <span>Puntos de Retiro Inmediato</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.deliveryLocations.map((loc, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 font-medium"
                  >
                    📍 {loc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer de Precios & Botones de Acción */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Precio Final:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-display">
                  ${product.priceUSD.toLocaleString('en-US')}
                </span>
                <span className="text-sm font-bold text-slate-400">USD</span>
              </div>

              {config.showArsPrice && (
                <span className="text-xs text-emerald-400 font-bold block">
                  ≈ ${Math.round(arsPrice).toLocaleString('es-AR')} ARS (Blue Venta)
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Botón Plan Canje */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCanje(product);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 text-xs font-bold active:scale-95 transition-all"
              >
                <ArrowRightLeft size={16} />
                <span>Plan Canje</span>
              </button>

              {/* Botón Consultar por WhatsApp Oficial */}
              <button
                type="button"
                onClick={() => onBuyWhatsApp(product, selectedStorage, selectedColor)}
                className="flex-1 sm:flex-none btn-liquid-whatsapp flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-xs font-black text-black active:scale-95 transition-all shadow-[0_0_20px_rgba(37,211,102,0.4)]"
              >
                <WhatsAppIcon size={18} className="text-black fill-black" />
                <span>Consultar por WhatsApp</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
