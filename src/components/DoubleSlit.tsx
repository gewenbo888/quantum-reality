"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { T, useLang, pick } from "@/components/lang";
import { lab } from "@/data/content";

/**
 * The double-slit experiment, computed for real.
 *
 *  - NOT observed: each particle's landing x is sampled (by rejection) from the
 *    interference intensity  I(x) ∝ cos²(k·x) · exp(−(x/σ)²)  — a fringe pattern
 *    under a Gaussian envelope. Over many particles, bright fringes emerge.
 *  - Observed (which-path detector ON): x is sampled from the sum of two plain
 *    Gaussians (one band per slit). No fringes — the wave nature is destroyed.
 *
 * Dots accumulate on a detection screen (cyan when wave-mode, gold when classical),
 * with a live histogram below.
 */

const NX = 96; // histogram bins

// landing-position probability density on the screen, in normalized x ∈ [-1, 1]
function waveIntensity(x: number) {
  const k = 13.5; // fringe frequency
  const sigma = 0.42; // envelope width
  const c = Math.cos(k * x);
  return c * c * Math.exp(-(x * x) / (sigma * sigma));
}
function particleIntensity(x: number) {
  // two plain bands, one per slit
  const s = 0.16;
  const a = 0.32;
  const g1 = Math.exp(-((x - a) * (x - a)) / (2 * s * s));
  const g2 = Math.exp(-((x + a) * (x + a)) / (2 * s * s));
  return g1 + g2;
}

// rejection-sample one landing position from the active distribution
function sampleX(observed: boolean) {
  const f = observed ? particleIntensity : waveIntensity;
  // max of either density is 1 (cos²·exp peaks at 1; the two-band peak ≈ 1.01)
  const ceiling = 1.05;
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * ceiling;
    if (y <= f(x)) return x;
  }
  return Math.random() * 2 - 1;
}

export default function DoubleSlit() {
  const { lang } = useLang();
  const t = lab.doubleSlit;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const histRef = useRef<HTMLCanvasElement>(null);

  const [observed, setObserved] = useState(false);
  const [count, setCount] = useState(0);
  const [rapid, setRapid] = useState(false);

  // mutable simulation state held in refs (avoids re-render per dot)
  const dotsRef = useRef<{ x: number; y: number }[]>([]);
  const histRef2 = useRef<Float32Array>(new Float32Array(NX));
  const observedRef = useRef(observed);
  const reduceRef = useRef(false);

  observedRef.current = observed;

  // ---- one particle ----
  const fireOne = useCallback(() => {
    const x = sampleX(observedRef.current);
    // vertical position is uniform random jitter (the slits are tall)
    const y = Math.random() * 0.86 + 0.07;
    dotsRef.current.push({ x, y });
    if (dotsRef.current.length > 6000) dotsRef.current.shift();
    const bin = Math.min(NX - 1, Math.max(0, Math.floor(((x + 1) / 2) * NX)));
    histRef2.current[bin] += 1;
    setCount((c) => c + 1);
  }, []);

  const reset = useCallback(() => {
    dotsRef.current = [];
    histRef2.current = new Float32Array(NX);
    setCount(0);
  }, []);

  // clear the screen when the detector toggles (mode transition)
  useEffect(() => {
    dotsRef.current = [];
    histRef2.current = new Float32Array(NX);
    setCount(0);
  }, [observed]);

  // ---- rapid fire loop ----
  useEffect(() => {
    if (!rapid) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      if (now - last >= 33) {
        last = now;
        // ~30/s — a couple per frame to feel alive
        fireOne();
        fireOne();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rapid, fireOne]);

  // ---- render loop for the detection screen + histogram ----
  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const hist = histRef.current;
    if (!canvas || !hist) return;
    const ctx = canvas.getContext("2d")!;
    const hctx = hist.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let cw = 0;
    let ch = 0;
    let hw = 0;
    let hh = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      cw = r.width;
      ch = r.height;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const hr = hist.getBoundingClientRect();
      hw = hr.width;
      hh = hr.height;
      hist.width = Math.round(hw * dpr);
      hist.height = Math.round(hh * dpr);
      hctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    ro.observe(hist);

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (document.hidden) return;
      const obs = observedRef.current;
      const accent = obs ? "242,196,90" : "63,198,245";

      // --- detection screen ---
      ctx.clearRect(0, 0, cw, ch);
      // faint detector backplate
      ctx.fillStyle = "rgba(8,10,24,0.55)";
      ctx.fillRect(0, 0, cw, ch);
      const dots = dotsRef.current;
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const px = ((d.x + 1) / 2) * cw;
        const py = d.y * ch;
        ctx.fillStyle = `rgba(${accent},0.5)`;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // --- histogram ---
      hctx.clearRect(0, 0, hw, hh);
      const h = histRef2.current;
      let max = 1;
      for (let i = 0; i < NX; i++) if (h[i] > max) max = h[i];
      const bw = hw / NX;
      for (let i = 0; i < NX; i++) {
        const v = h[i] / max;
        const bh = v * (hh - 2);
        const grad = hctx.createLinearGradient(0, hh, 0, hh - bh);
        grad.addColorStop(0, `rgba(${accent},0.15)`);
        grad.addColorStop(1, `rgba(${accent},0.95)`);
        hctx.fillStyle = grad;
        hctx.fillRect(i * bw, hh - bh, Math.max(1, bw - 0.6), bh);
      }
    };
    draw();

    const onVis = () => {
      if (!document.hidden) {
        cancelAnimationFrame(raf);
        draw();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* ---------------- controls + schematic ---------------- */}
      <div className="flex flex-col gap-5">
        {/* schematic: source → barrier (two slits) → screen */}
        <div className="glass rounded-2xl p-4">
          <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ether-500">
            {pick({ en: "Apparatus", zh: "实验装置" }, lang)}
          </p>
          <svg viewBox="0 0 240 120" className="w-full">
            {/* source */}
            <circle cx="16" cy="60" r="6" fill="#a6ecff">
              {!reduceRef.current && (
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
              )}
            </circle>
            {/* beams to the two slits */}
            <line x1="22" y1="60" x2="110" y2="44" stroke="rgba(63,198,245,0.35)" strokeWidth="1" />
            <line x1="22" y1="60" x2="110" y2="76" stroke="rgba(63,198,245,0.35)" strokeWidth="1" />
            {/* barrier with two slits */}
            <rect x="108" y="6" width="6" height="34" fill="rgba(154,107,255,0.55)" />
            <rect x="108" y="52" width="6" height="16" fill="rgba(154,107,255,0.55)" />
            <rect x="108" y="80" width="6" height="34" fill="rgba(154,107,255,0.55)" />
            {/* spreading wavefronts after the barrier */}
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <path
                  d={`M118 44 q ${30 + i * 18} -${10 + i * 6} ${60 + i * 30} 0`}
                  fill="none"
                  stroke={observed ? "rgba(242,196,90,0.18)" : "rgba(63,198,245,0.22)"}
                  strokeWidth="0.8"
                />
                <path
                  d={`M118 76 q ${30 + i * 18} ${10 + i * 6} ${60 + i * 30} 0`}
                  fill="none"
                  stroke={observed ? "rgba(242,196,90,0.18)" : "rgba(63,198,245,0.22)"}
                  strokeWidth="0.8"
                />
              </g>
            ))}
            {/* which-path detector glyph (only when observed) */}
            {observed && (
              <g>
                <circle cx="124" cy="60" r="5" fill="none" stroke="#f2c45a" strokeWidth="1.2" />
                <circle cx="124" cy="60" r="1.8" fill="#f2c45a" />
              </g>
            )}
            {/* screen */}
            <rect x="226" y="6" width="6" height="108" fill="rgba(166,236,255,0.5)" />
          </svg>
        </div>

        {/* mode badge */}
        <div
          className="rounded-2xl border px-4 py-3 text-center text-sm transition-colors"
          style={{
            borderColor: observed ? "rgba(242,196,90,0.35)" : "rgba(63,198,245,0.35)",
            background: observed ? "rgba(242,196,90,0.06)" : "rgba(63,198,245,0.06)",
            color: observed ? "#fbe9b8" : "#a6ecff",
          }}
        >
          <T v={observed ? t.particleMode : t.waveMode} />
        </div>

        {/* count */}
        <div className="font-mono text-sm text-ether-200">
          <span className="text-ether-500">
            <T v={t.count} />
          </span>
          <span className="ml-2 tabular-nums text-2xl text-ether-50">{count.toLocaleString()}</span>
        </div>

        {/* which-path toggle */}
        <button
          onClick={() => setObserved((o) => !o)}
          className={`glass flex items-center justify-between rounded-full px-5 py-2.5 text-sm transition hover:-translate-y-0.5 ${
            observed ? "border-awaken-500/50" : "border-pulse-500/30"
          }`}
        >
          <T v={t.observe} />
          <span
            className="relative ml-3 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors"
            style={{ background: observed ? "rgba(242,196,90,0.5)" : "rgba(106,113,156,0.4)" }}
          >
            <span
              className="absolute h-3.5 w-3.5 rounded-full bg-white transition-all"
              style={{ left: observed ? "1.25rem" : "0.2rem", boxShadow: "0 0 8px rgba(255,255,255,0.6)" }}
            />
          </span>
        </button>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={fireOne}
            className="glass rounded-full border-pulse-500/30 px-5 py-2.5 text-sm transition hover:-translate-y-0.5 hover:border-pulse-300/60"
          >
            <T v={t.fire} />
          </button>
          <button
            onClick={() => setRapid((r) => !r)}
            className={`glass rounded-full px-5 py-2.5 text-sm transition hover:-translate-y-0.5 ${
              rapid ? "border-synapse-400/60 text-synapse-300" : "border-synapse-500/30 hover:border-synapse-300/60"
            }`}
          >
            <T v={t.auto} />
            {rapid && <span className="ml-2 inline-block h-2 w-2 animate-breathe rounded-full bg-synapse-400 align-middle" />}
          </button>
          <button
            onClick={reset}
            className="glass rounded-full border-ether-500/20 px-5 py-2.5 text-sm text-ether-400 transition hover:-translate-y-0.5 hover:border-ether-400/40 hover:text-ether-200"
          >
            <T v={t.reset} />
          </button>
        </div>
      </div>

      {/* ---------------- detection screen + histogram ---------------- */}
      <div className="flex flex-col gap-3">
        <div className="relative overflow-hidden rounded-2xl border border-synapse-500/15 bg-void-950">
          <canvas ref={canvasRef} className="block h-[280px] w-full sm:h-[340px]" />
          <span className="pointer-events-none absolute left-3 top-3 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ether-500">
            {pick({ en: "Detection screen", zh: "探测屏" }, lang)}
          </span>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-synapse-500/15 bg-void-950">
          <canvas ref={histRef} className="block h-[90px] w-full" />
          <span className="pointer-events-none absolute left-3 top-2 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ether-500">
            {pick({ en: "Intensity histogram", zh: "强度直方图" }, lang)}
          </span>
        </div>
      </div>
    </div>
  );
}
