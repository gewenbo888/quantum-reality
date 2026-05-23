"use client";

import { useEffect, useRef } from "react";
import { closing } from "@/data/content";
import { T, TLines } from "./lang";
import Reveal from "./Reveal";

/**
 * The Edge of Knowledge. An infinite starfield warp — particles streaming
 * outward from the center, dissolving into pure information — beneath the
 * final reveal: "We are the universe observing itself."
 */
export default function Closing() {
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

    const N = reduce ? 160 : 520;
    const stars = Array.from({ length: N }, () => ({
      a: Math.random() * Math.PI * 2,
      r: Math.random() * 0.5,
      z: Math.random(),
      hue: Math.random(),
    }));
    const palette = ["#a6ecff", "#3fc6f5", "#9a6bff", "#f7d98a", "#ffffff"];

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      c.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const maxR = Math.hypot(cx, cy);
      for (const s of stars) {
        s.r += (0.0008 + s.z * 0.0016) * (reduce ? 0 : 1);
        if (s.r > 1) { s.r = 0; s.a = Math.random() * Math.PI * 2; s.hue = Math.random(); }
        const rad = s.r * maxR;
        const x = cx + Math.cos(s.a) * rad;
        const y = cy + Math.sin(s.a) * rad;
        const size = s.r * 2.4 + 0.3;
        const tailX = cx + Math.cos(s.a) * rad * 0.92;
        const tailY = cy + Math.sin(s.a) * rad * 0.92;
        c.beginPath();
        c.moveTo(tailX, tailY); c.lineTo(x, y);
        c.strokeStyle = palette[Math.floor(s.hue * palette.length)];
        c.globalAlpha = Math.min(s.r * 1.2, 0.9);
        c.lineWidth = size;
        c.stroke();
      }
      c.globalAlpha = 1;
    };
    draw();
    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else draw(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <section id="edge" className="relative flex min-h-[100svh] scroll-mt-24 flex-col items-center justify-center overflow-hidden px-5 py-28 text-center">
      <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(3,4,10,0.82) 0%, rgba(3,4,10,0.42) 46%, transparent 74%)" }}
      />

      <Reveal>
        <p className="relative z-10 mb-10 font-mono text-[0.66rem] uppercase tracking-[0.4em] text-pulse-300/70">
          <span className="mr-2 opacity-50">09</span>
          <T v={closing.eyebrow} />
        </p>
      </Reveal>

      <Reveal y={40}>
        <h2 className="relative z-10 mx-auto max-w-4xl font-display text-4xl font-light leading-[1.12] sm:text-6xl md:text-[4.2rem]">
          <TLines v={closing.line} className="aurora-text" />
        </h2>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="relative z-10 mx-auto mt-9 max-w-xl text-base font-light leading-relaxed text-ether-200/85 sm:text-lg">
          <T v={closing.sub} />
        </p>
      </Reveal>

      <Reveal delay={0.35}>
        <div className="relative z-10 mt-16 flex flex-col items-center gap-5">
          <div className="h-px w-28 bg-gradient-to-r from-transparent via-pulse-400/50 to-transparent" />
          <p className="font-display text-lg font-light italic text-ether-100 sm:text-xl">
            <T v={closing.signature} />
          </p>
          <a
            href="https://psyverse.fun"
            className="glass mt-2 rounded-full px-6 py-2.5 text-xs tracking-wide text-ether-200 transition hover:-translate-y-0.5 hover:border-pulse-400/40 hover:text-ether-50"
          >
            <T v={{ en: "Return to the Psyverse →", zh: "返回 Psyverse →" }} />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
