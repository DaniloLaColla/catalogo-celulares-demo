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

  useEffect(() => {
    if (initialTarget) {
      setTargetProduct(initialTarget);
    }
  }, [initialTarget, setTargetProduct]);

  useEffect(() => {
    if (step === 3 && isOpen) {
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
  }, [step, isOpen]);

  if (!isOpen) return null;

  const brands = Array.from(new Set(SUPPORTED_TRADE_IN_DEVICES.map((d) => d.brand)));
  const isManualMode = config.canjeMode === 'manual';

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
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl p-5 sm:p-8 bg-[#0A0A0E] border border-white/20 z-10 my-auto text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20 text-white">
                <RefreshCw size={22} className="animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  Cotizador Plan Canje
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-white/15 text-slate-200 border border-white/20">
                    {isManualMode ? 'Asesor Oficial' : 'En Vivo'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isManualMode 
                    ? 'Completa el diagnóstico de tu equipo para recibir la cotización máxima por WhatsApp.'
                    : 'Calculá el valor de toma de tu equipo y la diferencia a abonar en tiempo real.'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-between mb-8 px-2 sm:px-6">
            {[
              { num: 1, label: 'Dispositivo' },
              { num: 2, label: 'Diagnóstico' },
              { num: 3, label: isManualMode ? 'Resultado' : 'Cotización' }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      step >= s.num
                        ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                        : 'bg-white/10 text-slate-400 border border-white/10'
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 size={16} /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${
                      step >= s.num ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-[2px] mx-3 transition-colors ${
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  1. Marca de tu equipo actual
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBrand(b)}
                      className={`p-3.5 rounded-2xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                        tradeInState.brand === b
                          ? 'bg-white/20 border-white text-white shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <Smartphone size={16} />
                      <span>{b}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  2. Modelo exacto
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-52 overflow-y-auto no-scrollbar p-1">
                  {availableModels.map((m) => (
                    <button
                      key={m.model}
                      onClick={() => setModel(m.model)}
                      className={`p-3 rounded-xl text-xs font-bold border text-left transition-all ${
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
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  3. Almacenamiento
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCapacities.map((cap) => (
                    <button
                      key={cap}
                      onClick={() => updateState('storage', cap)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
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

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="btn-liquid-cyan flex items-center gap-2 py-3 px-6 rounded-2xl text-xs font-bold text-black"
                >
                  <span>Continuar al Diagnóstico</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ───────── PASO 2: DIAGNÓSTICO DEL ESTADO ───────── */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Condición de Batería */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <BatteryCharging size={16} className="text-emerald-400" />
                    <span>Salud de Batería de tu Equipo</span>
                  </label>
                  
                  {!tradeInState.batteryUnknown && tradeInState.batteryPercentage && (
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
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
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={40}
                          max={100}
                          value={tradeInState.batteryPercentage || 88}
                          onChange={(e) => handleBatteryInputChange(Number(e.target.value))}
                          placeholder="88"
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-dark-900 border border-white/15 text-sm font-bold text-white focus:outline-none focus:border-white"
                        />
                        <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">%</span>
                      </div>

                      <div className="flex gap-1.5">
                        {[100, 95, 90, 85, 80].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleBatteryInputChange(val)}
                            className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all ${
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
                      En iPhone puedes verlo en: <span className="text-slate-200 font-semibold">Ajustes &gt; Batería &gt; Condición de Batería</span>.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center gap-2.5 text-blue-200 text-xs">
                    <HelpCircle size={16} className="shrink-0 text-blue-400" />
                    <span>Se evaluará y confirmará la condición de batería durante el peritaje técnico de la tienda.</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleToggleUnknownBattery}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                    tradeInState.batteryUnknown
                      ? 'bg-blue-500/20 text-blue-300 border-blue-400/40 shadow-sm'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <HelpCircle size={14} />
                  <span>
                    {tradeInState.batteryUnknown ? '✓ Seleccionado: No tengo esa información' : '❓ No sé / No tengo esa información'}
                  </span>
                </button>
              </div>

              {/* Estado de Pantalla */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <ShieldAlert size={15} className="text-purple-400" />
                  Estado de Pantalla / Vidrio
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'intacta', label: '✨ Impecable / Sin rayas' },
                    { id: 'microrayones', label: '🔍 Microrayones de uso' },
                    { id: 'rajada', label: '⚠️ Rajada o Rota' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateState('screenStatus', s.id as any)}
                      className={`p-3 rounded-xl text-xs font-bold border text-left transition-all ${
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div
                  onClick={() => updateState('faceIdWorking', !tradeInState.faceIdWorking)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
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
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tradeInState.faceIdWorking ? 'bg-emerald-400 text-black' : 'bg-rose-400 text-black'}`}>
                    <CheckCircle2 size={14} />
                  </div>
                </div>

                <div
                  onClick={() => updateState('hasBoxAndCable', !tradeInState.hasBoxAndCable)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    tradeInState.hasBoxAndCable
                      ? 'bg-white/15 border-white/40 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-2">
                    <Box size={16} />
                    <div>
                      <span>Caja & Cable Original</span>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {tradeInState.hasBoxAndCable 
                          ? (isManualMode ? 'Suma valor a tu cotización' : 'Suma +$15 USD') 
                          : 'No los tengo'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tradeInState.hasBoxAndCable ? 'bg-white text-black' : 'bg-white/10 text-slate-500'}`}>
                    <CheckCircle2 size={14} />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-bold text-slate-300"
                >
                  <ArrowLeft size={16} />
                  <span>Atrás</span>
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="btn-liquid-cyan flex items-center gap-2 py-3 px-6 rounded-2xl text-xs font-bold text-black"
                >
                  <span>{isManualMode ? 'Ver Resumen de Diagnóstico' : 'Calcular Cotización'}</span>
                  <Sparkles size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ───────── PASO 3: RESULTADO ───────── */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {isManualMode ? (
                /* MODALIDAD MANUAL */
                <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-900 border border-white/20 text-center space-y-4 shadow-xl">
                  <div className="w-12 h-12 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 flex items-center justify-center mx-auto">
                    <WhatsAppIcon size={24} className="text-[#25D366] fill-[#25D366]" />
                  </div>

                  <div>
                    <h4 className="text-xl font-extrabold text-white">
                      ¡Diagnóstico Listo para Cotizar!
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                      Tu <strong className="text-white">{tradeInState.model} ({tradeInState.storage})</strong> califica para nuestro Plan Canje. Un asesor comercial te dará la cotización máxima al instante vía WhatsApp.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-1.5 max-w-md mx-auto">
                    <div className="flex justify-between text-slate-300">
                      <span>Equipo:</span>
                      <strong className="text-white">{tradeInState.brand} {tradeInState.model} {tradeInState.storage}</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Batería:</span>
                      <strong className="text-emerald-400">
                        {tradeInState.batteryUnknown ? 'A verificar en peritaje' : `${tradeInState.batteryPercentage}%`}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Pantalla:</span>
                      <strong className="text-white capitalize">{tradeInState.screenStatus}</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Caja y Accesorios:</span>
                      <strong className="text-white">{tradeInState.hasBoxAndCable ? 'Sí (Incluye caja y cable)' : 'No'}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                /* MODALIDAD AUTOMÁTICA */
                <>
                  <div className="p-5 rounded-3xl bg-white/[0.04] border border-white/20 text-center relative overflow-hidden shadow-xl">
                    <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-slate-200 border border-white/20">
                      Valuación Estimada
                    </div>

                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Tomamos tu {evaluation.tradeInModel} ({evaluation.tradeInStorage}) en:
                    </p>

                    <div className="my-2 flex items-baseline justify-center gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-white">
                        ${evaluation.estimatedValueUSD}
                      </span>
                      <span className="text-lg font-bold text-slate-400">USD</span>
                    </div>

                    {config.showArsPrice && (
                      <p className="text-xs text-emerald-400 font-bold">
                        ≈ ${(evaluation.estimatedValueUSD * config.usdToArsRate).toLocaleString('es-AR')} ARS
                      </p>
                    )}
                  </div>

                  {targetProduct && (() => {
                    const currentDiffUSD = Math.max(0, targetProduct.priceUSD - evaluation.estimatedValueUSD);
                    return (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-zinc-900 border border-emerald-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block">
                            DIFERENCIA A ABONAR:
                          </span>
                          <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                            ${currentDiffUSD} USD
                          </span>
                          {config.showArsPrice && (
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              ≈ ${(currentDiffUSD * config.usdToArsRate).toLocaleString('es-AR')} ARS <span className="text-[10px] text-slate-500 font-normal">(*sujeto a cotización del Dólar Blue al abonar)</span>
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Ahorrás entregando tu equipo</span>
                          <span className="text-xs font-bold text-emerald-300">-${evaluation.estimatedValueUSD} USD</span>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}

              {/* SECCIÓN: EQUIPO QUE DESEAS LLEVAR */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Equipo que deseas llevarte:
                </label>

                {targetProduct ? (
                  <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                    targetProduct.productType === 'Usado' 
                      ? 'bg-purple-950/20 border-purple-500/40' 
                      : 'bg-white/[0.04] border-white/20'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={targetProduct.image}
                        alt={targetProduct.name}
                        className="w-14 h-14 object-contain filter drop-shadow-md shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white truncate">{targetProduct.name}</h4>
                          
                          {targetProduct.productType === 'Usado' ? (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/25 text-purple-300 border border-purple-400/40 shrink-0">
                              🔄 Usado · 🔋 Batería {targetProduct.batteryPercentage || 90}%
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-slate-100 border border-white/25 shrink-0">
                              📦 Sellado (Gtía Apple)
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 font-semibold mt-0.5">
                          Valor lista: <strong className="text-white">${targetProduct.priceUSD} USD</strong> · {targetProduct.warranty}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setTargetProduct(null)}
                      className="text-xs text-slate-300 hover:text-white underline font-bold shrink-0"
                    >
                      Cambiar equipo
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-semibold text-slate-300">Selecciona un modelo del catálogo:</span>
                      
                      <div className="flex gap-1">
                        {(['Todos', 'Sellado', 'Usado'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTargetTypeFilter(t)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
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

                    <div className="max-h-52 overflow-y-auto no-scrollbar space-y-2 pr-1">
                      {filteredTargetProducts.map((p) => {
                        const isUsado = p.productType === 'Usado';
                        const batPct = p.batteryPercentage || 90;

                        return (
                          <div
                            key={p.id}
                            onClick={() => setTargetProduct(p)}
                            className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all gap-3 ${
                              isUsado
                                ? 'bg-purple-950/15 hover:bg-purple-900/30 border-purple-500/20 hover:border-purple-400/50'
                                : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/30'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={p.image} alt={p.name} className="w-10 h-10 object-contain shrink-0" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="text-xs font-bold text-white truncate">{p.name}</h5>
                                  
                                  {isUsado ? (
                                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 shrink-0">
                                      🔄 Usado · 🔋 {batPct}%
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/15 text-slate-200 border border-white/25 shrink-0">
                                      📦 Sellado
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 truncate mt-0.5">{p.specs}</p>
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

              {/* Botones de Acción Oficiales de WhatsApp */}
              <div className="pt-2 space-y-3">
                {targetProduct ? (
                  <button
                    type="button"
                    onClick={() => onCanjeWhatsApp(evaluation, targetProduct, tradeInState)}
                    className="w-full btn-liquid-whatsapp flex items-center justify-center gap-2 py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl text-xs sm:text-sm font-black text-black shadow-[0_0_25px_rgba(37,211,102,0.4)] hover:shadow-[0_0_35px_rgba(37,211,102,0.6)] active:scale-95 transition-all text-center leading-snug"
                  >
                    <WhatsAppIcon size={18} className="text-black fill-black shrink-0" />
                    <span>{isManualMode ? 'Enviar Diagnóstico por WhatsApp' : 'Canjear por WhatsApp con esta Cotización'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onConsultGeneralCanje(evaluation, tradeInState)}
                    className="w-full btn-liquid-whatsapp flex items-center justify-center gap-2 py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl text-xs sm:text-sm font-black text-black shadow-[0_0_25px_rgba(37,211,102,0.4)] active:scale-95 transition-all text-center leading-snug"
                  >
                    <WhatsAppIcon size={18} className="text-black fill-black shrink-0" />
                    <span>Cotizar mi Equipo por WhatsApp con un Asesor</span>
                  </button>
                )}

                <button
                  onClick={() => setStep(1)}
                  className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors text-center"
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
