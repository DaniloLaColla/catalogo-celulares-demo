interface LiquidBackgroundProps {
  bgTexture?: string;
  aesthetic?: string;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({ bgTexture, aesthetic }) => {
  const isLeather = aesthetic === 'leather-luxury' || Boolean(bgTexture);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#08080A] will-change-transform">
      {isLeather ? (
        <>
          {/* Textura de Cuero Negro Genuino Tiled de Alta Calidad (Sin logos ni letras) */}
          <div 
            className="absolute inset-0 bg-repeat opacity-[0.22]"
            style={{ 
              backgroundImage: `url("/tenants/istore-regina/pure-leather-black.jpg")`,
              backgroundSize: '360px auto'
            }}
          />
          {/* Iluminación de Estudio Apple Luxury (Viñeta suave) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#08080A]/90 via-transparent to-[#08080A]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(255,255,255,0.05),transparent)]" />
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};
