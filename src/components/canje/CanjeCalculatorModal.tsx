import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  Smartphone,
  BatteryCharging,
  ShieldAlert,
  Box,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, StoreConfig } from '../../types';
import { useCanje } from '../../hooks/useCanje';
import { SUPPORTED_TRADE_IN_DEVICES } from '../../data/canjeValuation';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

interface CanjeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProduct: Product | null;
  allProducts: Product[];
  config: StoreConfig;
  onCanjeWhatsApp: (evaluation: any, target: Product, tradeInState: any) => void;
  onConsultGeneralCanje: (evaluation: any, tradeInState: any) => void;
}

export const CanjeCalculatorModal: React.FC<CanjeCalculatorModalProps> = ({
  isOpen,
  onClose,
  targetProduct: initialTarget,
  allProducts,
  config,
  onCanjeWhatsApp,
  onConsultGeneralCanje
}) => {
  const {
    step,
    setStep,
    tradeInState,
    setBrand,
    setModel,
    updateState,
    availableModels,
    availableCapacities,
    targetProduct,
    setTargetProduct,
    evaluation,
    resetCanje
  } = useCanje(
    initialTarget,
    config.canjePricing?.devices,
    config.canjePricing?.penalties
  );

  const [targetTypeFilter, setTargetTypeFilter] = useState<'Todos' | 'Sellado' | 'Usado'>('Todos');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [loadingProgressText, setLoadingProgressText] = useState<string>('Analizando condición del equipo...');

  useEffect(() => {
    if (initialTarget) {
      setTargetProduct(initialTarget);
    }
  }, [initialTarget, setTargetProduct]);

  useEffect(() => {
    if (step === 3 && isOpen && !isCalculating) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#25D366', '#FFFFFF', '#10B981', '#A855F7']
        });
      } catch (e) {
        // Fallback
      }
    }
  }, [step, isOpen, isCalculating]);

  if (!isOpen) return null;

  const brands = Array.from(new Set(SUPPORTED_TRADE_IN_DEVICES.map((d) => d.brand)));
  const isManualMode = config.canjeMode === 'manual';

  const handleStartCalculation = () => {
    setIsCalculating(true);
    setLoadingProgressText('Analizando estado de batería y pantalla...');

    setTimeout(() => {
      setLoadingProgressText('Cruzando valuación con Dólar Blue Venta...');
    }, 400);

    setTimeout(() => {
      setLoadingProgressText('¡Calculando mejor propuesta de toma!');
    }, 800);

    setTimeout(() => {
      setIsCalculating(false);
      setStep(3);
    }, 1100);
  };

  const handleBatteryInputChange = (val: number) => {
    const clamped = Math.min(100, Math.max(40, val));
    updateState('batteryPercentage', clamped);
    updateState('batteryUnknown', false);
  };

  const handleToggleUnknownBattery = () => {
    const nextVal = !tradeInState.batteryUnknown;
    updateState('batteryUnknown', nextVal);
    if (nextVal) {
      updateState('batteryPercentage', null);
    } else {
      updateState('batteryPercentage', 88);
    }
  };

  const filteredTargetProducts = allProducts.filter((p) => {
    if (targetTypeFilter === 'Todos') return true;
    return p.productType === targetTypeFilter;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
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
          className="relative w-full max-w-xl sm:max-w-2xl max-h-[92vh] overflow-y-auto no-scrollbar rounded-2xl sm:rounded-3xl p-4 sm:p-7 bg-[#0A0A0E] border border-white/20 z-10 my-auto text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        >
          {/* OVERLAY DE CARGA Y DIAGNÓSTICO EN TIEMPO REAL */}
          <AnimatePresence>
            {isCalculating && (
              <motion.div
                key="calculating-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-40 rounded-2xl sm:rounded-3xl bg-[#0A0A0E]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 sm:space-y-5 shadow-2xl"
              >
                {/* Radar Scanner Orb */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping opacity-60 pointer-events-none" />
                  <div className="absolute -inset-2 rounded-full border border-cyan-400/30 animate-spin-slow pointer-events-none" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-cyan-500/30 via-white/10 to-transparent border border-cyan-400/50 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                    <Sparkles size={28} className="text-cyan-300 animate-pulse" />
                  </div>
                </div>

                {/* Textos de Estado */}
                <div className="space-y-1.5 max-w-xs sm:max-w-sm">
                  <h4 className="text-base sm:text-xl font-black text-white tracking-tight">
                    Cotizando tu Equipo...
                  </h4>
                  <p className="text-xs sm:text-sm text-cyan-300 font-semibold min-h-[20px] transition-all">
                    {loadingProgressText}
                  </p>
                </div>

                {/* Barra de Progreso Neón */}
                <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full shadow-[0_0_12px_#22d3ee]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 mb-4 sm:mb-6">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 text-white shrink-0">
                <RefreshCw size={18} className="animate-spin-slow sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  Cotizador Plan Canje
                  <span className="text-[9px] sm:text-[10px] uppercase px-2 py-0.5 rounded-full bg-white/15 text-slate-200 border border-white/20 shrink-0">
                    {isManualMode ? 'Asesor' : 'En Vivo'}
                  </span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 truncate max-w-[220px] xs:max-w-[340px] sm:max-w-none">
                  {isManualMode 
                    ? 'Diagnóstico rápido para recibir la cotización máxima por WhatsApp.'
                    : 'Calculá el valor de toma de tu equipo y la diferencia en tiempo real.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-between mb-5 sm:mb-7 px-1 sm:px-4">
            {[
              { num: 1, label: 'Dispositivo' },
              { num: 2, label: 'Diagnóstico' },
              { num: 3, label: isManualMode ? 'Resultado' : 'Cotización' }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs transition-all ${
                      step >= s.num
                        ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                        : 'bg-white/10 text-slate-400 border border-white/10'
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 size={14} className="sm:w-4 sm:h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-semibold ${
                      step >= s.num ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-[1.5px] mx-1.5 sm:mx-3 transition-colors ${
                      step > idx + 1 ? 'bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'bg-white/10'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ───────── PASO 1: SELECCION DE DISPOSITIVO ───────── */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-4 sm:space-y-5"
            >
              <div>
                <label className="text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  1. Marca de tu equipo actual
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {brands.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBrand(b)}
                      className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                        tradeInState.brand === b
                          ? 'bg-white/20 border-white text-white shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <Smartphone size={15} />
                      <span>{b}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  2. Modelo exacto
                </label>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto no-scrollbar p-0.5">
                  {availableModels.map((m) => (
                    <button
                      key={m.model}
                      type="button"
                      onClick={() => setModel(m.model)}
                      className={`p-2.5 sm:p-3 rounded-xl text-xs font-bold border text-left transition-all truncate ${
                        tradeInState.model === m.model
                          ? 'bg-white text-black border-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      {m.model}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  3. Capacidad de almacenamiento
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {availableCapacities.map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => updateState('storage', cap)}
                      className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        tradeInState.storage === cap
                          ? 'bg-white text-black border-white shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 sm:pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto btn-liquid-cyan flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-xs font-bold text-black"
                >
                  <span>Continuar al Diagnóstico</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ───────── PASO 2: DIAGNÓSTICO DEL ESTADO ───────── */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-4 sm:space-y-5"
            >
              {/* Condición de Batería */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <BatteryCharging size={15} className="text-emerald-400" />
                    <span>Salud de Batería</span>
                  </label>
                  
                  {!tradeInState.batteryUnknown && tradeInState.batteryPercentage && (
                    <span className={`text-[11px] sm:text-xs font-black px-2 py-0.5 rounded-full border ${
                      tradeInState.batteryPercentage >= 90
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : tradeInState.batteryPercentage >= 80
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}>
                      {tradeInState.batteryPercentage}%
                    </span>
                  )}
                </div>

                {!tradeInState.batteryUnknown ? (
                  <div className="space-y-2">
                    <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={40}
                          max={100}
                          value={tradeInState.batteryPercentage || 88}
                          onChange={(e) => handleBatteryInputChange(Number(e.target.value))}
                          placeholder="88"
                          className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-dark-900 border border-white/15 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-white"
                        />
                        <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                      </div>

                      <div className="flex gap-1 overflow-x-auto no-scrollbar">
                        {[100, 95, 90, 85, 80].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleBatteryInputChange(val)}
                            className={`flex-1 xs:flex-initial px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-all ${
                              tradeInState.batteryPercentage === val
                                ? 'bg-white text-black border-white'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            {val}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400">
                      En iPhone: <span className="text-slate-200 font-semibold">Ajustes &gt; Batería &gt; Condición de Batería</span>.
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center gap-2 text-blue-200 text-xs">
                    <HelpCircle size={15} className="shrink-0 text-blue-400" />
                    <span>Se verificará la batería durante el peritaje técnico.</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleToggleUnknownBattery}
                  className={`w-full py-2 px-3 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                    tradeInState.batteryUnknown
                      ? 'bg-blue-500/20 text-blue-300 border-blue-400/40 shadow-sm'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <HelpCircle size={13} />
                  <span>
                    {tradeInState.batteryUnknown ? '✓ Seleccionado: No tengo esa información' : '❓ No sé la condición de batería'}
                  </span>
                </button>
              </div>

              {/* Estado de Pantalla */}
              <div>
                <label className="text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <ShieldAlert size={14} className="text-purple-400" />
                  Estado de Pantalla / Vidrio
                </label>
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                  {[
                    { id: 'intacta', label: '✨ Impecable' },
                    { id: 'microrayones', label: '🔍 Microrayones' },
                    { id: 'rajada', label: '⚠️ Rajada / Rota' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => updateState('screenStatus', s.id as any)}
                      className={`p-2.5 sm:p-3 rounded-xl text-xs font-bold border text-left transition-all ${
                        tradeInState.screenStatus === s.id
                          ? 'bg-white text-black border-white shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* FaceID & Caja/Cable */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  onClick={() => updateState('faceIdWorking', !tradeInState.faceIdWorking)}
                  className={`p-3 rounded-xl sm:rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    tradeInState.faceIdWorking
                      ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-400/40 text-rose-300'
                  }`}
                >
                  <div className="text-xs font-bold">
                    <span>Face ID / Biometría Funciona</span>
                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                      {tradeInState.faceIdWorking ? '100% Operativo' : 'No funciona'}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${tradeInState.faceIdWorking ? 'bg-emerald-400 text-black' : 'bg-rose-400 text-black'}`}>
                    <CheckCircle2 size={13} />
                  </div>
                </div>

                <div
                  onClick={() => updateState('hasBoxAndCable', !tradeInState.hasBoxAndCable)}
                  className={`p-3 rounded-xl sm:rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    tradeInState.hasBoxAndCable
                      ? 'bg-white/15 border-white/40 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-2">
                    <Box size={15} className="shrink-0" />
                    <div>
                      <span>Caja & Cable Original</span>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {tradeInState.hasBoxAndCable 
                          ? (isManualMode ? 'Suma valor a tu cotización' : 'Suma +$15 USD') 
                          : 'No los tengo'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${tradeInState.hasBoxAndCable ? 'bg-white text-black' : 'bg-white/10 text-slate-500'}`}>
                    <CheckCircle2 size={13} />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-bold text-slate-300"
                >
                  <ArrowLeft size={15} />
                  <span>Atrás</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartCalculation}
                  className="btn-liquid-cyan flex items-center gap-1.5 py-2.5 px-5 rounded-2xl text-xs font-bold text-black"
                >
                  <span>{isManualMode ? 'Ver Resumen' : 'Calcular Cotización'}</span>
                  <Sparkles size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ───────── PASO 3: RESULTADO ───────── */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="space-y-4 sm:space-y-5"
            >
              {isManualMode ? (
                /* MODALIDAD MANUAL */
                <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-900 border border-white/20 text-center space-y-3 shadow-xl">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 flex items-center justify-center mx-auto">
                    <WhatsAppIcon size={20} className="text-[#25D366] fill-[#25D366]" />
                  </div>

                  <div>
                    <h4 className="text-base sm:text-xl font-extrabold text-white">
                      ¡Diagnóstico Listo para Cotizar!
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
                      Tu <strong className="text-white">{tradeInState.model} ({tradeInState.storage})</strong> califica para nuestro Plan Canje. Te pasamos la cotización máxima por WhatsApp.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left text-xs space-y-1 max-w-md mx-auto">
                    <div className="flex justify-between text-slate-300">
                      <span>Equipo:</span>
                      <strong className="text-white">{tradeInState.brand} {tradeInState.model} {tradeInState.storage}</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Batería:</span>
                      <strong className="text-emerald-400">
                        {tradeInState.batteryUnknown ? 'A peritar' : `${tradeInState.batteryPercentage}%`}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Pantalla:</span>
                      <strong className="text-white capitalize">{tradeInState.screenStatus}</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Caja y Accesorios:</span>
                      <strong className="text-white">{tradeInState.hasBoxAndCable ? 'Sí (Caja y cable)' : 'No'}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                /* MODALIDAD AUTOMÁTICA */
                <>
                  <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/[0.04] border border-white/20 text-center relative overflow-hidden shadow-xl">
                    <div className="inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-slate-200 border border-white/20 mb-1">
                      Valuación Estimada de tu Usado
                    </div>

                    <p className="text-[11px] sm:text-xs text-slate-400 font-semibold truncate">
                      Tomamos tu {evaluation.tradeInModel} ({evaluation.tradeInStorage}) en:
                    </p>

                    <div className="my-1 flex items-baseline justify-center gap-1.5">
                      <span className="text-3xl sm:text-5xl font-black text-white">
                        ${evaluation.estimatedValueUSD}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-slate-400">USD</span>
                    </div>

                    {config.showArsPrice && (
                      <p className="text-[11px] sm:text-xs text-emerald-400 font-bold">
                        ≈ ${(evaluation.estimatedValueUSD * config.usdToArsRate).toLocaleString('es-AR')} ARS
                      </p>
                    )}
                  </div>

                  {targetProduct && (() => {
                    const currentDiffUSD = Math.max(0, targetProduct.priceUSD - evaluation.estimatedValueUSD);
                    return (
                      <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-950/30 to-zinc-900 border border-emerald-500/30 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5">
                        <div>
                          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-300 font-bold block">
                            DIFERENCIA A ABONAR:
                          </span>
                          <span className="text-2xl sm:text-3xl font-black text-emerald-400 leading-tight">
                            ${currentDiffUSD} USD
                          </span>
                          {config.showArsPrice && (
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              ≈ ${(currentDiffUSD * config.usdToArsRate).toLocaleString('es-AR')} ARS <span className="text-[9px] text-slate-500 font-normal">(*sujeto al Dólar Blue al abonar)</span>
                            </span>
                          )}
                        </div>

                        <div className="xs:text-right">
                          <span className="text-[10px] text-slate-400 block">Ahorrás con tu usado</span>
                          <span className="text-xs font-bold text-emerald-300">-${evaluation.estimatedValueUSD} USD</span>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}

              {/* SECCIÓN: EQUIPO QUE DESEAS LLEVAR */}
              <div className="space-y-2">
                <label className="text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Equipo que deseas llevarte:
                </label>

                {targetProduct ? (
                  <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border flex items-center justify-between gap-3 ${
                    targetProduct.productType === 'Usado' 
                      ? 'bg-purple-950/20 border-purple-500/40' 
                      : 'bg-white/[0.04] border-white/20'
                  }`}>
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <img
                        src={targetProduct.image}
                        alt={targetProduct.name}
                        className="w-11 h-11 sm:w-14 sm:h-14 object-contain filter drop-shadow-md shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">{targetProduct.name}</h4>
                          
                          {targetProduct.productType === 'Usado' ? (
                            <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-purple-500/25 text-purple-300 border border-purple-400/40 shrink-0">
                              🔄 Usado · 🔋 {targetProduct.batteryPercentage || 90}%
                            </span>
                          ) : (
                            <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/20 text-slate-100 border border-white/25 shrink-0">
                              📦 Sellado
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] sm:text-xs text-slate-300 font-semibold mt-0.5">
                          Lista: <strong className="text-white">${targetProduct.priceUSD} USD</strong> · {targetProduct.warranty}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTargetProduct(null)}
                      className="text-xs text-slate-300 hover:text-white underline font-bold shrink-0"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-semibold text-slate-300">Selecciona del catálogo:</span>
                      
                      <div className="flex gap-1">
                        {(['Todos', 'Sellado', 'Usado'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTargetTypeFilter(t)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                              targetTypeFilter === t
                                ? 'bg-white text-black border-white'
                                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                            }`}
                          >
                            {t === 'Todos' ? 'Todos' : t === 'Sellado' ? '📦 Sellados' : '🔄 Usados'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="max-h-44 overflow-y-auto no-scrollbar space-y-1.5 pr-1">
                      {filteredTargetProducts.map((p) => {
                        const isUsado = p.productType === 'Usado';
                        const batPct = p.batteryPercentage || 90;

                        return (
                          <div
                            key={p.id}
                            onClick={() => setTargetProduct(p)}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all gap-2.5 ${
                              isUsado
                                ? 'bg-purple-950/15 hover:bg-purple-900/30 border-purple-500/20 hover:border-purple-400/50'
                                : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/30'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img src={p.image} alt={p.name} className="w-9 h-9 object-contain shrink-0" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h5 className="text-xs font-bold text-white truncate">{p.name}</h5>
                                  
                                  {isUsado ? (
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 shrink-0">
                                      🔄 Usado · 🔋 {batPct}%
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/15 text-slate-200 border border-white/25 shrink-0">
                                      📦 Sellado
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.specs}</p>
                              </div>
                            </div>

                            <span className="text-xs text-white font-black shrink-0">
                              ${p.priceUSD} USD
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de Acción de WhatsApp */}
              <div className="pt-2 space-y-2">
                {targetProduct ? (
                  <button
                    type="button"
                    onClick={() => onCanjeWhatsApp(evaluation, targetProduct, tradeInState)}
                    className="w-full btn-liquid-whatsapp flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black text-black shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] active:scale-95 transition-all text-center"
                  >
                    <WhatsAppIcon size={18} className="text-black fill-black shrink-0" />
                    <span>Consultar Canje por WhatsApp</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onConsultGeneralCanje(evaluation, tradeInState)}
                    className="w-full btn-liquid-whatsapp flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black text-black shadow-[0_0_20px_rgba(37,211,102,0.4)] active:scale-95 transition-all text-center"
                  >
                    <WhatsAppIcon size={18} className="text-black fill-black shrink-0" />
                    <span>Consultar Cotización por WhatsApp</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-1.5 text-xs text-slate-400 hover:text-white transition-colors text-center"
                >
                  Recalcular con otro dispositivo
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
