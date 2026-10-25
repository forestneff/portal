import React, { useEffect, useRef } from 'react';
import { CELESTIAL_PLANETS, calculatePlanetPosition } from '../../engines/lockit-core';
import type { LockItMode } from '../../types/profile';

interface LockItAstrolabeProps {
  mode: LockItMode;
  isDark?: boolean;
}

export const LockItAstrolabe: React.FC<LockItAstrolabeProps> = ({ mode, isDark = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (mode === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let clockTime = new Date();
    let visualTime = new Date();
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let isScrubbing = false;
    let scrubTimeout: any = null;

    const scrollImpact = mode === 'astrolabe' ? 500000 : 1000;
    const smoothFactor = 0.08;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      isScrubbing = true;
      const currentY = window.scrollY;
      if (currentY === 0) {
        clockTime = new Date();
      } else {
        const delta = currentY - lastScrollY;
        const timeShift = delta * -scrollImpact;
        clockTime = new Date(clockTime.getTime() + timeShift);
      }
      lastScrollY = currentY;
      clearTimeout(scrubTimeout);
      scrubTimeout = setTimeout(() => {
        isScrubbing = false;
      }, 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const drawHand = (ang: number, len: number, width: number, color: string) => {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(ang - Math.PI / 2) * len, Math.sin(ang - Math.PI / 2) * len);
      ctx.stroke();
    };

    const render = (now: number) => {
      const delta = now - lastTime || 0;
      lastTime = now;

      if (!isScrubbing) {
        clockTime = new Date(clockTime.getTime() + delta);
      }

      const diff = clockTime.getTime() - visualTime.getTime();
      if (Math.abs(diff) > 10) {
        visualTime = new Date(visualTime.getTime() + diff * smoothFactor);
      } else {
        visualTime = new Date(clockTime);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.28;

      ctx.save();
      ctx.translate(cx, cy);

      const themeStroke = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.035)';
      const textCol = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';

      if (mode === 'astrolabe') {
        // Radial ray guides (12 divisions)
        ctx.strokeStyle = themeStroke;
        ctx.lineWidth = 1;
        for (let i = 0; i < 12; i++) {
          const ang = (i / 12) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * (radius * 0.3), Math.sin(ang) * (radius * 0.3));
          ctx.lineTo(Math.cos(ang) * (radius * 1.25), Math.sin(ang) * (radius * 1.25));
          ctx.stroke();
        }

        // Concentric orbits & Planets
        CELESTIAL_PLANETS.forEach(p => {
          const { x, y, orbitRadius } = calculatePlanetPosition(p, visualTime, radius);

          ctx.beginPath();
          ctx.strokeStyle = themeStroke;
          ctx.arc(0, 0, orbitRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.fillStyle = p.color;
          if (p.glow) {
            ctx.shadowBlur = 16;
            ctx.shadowColor = p.color;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Hour and Minute Hands
        const h = (visualTime.getHours() % 12) + visualTime.getMinutes() / 60;
        const m = visualTime.getMinutes();
        drawHand((h / 12) * Math.PI * 2, radius * 0.42, 3.5, textCol);
        drawHand((m / 60) * Math.PI * 2, radius * 0.65, 2, textCol);
      } else if (mode === 'analog') {
        // 60 tick dial
        ctx.strokeStyle = themeStroke;
        for (let i = 0; i < 60; i++) {
          const ang = (i / 60) * Math.PI * 2;
          const len = i % 5 === 0 ? 24 : 10;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * (radius - len), Math.sin(ang) * (radius - len));
          ctx.lineTo(Math.cos(ang) * radius, Math.sin(ang) * radius);
          ctx.stroke();
        }

        const h = (visualTime.getHours() % 12) + visualTime.getMinutes() / 60;
        const m = visualTime.getMinutes();
        const s = visualTime.getSeconds() + visualTime.getMilliseconds() / 1000;
        drawHand((h / 12) * Math.PI * 2, radius * 0.55, 4, textCol);
        drawHand((m / 60) * Math.PI * 2, radius * 0.78, 2.5, textCol);
        drawHand((s / 60) * Math.PI * 2, radius * 0.88, 1.5, isDark ? '#34d399' : '#059669');
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrubTimeout);
    };
  }, [mode, isDark]);

  if (mode === 'none') return null;

  return (
    <canvas
      id="global-canvas-bg"
      ref={canvasRef}
      aria-hidden="true"
    />
  );
};
