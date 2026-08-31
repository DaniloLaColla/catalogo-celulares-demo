import React from 'react';

export const LiquidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#000000] will-change-transform">
      {/* Fondo degradado optimizado (cero carga continua en GPU/batería) */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]"
      />
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_50%,rgba(59,130,246,0.06),transparent)]"
      />
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_100%,rgba(168,85,247,0.05),transparent)]"
      />

      {/* Micro-malla de textura óptica sutil */}
      <div 
        className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]"
      />
    </div>
  );
};
