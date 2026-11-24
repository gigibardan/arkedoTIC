import React, { useEffect, useRef, useState } from 'react';

export type ShowcasePreviewVariant = 'arcade' | 'duel' | 'city' | 'leonida';

interface ShowcaseCanvasPreviewProps {
  variant: ShowcasePreviewVariant;
  className?: string;
  label?: string;
}

export const ShowcaseCanvasPreview: React.FC<ShowcaseCanvasPreviewProps> = ({
  variant,
  className = '',
  label,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = 360;
    const height = 104;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    let frameId = 0;
    let phase = 0;

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      if (variant === 'arcade') {
        // Deep retro grid + cyber pacman / falling voxel blocks
        const bg = ctx.createLinearGradient(0, 0, width, height);
        bg.addColorStop(0, '#090d1f');
        bg.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(99, 102, 241, 0.16)';
        ctx.lineWidth = 1;
        for (let x = (t * 24) % 24; x < width; x += 24) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 16; y < height; y += 22) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Data pellets row
        for (let i = 0; i < 8; i++) {
          const px = ((i * 46 - t * 48) % (width + 40)) + (i * 46 - t * 48 < -20 ? width + 40 : 0);
          ctx.fillStyle = i % 3 === 0 ? '#34d399' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(px, 68, i % 3 === 0 ? 4 : 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Animated Cyber Pac-Runner
        const mouth = 0.25 + Math.abs(Math.sin(t * 7)) * 0.45;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(54, 68);
        ctx.arc(54, 68, 12, mouth, Math.PI * 2 - mouth);
        ctx.closePath();
        ctx.fill();

        // Floating voxel blocks
        const blocks = [
          { x: 135, y: 22, c: '#818cf8' },
          { x: 155, y: 22, c: '#6366f1' },
          { x: 175, y: 22, c: '#38bdf8' },
          { x: 255, y: 28, c: '#f472b6' },
          { x: 275, y: 28, c: '#ec4899' },
        ];
        blocks.forEach((b, idx) => {
          const dy = Math.sin(t * 2.5 + idx * 0.8) * 3;
          ctx.fillStyle = b.c;
          ctx.fillRect(b.x, b.y + dy, 16, 12);
          ctx.strokeStyle = 'rgba(255,255,255,0.28)';
          ctx.strokeRect(b.x, b.y + dy, 16, 12);
        });
      } else if (variant === 'duel') {
        // Dual split-screen 1v1 race lanes
        const bg = ctx.createLinearGradient(0, 0, width, height);
        bg.addColorStop(0, '#130b1c');
        bg.addColorStop(1, '#230b1a');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        // Center divider + finish line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Checkered finish bar on right
        for (let row = 0; row < 10; row++) {
          ctx.fillStyle = row % 2 === 0 ? 'rgba(255,255,255,0.55)' : 'rgba(15,23,42,0.7)';
          ctx.fillRect(width - 22, 10 + row * 8.4, 8, 8.4);
        }

        // P1 vs P2 racers
        const p1Prog = 0.25 + (0.52 * (Math.sin(t * 1.4) * 0.5 + 0.5));
        const p2Prog = 0.22 + (0.55 * (Math.sin(t * 1.4 - 0.7) * 0.5 + 0.5));
        const p1X = 30 + p1Prog * (width - 95);
        const p2X = 30 + p2Prog * (width - 95);

        // Lane 1 (Cyan)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.fillRect(16, 20, p1X, 18);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(p1X + 8, 18, 22, 22);

        // Lane 2 (Rose)
        ctx.fillStyle = 'rgba(251, 113, 133, 0.22)';
        ctx.fillRect(16, 64, p2X, 18);
        ctx.fillStyle = '#fb7185';
        ctx.fillRect(p2X + 8, 62, 22, 22);

        // Energy sparks between lanes
        const sparkX = 40 + ((t * 140) % (width - 80));
        ctx.fillStyle = '#fde047';
        ctx.fillRect(sparkX, height / 2 - 1.5, 16, 3);
      } else if (variant === 'city') {
        // Cyber City skyline + 5G signal rings + ByteCoins rising
        const bg = ctx.createLinearGradient(0, 0, 0, height);
        bg.addColorStop(0, '#041224');
        bg.addColorStop(1, '#082f49');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        const towers = [
          { x: 24, w: 32, h: 46, c: '#0e7490' },
          { x: 64, w: 38, h: 66, c: '#0284c7' },
          { x: 112, w: 28, h: 40, c: '#0891b2' },
          { x: 152, w: 46, h: 74, c: '#06b6d4' },
          { x: 210, w: 34, h: 52, c: '#0369a1' },
          { x: 256, w: 40, h: 68, c: '#0891b2' },
          { x: 308, w: 30, h: 44, c: '#0e7490' },
        ];

        towers.forEach((tw, idx) => {
          const top = height - tw.h;
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(tw.x, top, tw.w, tw.h);
          ctx.strokeStyle = tw.c;
          ctx.lineWidth = 1.2;
          ctx.strokeRect(tw.x, top, tw.w, tw.h);

          // Animated lit windows
          ctx.fillStyle = idx % 2 === 0 ? 'rgba(34, 211, 238, 0.7)' : 'rgba(52, 211, 153, 0.7)';
          for (let wy = top + 8; wy < height - 10; wy += 11) {
            ctx.fillRect(tw.x + 6, wy, tw.w - 12, 4);
          }
        });

        // Expanding 5G wave from main tower (x: 175, y: 28)
        const pulse = (t * 0.9) % 1;
        ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - pulse) * 0.75})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(175, 24, 6 + pulse * 26, 0, Math.PI * 2);
        ctx.stroke();

        // Rising golden ByteCoin orbs
        for (let i = 0; i < 4; i++) {
          const cy = height - (((t * 28 + i * 26) % (height - 12)) + 6);
          const cx = 42 + i * 86 + Math.sin(t * 2 + i) * 6;
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Leonida: Vice Beach sunset skyline + synthwave highway + neon runner
        const sky = ctx.createLinearGradient(0, 0, width, height);
        sky.addColorStop(0, '#1e0933');
        sky.addColorStop(0.55, '#4c0538');
        sky.addColorStop(1, '#090d1e');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, width, height);

        // Vice Sun
        ctx.fillStyle = 'rgba(251, 113, 133, 0.35)';
        ctx.beginPath();
        ctx.arc(width * 0.72, 46, 26, 0, Math.PI * 2);
        ctx.fill();

        // Perspective highway grid
        const horizon = 56;
        ctx.fillStyle = '#090918';
        ctx.fillRect(0, horizon, width, height - horizon);
        ctx.strokeStyle = 'rgba(232, 121, 249, 0.36)';
        ctx.lineWidth = 1;
        for (let i = -4; i <= 4; i++) {
          ctx.beginPath();
          ctx.moveTo(width * 0.5 + i * 20, horizon);
          ctx.lineTo(width * 0.5 + i * 68, height);
          ctx.stroke();
        }
        for (let r = 0; r < 5; r++) {
          const p = ((r / 5 + t * 0.65) % 1);
          const y = horizon + p * p * (height - horizon);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Neon supercar cruising smoothly
        const carX = 68 + Math.sin(t * 1.8) * 32;
        ctx.fillStyle = '#e879f9';
        ctx.fillRect(carX, 74, 42, 12);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(carX + 8, 69, 22, 6);
        // Headlight trail
        const beam = ctx.createLinearGradient(carX + 42, 78, carX + 100, 78);
        beam.addColorStop(0, 'rgba(34, 211, 238, 0.65)');
        beam.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = beam;
        ctx.fillRect(carX + 42, 75, 58, 8);
      }
    };

    if (prefersReducedMotion || !isVisible) {
      drawFrame(0.6);
      return;
    }

    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      phase += dt * (isHovered ? 1.8 : 1);
      drawFrame(phase);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [variant, isVisible, isHovered]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-xl overflow-hidden border border-white/10 bg-slate-950/90 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-24 sm:h-28 block object-cover"
        aria-hidden="true"
      />
      {label && (
        <span className="absolute bottom-1.5 right-2 text-[10px] font-mono font-semibold text-white/80 bg-slate-950/75 px-2 py-0.5 rounded-md border border-white/10 pointer-events-none">
          {label}
        </span>
      )}
    </div>
  );
};
