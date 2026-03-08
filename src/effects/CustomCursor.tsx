import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    // Solo en desktop
    if (window.innerWidth < 1024 || 'ontouchstart' in window) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onHoverCheck = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isHoverable = el.closest('a, button, [data-cursor-hover], .hoverable');
      setHovering(!!isHoverable);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mousemove', onHoverCheck, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    // Smooth ring follow
    const animate = () => {
      const lerp = 0.12;
      ringPos.current.x += (pos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * lerp;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousemove', onHoverCheck);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (typeof window !== 'undefined' && (window.innerWidth < 1024 || 'ontouchstart' in window)) return null;

  return (
    <>
      <style>{`
        body { cursor: none !important; }
        a, button, [data-cursor-hover], .hoverable { cursor: none !important; }
        .restore-cursor, .restore-cursor * { cursor: auto !important; }
        input, textarea, select { cursor: text !important; }
      `}</style>

      {/* Dot — snappy, follows exact position */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 8, height: 8,
          borderRadius: '50%',
          background: clicking
            ? 'rgba(212, 197, 176, 0.95)'
            : hovering
            ? 'rgba(212, 197, 176, 0.85)'
            : 'rgba(196, 85, 85, 0.9)',
          boxShadow: clicking
            ? '0 0 12px rgba(212,197,176,0.6), 0 0 24px rgba(212,197,176,0.2)'
            : hovering
            ? '0 0 10px rgba(212,197,176,0.5)'
            : '0 0 8px rgba(196,85,85,0.5), 0 0 16px rgba(196,85,85,0.15)',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: visible ? 1 : 0,
          transition: 'background 0.2s ease, box-shadow 0.2s ease, opacity 0.3s ease',
          willChange: 'transform',
        }}
      />

      {/* Ring — lags behind for elegance */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: hovering ? 40 : clicking ? 24 : 32,
          height: hovering ? 40 : clicking ? 24 : 32,
          borderRadius: '50%',
          border: `1px solid ${hovering ? 'rgba(212,197,176,0.5)' : 'rgba(196,85,85,0.35)'}`,
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: visible ? 1 : 0,
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, opacity 0.3s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
};
