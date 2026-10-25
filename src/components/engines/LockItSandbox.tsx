import React, { useEffect, useRef, useState } from 'react';
import { CELESTIAL_PLANETS, calculatePlanetPosition } from '../../engines/lockit-core';
import { Play, Pause, RotateCcw, FastForward, Rewind } from 'lucide-react';

interface LockItSandboxProps {
  isDark?: boolean;
}

export const LockItSandbox: React.FC<LockItSandboxProps> = ({ isDark = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [visualDate, setVisualDate] = useState<Date>(new Date());

  const stateRef = useRef({
    isPlaying: true,
    dilation: 1,
    visualTime: new Date(),
    lastFrame: performance.now()
  });

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
    stateRef.current.dilation = speedMultiplier;
  }, [isPlaying, speedMultiplier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let reqId: number;

    const resize = () => {
      if (canvas.parentElement) {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = (now: number) => {
      const delta = (now - stateRef.current.lastFrame) / 1000;
      stateRef.current.lastFrame = now;

      if (stateRef.current.isPlaying) {
        // Apply time dilation in seconds
        const msAdvance = delta * 1000 * stateRef.current.dilation;
        stateRef.current.visualTime = new Date(stateRef.current.visualTime.getTime() + msAdvance);
        setVisualDate(new Date(stateRef.current.visualTime));
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.38;

      ctx.save();
      ctx.translate(cx, cy);

      const strokeColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)';

      // Central Dial Rings
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * (radius * 0.25), Math.sin(ang) * (radius * 0.25));
        ctx.lineTo(Math.cos(ang) * (radius * 1.15), Math.sin(ang) * (radius * 1.15));
        ctx.stroke();
      }

      // Draw planetary orbits
      CELESTIAL_PLANETS.forEach(planet => {
        const { x, y, orbitRadius } = calculatePlanetPosition(planet, stateRef.current.visualTime, radius);

        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.arc(0, 0, orbitRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = planet.color;
        if (planet.glow) {
          ctx.shadowBlur = 18;
          ctx.shadowColor = planet.color;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.arc(x, y, planet.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Astrolabe Hands
      const date = stateRef.current.visualTime;
      const h = (date.getHours() % 12) + date.getMinutes() / 60;
      const m = date.getMinutes();
      const handColor = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.18)';

      const drawHand = (ang: number, len: number, width: number) => {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = handColor;
        ctx.lineCap = 'round';
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang - Math.PI / 2) * len, Math.sin(ang - Math.PI / 2) * len);
        ctx.stroke();
      };

      drawHand((h / 12) * Math.PI * 2, radius * 0.45, 3.5);
      drawHand((m / 60) * Math.PI * 2, radius * 0.72, 2);

      ctx.restore();
      reqId = requestAnimationFrame(animate);
    };

    stateRef.current.lastFrame = performance.now();
    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  const resetNow = () => {
    stateRef.current.visualTime = new Date();
    setVisualDate(new Date());
    setSpeedMultiplier(1);
    setIsPlaying(true);
  };

  return (
    <div style={{
      background: 'var(--bg-panel)',
      border: '1px solid var(--border-card)',
      borderRadius: '2.5rem',
      padding: '2rem',
      boxShadow: 'var(--shadow-xl)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--text-subtle)'
          }}>
            Interactive Engine
          </span>
          <h3 style={{ fontSize: '1.75rem', margin: '0.25rem 0 0' }}>LockIt Astrolabe Sandbox</h3>
        </div>
        <div style={{
          fontSize: '0.85rem',
          fontFamily: 'monospace',
          color: 'var(--emerald-600)',
          background: 'var(--stone-100)',
          padding: '0.4rem 0.85rem',
          borderRadius: '9999px',
          border: '1px solid var(--border-subtle)'
        }}>
          {visualDate.toLocaleTimeString()} · {visualDate.toLocaleDateString()}
        </div>
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        height: '380px',
        background: 'var(--stone-50)',
        borderRadius: '2rem',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)'
      }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Control Deck */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        paddingTop: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setSpeedMultiplier(prev => (prev > 1 ? prev / 10 : 0.1))}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '0.75rem',
              background: 'var(--stone-100)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
            title="Slow Down"
          >
            <Rewind size={16} /> 0.1x
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.75rem',
              background: isPlaying ? 'var(--stone-900)' : 'var(--emerald-700)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>

          <button
            onClick={() => setSpeedMultiplier(prev => (prev < 100000 ? prev * 10 : 100000))}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '0.75rem',
              background: 'var(--stone-100)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
            title="Speed Up"
          >
            <FastForward size={16} /> 10x
          </button>

          <button
            onClick={resetNow}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '0.75rem',
              background: 'var(--stone-100)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.8rem'
            }}
            title="Reset to Real-time Now"
          >
            <RotateCcw size={15} /> Now
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Dilation:
          </span>
          <span style={{
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            fontWeight: 700,
            background: 'var(--emerald-50)',
            color: 'var(--emerald-800)',
            padding: '0.25rem 0.6rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--emerald-200)'
          }}>
            {speedMultiplier}x
          </span>
        </div>
      </div>
    </div>
  );
};
