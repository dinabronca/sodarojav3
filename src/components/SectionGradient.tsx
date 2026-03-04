import React from 'react';

// Noise gradient that goes between sections — subtle color shift
// Variants: 'red' = warm shift, 'blue' = cool shift, 'neutral' = just noise
export const SectionGradient: React.FC<{ variant?: 'red' | 'blue' | 'neutral'; flip?: boolean }> = ({ variant = 'neutral', flip = false }) => {
  const colors = {
    red: 'rgba(196,85,85,0.025)',
    blue: 'rgba(100,120,180,0.02)',
    neutral: 'rgba(212,197,176,0.015)',
  };
  const c = colors[variant];
  
  return (
    <div className="relative h-32 sm:h-48 w-full overflow-hidden pointer-events-none" style={{ marginTop: '-1px', marginBottom: '-1px' }}>
      {/* Gradient wash */}
      <div className="absolute inset-0" style={{
        background: flip
          ? `linear-gradient(to top, transparent 0%, ${c} 40%, ${c} 60%, transparent 100%)`
          : `linear-gradient(to bottom, transparent 0%, ${c} 40%, ${c} 60%, transparent 100%)`,
      }} />
      {/* Noise texture overlay */}
      <div className="absolute inset-0" style={{
        opacity: 0.4,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }} />
    </div>
  );
};
