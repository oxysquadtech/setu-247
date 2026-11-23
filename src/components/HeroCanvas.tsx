import React, { useEffect, useRef } from 'react';

interface Particle {
  t: number; // progress along curve [0..1]
  speed: number;
  size: number;
  alpha: number;
  pathIndex: number;
}

export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for subtle parallax
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let mouseX = 0.5;
    let mouseY = 0.5;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / width;
      targetMouseY = e.clientY / height;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Define Bridge Curves (in normalized coords)
    // Multiple elegant architectural cables connecting two endpoints
    const curves = [
      { start: [0.1, 0.72], cp1: [0.35, 0.42], cp2: [0.65, 0.42], end: [0.9, 0.72], alpha: 0.22, width: 1.5 },
      { start: [0.15, 0.75], cp1: [0.38, 0.46], cp2: [0.62, 0.46], end: [0.85, 0.75], alpha: 0.16, width: 1.2 },
      { start: [0.08, 0.78], cp1: [0.32, 0.52], cp2: [0.68, 0.52], end: [0.92, 0.78], alpha: 0.12, width: 1.0 },
      // Upward tension cables / convergence
      { start: [0.25, 0.82], cp1: [0.42, 0.48], cp2: [0.58, 0.48], end: [0.75, 0.82], alpha: 0.25, width: 1.8 },
    ];

    // Seed light-signal pulses
    const particles: Particle[] = Array.from({ length: 28 }, () => ({
      t: Math.random(),
      speed: 0.0015 + Math.random() * 0.0025,
      size: 1.5 + Math.random() * 2.2,
      alpha: 0.4 + Math.random() * 0.5,
      pathIndex: Math.floor(Math.random() * curves.length),
    }));

    // Cubic bezier evaluation helper
    const getBezierPoint = (t: number, p0: number[], p1: number[], p2: number[], p3: number[]) => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      const x = uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0];
      const y = uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1];
      return [x, y];
    };

    let time = 0;

    const render = () => {
      time += 0.01;
      // Smooth interpolation for mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const offsetX = (mouseX - 0.5) * 40;
      const offsetY = (mouseY - 0.5) * 20;

      ctx.clearRect(0, 0, width, height);

      // 1. Perspective Dimensional Grid on the Floor
      const horizonY = height * 0.62 + offsetY * 0.5;
      ctx.lineWidth = 0.5;

      // Vanishing point rays
      const vpX = width * 0.5 + offsetX;
      const rays = 24;
      for (let i = 0; i <= rays; i++) {
        const xBottom = (width / rays) * i;
        ctx.strokeStyle = `rgba(32, 35, 41, ${0.15 + (1 - Math.abs(i - rays / 2) / (rays / 2)) * 0.25})`;
        ctx.beginPath();
        ctx.moveTo(vpX, horizonY);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // Horizontal grid lines receding towards horizon
      for (let j = 1; j <= 9; j++) {
        const factor = Math.pow(j / 9, 2.2);
        const y = horizonY + factor * (height - horizonY);
        ctx.strokeStyle = `rgba(56, 189, 248, ${factor * 0.12})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Horizon Aura & Ambient Core
      const horizonGlow = ctx.createRadialGradient(
        width * 0.5 + offsetX,
        horizonY - 40,
        10,
        width * 0.5 + offsetX,
        horizonY,
        width * 0.45
      );
      horizonGlow.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      horizonGlow.addColorStop(0.5, 'rgba(32, 35, 41, 0.08)');
      horizonGlow.addColorStop(1, 'rgba(16, 17, 20, 0)');

      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Architectural Bridge Arches
      curves.forEach((curve, index) => {
        const sway = Math.sin(time + index) * 5;
        const p0 = [curve.start[0] * width, curve.start[1] * height + offsetY];
        const p1 = [curve.cp1[0] * width + offsetX * 0.6, curve.cp1[1] * height + sway];
        const p2 = [curve.cp2[0] * width + offsetX * 0.6, curve.cp2[1] * height + sway];
        const p3 = [curve.end[0] * width, curve.end[1] * height + offsetY];

        // Cable path
        ctx.beginPath();
        ctx.moveTo(p0[0], p0[1]);
        ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
        ctx.strokeStyle = index === 3 ? 'rgba(56, 189, 248, 0.35)' : `rgba(232, 233, 235, ${curve.alpha})`;
        ctx.lineWidth = curve.width;
        ctx.stroke();

        // Vertical suspension struts (ties between bridge deck and baseline)
        if (index === 0) {
          const struts = 16;
          for (let s = 1; s < struts; s++) {
            const st = s / struts;
            const pt = getBezierPoint(st, p0, p1, p2, p3);
            ctx.beginPath();
            ctx.moveTo(pt[0], pt[1]);
            ctx.lineTo(pt[0], pt[1] + 35);
            ctx.strokeStyle = 'rgba(116, 121, 130, 0.14)';
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      });

      // 4. Render Flowing Pulses along the Bridge Curves
      if (!prefersReducedMotion) {
        particles.forEach((p) => {
          p.t += p.speed;
          if (p.t > 1) {
            p.t = 0;
            p.pathIndex = Math.floor(Math.random() * curves.length);
          }

          const curve = curves[p.pathIndex];
          const sway = Math.sin(time + p.pathIndex) * 5;
          const p0 = [curve.start[0] * width, curve.start[1] * height + offsetY];
          const p1 = [curve.cp1[0] * width + offsetX * 0.6, curve.cp1[1] * height + sway];
          const p2 = [curve.cp2[0] * width + offsetX * 0.6, curve.cp2[1] * height + sway];
          const p3 = [curve.end[0] * width, curve.end[1] * height + offsetY];

          const pos = getBezierPoint(p.t, p0, p1, p2, p3);

          // Pulse glow
          ctx.beginPath();
          ctx.arc(pos[0], pos[1], p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * 0.25})`;
          ctx.fill();

          // Pulse core
          ctx.beginPath();
          ctx.arc(pos[0], pos[1], p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.fill();
        });
      }

      // 5. Subtle ambient floating starlight/nodes in background
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full z-0 opacity-80"
      aria-hidden="true"
    />
  );
};
