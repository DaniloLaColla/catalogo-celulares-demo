import React from 'react';

export const LiquidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#000000]">
      {/* Orbe 1: Humo Titanio Superior */}
      <div 
        className="absolute -top-[15%] left-[15%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-slate-400/10 via-zinc-600/5 to-transparent blur-[140px] animate-float-slow"
      />

      {/* Orbe 2: Grafito Profundo Derecho */}
      <div 
        className="absolute top-[35%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-zinc-700/10 via-neutral-800/10 to-transparent blur-[150px] animate-float-reverse"
      />

      {/* Orbe 3: Plata Especular Inferior */}
      <div 
        className="absolute -bottom-[10%] left-[20%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-slate-500/10 via-zinc-700/5 to-transparent blur-[130px] animate-pulse-slow"
      />

      {/* Micro-malla de luz y textura óptica sutil */}
      <div 
        className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]"
      />
    </div>
  );
};
