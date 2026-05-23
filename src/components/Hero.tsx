"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { hero, nav } from "@/data/content";
import { T, TLines, useLang } from "./lang";

/**
 * Hero with a local probability-cloud canvas. Thousands of points drift as a
 * superposed cloud; near the cursor they "collapse" inward — the observer
 * effect made literal. Title + opening statement rise on a GSAP timeline.
 */
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useLang();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-rise", { opacity: 0, y: 36, filter: "blur(10px)" });
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".hero-iris", { opacity: 1, scale: 1, duration: 2.2, ease: "power2.out" }, 0)
        .to(".hero-rise", { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, stagger: 0.16 }, 0.4);
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext("2d", { alpha: true });
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
    window.addEventListener("resize", resize);

    const N = reduce ? 220 : 720;
    const pts = Array.from({ length: N }, () => ({
      bx: Math.random(), by: Math.random(),  // base position (0..1)
      x: 0, y: 0, vx: 0, vy: 0,
      r: Math.random() * 1.6 + 0.5,
      hue: Math.random(),
      ph: Math.random() * Math.PI * 2,
    }));
    const palette = ["#3fc6f5", "#9a6bff", "#a6ecff", "#cdb2ff", "#f7d98a"];

    const mouse = { x: -9999, y: -9999, on: false };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; mouse.on = true;
    };
    const onLeave = () => { mouse.on = false; mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerout", onLeave);

    let raf = 0; let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.008;
      c.clearRect(0, 0, w, h);
      for (const p of pts) {
        // home position drifts gently (superposition cloud)
        const hx = p.bx * w + Math.sin(t + p.ph) * 14;
        const hy = p.by * h + Math.cos(t * 0.9 + p.ph) * 14;
        // observer pull: collapse toward cursor
        let tx = hx, ty = hy;
        if (mouse.on) {
          const dx = mouse.x - hx, dy = mouse.y - hy;
          const d = Math.hypot(dx, dy);
          if (d < 200) {
            const f = (1 - d / 200) ** 2;
            tx = hx + dx * f * 0.85;
            ty = hy + dy * f * 0.85;
          }
        }
        p.vx += (tx - (p.x || hx)) * 0.06; p.vy += (ty - (p.y || hy)) * 0.06;
        p.vx *= 0.82; p.vy *= 0.82;
        p.x = (p.x || hx) + p.vx; p.y = (p.y || hy) + p.vy;
        const col = palette[Math.floor(p.hue * palette.length)];
        const tw = 0.45 + 0.55 * Math.sin(t * 2 + p.ph);
        c.beginPath();
        c.arc(p.x, p.y, p.r * (0.7 + 0.6 * tw), 0, Math.PI * 2);
        c.fillStyle = col;
        c.globalAlpha = 0.25 + 0.5 * tw;
        c.fill();
      }
      c.globalAlpha = 1;
    };
    draw();
    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else draw(); };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <section id="top" ref={root} className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
      {/* probability-cloud canvas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* breathing iris behind the title */}
      <div className="hero-iris pointer-events-none absolute inset-0 grid place-items-center opacity-0" style={{ transform: "scale(0.85)" }}>
        <div className="relative h-[min(82vw,680px)] w-[min(82vw,680px)]">
          <div
            className="absolute inset-0 rounded-full opacity-70 animate-breathe"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(251,233,184,0.08) 0%, rgba(63,198,245,0.10) 24%, rgba(154,107,255,0.12) 48%, transparent 70%)",
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-synapse-500/15" />
          <div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pulse-400/10" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <p className="hero-rise mb-7 font-mono text-[0.66rem] uppercase tracking-[0.42em] text-pulse-300/80">
          <T v={hero.kicker} />
        </p>

        <h1 className="hero-rise font-display text-[3rem] font-light leading-[1.02] tracking-tight sm:text-7xl md:text-[6.4rem]">
          <T v={hero.title} className="aurora-text" />
        </h1>

        <p className="hero-rise mx-auto mt-7 max-w-3xl font-display text-2xl font-light italic leading-snug text-ether-100 sm:text-3xl md:text-[2.4rem]">
          <T v={hero.statement} />
        </p>

        <p className="hero-rise mx-auto mt-7 max-w-2xl text-[0.98rem] font-light leading-relaxed text-ether-300/80 sm:text-base">
          <TLines v={hero.subtitle} />
        </p>

        <div className="hero-rise mt-11 flex flex-wrap items-center justify-center gap-3">
          {hero.buttons.map((b, i) => (
            <a
              key={i}
              href={b.href}
              className={`glass rounded-full px-6 py-3 text-sm tracking-wide transition duration-300 hover:-translate-y-0.5 ${
                i === 0
                  ? "border-pulse-400/40 text-ether-50 shadow-pulse hover:border-pulse-300/70"
                  : "text-ether-200 hover:border-synapse-400/40 hover:text-ether-50"
              }`}
            >
              <T v={b.label} />
            </a>
          ))}
        </div>
      </div>

      <div className="hero-rise absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-ether-500">
          <T v={nav.hint} />
        </span>
        <span className="scroll-line" />
      </div>
    </section>
  );
}
