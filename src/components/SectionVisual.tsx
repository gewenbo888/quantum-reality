"use client";

import { useEffect, useRef } from "react";

export type Variant = "wave" | "cloud" | "eye" | "qubit" | "complex" | "blackhole" | "mandala";

/**
 * One canvas, several quantum motifs. Each section's glass panel renders a
 * lightweight, GPU-friendly 2D animation tuned to its theme.
 */
export default function SectionVisual({ variant, className }: { variant: Variant; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const c = canvas.getContext("2d");
    if (!c) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * DPR; canvas.height = h * DPR;
      c.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const CYAN = "#3fc6f5", VIOLET = "#9a6bff", GOLD = "#f2c45a", ICE = "#a6ecff";

    let raf = 0, t = 0;
    const speed = reduce ? 0 : 1;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.01 * (speed || 1);
      c.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;

      if (variant === "wave") {
        // double-slit interference fringes building
        for (let x = 0; x < w; x += 2) {
          const k = (x - cx) / 26;
          const env = Math.exp(-(((x - cx) / (w * 0.42)) ** 2));
          const amp = Math.cos(k) ** 2 * env;
          const y = cy - (amp - 0.5) * h * 0.7;
          c.fillStyle = `rgba(63,198,245,${0.05 + amp * 0.5})`;
          c.fillRect(x, y, 2, cy + h * 0.4 - y);
        }
        // travelling wavefronts
        for (let i = 0; i < 5; i++) {
          const r = ((t * 60 + i * 60) % 360);
          c.beginPath();
          c.arc(cx, cy * 0.5, r, 0, Math.PI * 2);
          c.strokeStyle = `rgba(166,236,255,${0.25 * (1 - r / 360)})`;
          c.lineWidth = 1;
          c.stroke();
        }
      }

      else if (variant === "cloud") {
        // electron orbital probability cloud (p-orbital lobes)
        const n = 1400;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 * 7 + t * 0.5;
          const lobe = Math.sin(a * 0.5);
          const rr = (Math.abs(lobe)) * Math.min(w, h) * 0.36 * (0.6 + 0.4 * Math.sin(i * 12.9898 + t));
          const x = cx + Math.cos(a) * rr;
          const y = cy + Math.sin(a) * rr * 0.92;
          const al = 0.18 + 0.32 * Math.abs(lobe);
          c.fillStyle = lobe > 0 ? `rgba(154,107,255,${al})` : `rgba(63,198,245,${al})`;
          c.fillRect(x, y, 1.6, 1.6);
        }
        c.beginPath(); c.arc(cx, cy, 3, 0, Math.PI * 2);
        c.fillStyle = ICE; c.fill();
      }

      else if (variant === "eye") {
        // observer iris that contracts with a slow "blink" — measurement
        const blink = 0.5 + 0.5 * Math.sin(t * 0.9);
        for (let ring = 0; ring < 5; ring++) {
          const r = (Math.min(w, h) * 0.12) + ring * 22 + blink * 8;
          c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2);
          c.strokeStyle = `rgba(154,107,255,${0.3 - ring * 0.05})`;
          c.lineWidth = 1.4; c.stroke();
        }
        const grd = c.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.18);
        grd.addColorStop(0, `rgba(166,236,255,${0.5 + blink * 0.3})`);
        grd.addColorStop(1, "rgba(63,198,245,0)");
        c.fillStyle = grd;
        c.beginPath(); c.arc(cx, cy, Math.min(w, h) * 0.18, 0, Math.PI * 2); c.fill();
        // converging measurement rays
        for (let i = 0; i < 16; i++) {
          const ang = (i / 16) * Math.PI * 2 + t * 0.3;
          const r1 = Math.min(w, h) * 0.46, r2 = Math.min(w, h) * 0.22 - blink * 12;
          c.beginPath();
          c.moveTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
          c.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
          c.strokeStyle = `rgba(63,198,245,${0.08 + blink * 0.12})`;
          c.lineWidth = 1; c.stroke();
        }
      }

      else if (variant === "qubit") {
        // a rotating bloch-like sphere wireframe with an orbiting state vector
        const R = Math.min(w, h) * 0.34;
        c.strokeStyle = "rgba(111,220,255,0.22)"; c.lineWidth = 1;
        for (let i = 1; i < 6; i++) {
          const ry = R * Math.sin((i / 6) * Math.PI);
          const oy = -R * Math.cos((i / 6) * Math.PI);
          c.beginPath(); c.ellipse(cx, cy + oy, ry, ry * 0.32, 0, 0, Math.PI * 2); c.stroke();
        }
        for (let i = 0; i < 6; i++) {
          const ph = (i / 6) * Math.PI + t * 0.2;
          c.beginPath(); c.ellipse(cx, cy, R * Math.abs(Math.cos(ph)) + 0.01, R, 0, 0, Math.PI * 2); c.stroke();
        }
        // state vector
        const th = t * 0.8, az = t * 1.3;
        const vx = Math.sin(th) * Math.cos(az), vy = Math.cos(th), vz = Math.sin(th) * Math.sin(az);
        const px = cx + vx * R, py = cy - vy * R + vz * R * 0.18;
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(px, py);
        c.strokeStyle = GOLD; c.lineWidth = 2; c.stroke();
        c.beginPath(); c.arc(px, py, 5, 0, Math.PI * 2); c.fillStyle = GOLD; c.fill();
      }

      else if (variant === "complex") {
        // rotating complex-plane phasors — a wavefunction in Hilbert space
        c.strokeStyle = "rgba(205,178,255,0.14)"; c.lineWidth = 1;
        c.beginPath(); c.moveTo(0, cy); c.lineTo(w, cy); c.moveTo(cx, 0); c.lineTo(cx, h); c.stroke();
        const arms = 9;
        let ax = cx, ay = cy;
        for (let i = 0; i < arms; i++) {
          const len = (Math.min(w, h) * 0.32) / (i + 1.4);
          const ang = t * (1 + i * 0.6) + i;
          const nx = ax + Math.cos(ang) * len, ny = ay + Math.sin(ang) * len;
          c.beginPath(); c.moveTo(ax, ay); c.lineTo(nx, ny);
          c.strokeStyle = i % 2 ? `rgba(63,198,245,0.6)` : `rgba(154,107,255,0.6)`;
          c.lineWidth = 1.6; c.stroke();
          c.beginPath(); c.arc(nx, ny, 2.4, 0, Math.PI * 2);
          c.fillStyle = ICE; c.fill();
          ax = nx; ay = ny;
        }
        c.beginPath(); c.arc(ax, ay, 4, 0, Math.PI * 2); c.fillStyle = GOLD; c.fill();
      }

      else if (variant === "blackhole") {
        // warped spacetime grid sinking into a central well
        const N = 16;
        const well = Math.min(w, h) * 0.5;
        c.strokeStyle = "rgba(154,107,255,0.18)"; c.lineWidth = 1;
        const warp = (x: number, y: number) => {
          const dx = x - cx, dy = y - cy;
          const d = Math.hypot(dx, dy) + 1;
          const pull = Math.min(well * 36 / d, 80);
          return [x, y + pull] as const;
        };
        for (let i = 0; i <= N; i++) {
          const gy = (i / N) * h;
          c.beginPath();
          for (let j = 0; j <= N; j++) {
            const gx = (j / N) * w;
            const [px, py] = warp(gx, gy);
            j === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
          }
          c.stroke();
        }
        for (let j = 0; j <= N; j++) {
          const gx = (j / N) * w;
          c.beginPath();
          for (let i = 0; i <= N; i++) {
            const gy = (i / N) * h;
            const [px, py] = warp(gx, gy);
            i === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
          }
          c.stroke();
        }
        // accretion ring + shadow
        c.beginPath(); c.arc(cx, cy + 24, 26, 0, Math.PI * 2); c.fillStyle = "#03040a"; c.fill();
        for (let i = 0; i < 3; i++) {
          c.beginPath(); c.arc(cx, cy + 24, 30 + i * 6 + Math.sin(t * 2) * 2, 0, Math.PI * 2);
          c.strokeStyle = `rgba(247,217,138,${0.4 - i * 0.12})`; c.lineWidth = 2; c.stroke();
        }
      }

      else if (variant === "mandala") {
        // tao-quantum mandala: counter-rotating petals, yin-yang core
        const layers = 4;
        for (let L = 0; L < layers; L++) {
          const petals = 6 + L * 4;
          const rad = Math.min(w, h) * (0.16 + L * 0.07);
          const dir = L % 2 ? -1 : 1;
          for (let i = 0; i < petals; i++) {
            const ang = (i / petals) * Math.PI * 2 + t * 0.2 * dir;
            const x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad;
            c.beginPath(); c.arc(x, y, 3 - L * 0.4, 0, Math.PI * 2);
            c.fillStyle = i % 2 ? `rgba(63,198,245,0.5)` : `rgba(247,217,138,0.5)`;
            c.fill();
          }
          c.beginPath(); c.arc(cx, cy, rad, 0, Math.PI * 2);
          c.strokeStyle = "rgba(205,178,255,0.1)"; c.lineWidth = 1; c.stroke();
        }
        const cr = Math.min(w, h) * 0.08;
        c.save(); c.translate(cx, cy); c.rotate(t * 0.4);
        c.beginPath(); c.arc(0, 0, cr, -Math.PI / 2, Math.PI / 2); c.arc(0, cr / 2, cr / 2, Math.PI / 2, -Math.PI / 2, true); c.arc(0, -cr / 2, cr / 2, Math.PI / 2, -Math.PI / 2); c.closePath();
        c.fillStyle = "rgba(166,236,255,0.55)"; c.fill();
        c.beginPath(); c.arc(0, 0, cr, 0, Math.PI * 2); c.strokeStyle = "rgba(247,217,138,0.4)"; c.stroke();
        c.restore();
      }
    };
    draw();
    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else draw(); };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [variant]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
