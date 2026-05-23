"use client";

/**
 * COSMIC SCALE — an interactive infinite-zoom ladder, cosmos → Planck.
 *
 * Seven rungs, from the observable universe (10²⁶ m) down to the Planck
 * length (10⁻³⁵ m). The user steps through them with a vertical ladder of
 * clickable rungs, prev/next buttons, a range slider, or arrow keys. A
 * central canvas cross-fades between scale-appropriate structures —
 * galaxies, a spiral, an orbit, a human silhouette, an electron orbital, a
 * quark-bound nucleus, and quantum foam — emphasising that the quantum
 * underlies every scale.
 *
 * Manual stepping only (no autoplay), so reduced-motion users are unbothered;
 * the canvas drift also freezes when prefers-reduced-motion is set. rAF and
 * listeners are cleaned up; devicePixelRatio is capped at 2.
 */

import { useEffect, useRef, useState } from "react";
import { scales, type Scale, type Bi } from "@/data/content";
import { T } from "@/components/lang";

const LABELS = {
  eyebrow: { en: "Cosmic Scale · From the Quantum to the Cosmos", zh: "宇宙尺度 · 从量子到宇宙" },
  prev: { en: "Zoom out", zh: "拉远" },
  next: { en: "Zoom in", zh: "推近" },
  scaleOf: { en: "Scale", zh: "尺度" },
  throughline: {
    en: "The quantum underlies every rung — galaxies are frozen quantum noise; the Sun burns by tunneling; you are a standing wave.",
    zh: "量子贯穿每一级阶梯——星系是被冻结的量子噪声；太阳因隧穿而燃烧；你是一道驻波。",
  },
} satisfies Record<string, Bi>;

/* per-rung accent, cycling the palette and warming toward the quantum floor */
const ACCENTS = ["#3fc6f5", "#9a6bff", "#3fc6f5", "#f2c45a", "#9a6bff", "#3fc6f5", "#f2c45a"];

/* ------------------------------------------------------------------ canvas scene */

type Particle = { x: number; y: number; r: number; a: number; tw: number };

function CosmicCanvas({ index }: { index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  // morph: eases from the previous scene index toward the current one
  const morphRef = useRef({ shown: index, target: index });

  useEffect(() => {
    morphRef.current.target = index;
  }, [index]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // deterministic field of "objects" reused across scenes
    let seed = 9301;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const field: Particle[] = Array.from({ length: 160 }, () => ({
      x: rnd(),
      y: rnd(),
      r: 0.4 + rnd() * 1.8,
      a: 0.2 + rnd() * 0.8,
      tw: rnd() * Math.PI * 2,
    }));

    let t = 0;
    let last = performance.now();

    /* --- per-scene painters; all draw into a centred unit space --- */

    const sceneGalaxies = (cx: number, cy: number, s: number, hue: string, alpha: number) => {
      // many far galaxies as soft glowing dots
      field.forEach((p, i) => {
        const x = cx + (p.x - 0.5) * s * 2;
        const y = cy + (p.y - 0.5) * s * 2;
        const tw = 0.5 + 0.5 * Math.sin(t * 0.0012 + p.tw);
        ctx.beginPath();
        ctx.arc(x, y, p.r * (0.8 + tw * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `${i % 7 === 0 ? "#f7d98a" : i % 3 === 0 ? "#cdb2ff" : "#a6ecff"}`;
        ctx.globalAlpha = alpha * p.a * (0.4 + tw * 0.6);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const sceneSpiral = (cx: number, cy: number, s: number, hue: string, alpha: number) => {
      const arms = 2;
      const turns = 2.4;
      for (let a = 0; a < arms; a++) {
        for (let k = 0; k < 220; k++) {
          const frac = k / 220;
          const ang = frac * turns * Math.PI * 2 + (a * Math.PI) + t * 0.0004;
          const rad = frac * s * 0.95;
          const x = cx + Math.cos(ang) * rad;
          const y = cy + Math.sin(ang) * rad * 0.62;
          ctx.beginPath();
          ctx.arc(x, y, 1 + (1 - frac) * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = frac < 0.18 ? "#fbe9b8" : "#a6ecff";
          ctx.globalAlpha = alpha * (0.25 + (1 - frac) * 0.7);
          ctx.fill();
        }
      }
      // bright core
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 0.28);
      g.addColorStop(0, `rgba(247,217,138,${0.9 * alpha})`);
      g.addColorStop(1, "rgba(247,217,138,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const sceneOrbit = (cx: number, cy: number, s: number, hue: string, alpha: number) => {
      // a sun with one orbiting world
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 0.34);
      g.addColorStop(0, `rgba(247,217,138,${alpha})`);
      g.addColorStop(0.5, `rgba(242,196,90,${0.55 * alpha})`);
      g.addColorStop(1, "rgba(242,196,90,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.34, 0, Math.PI * 2);
      ctx.fill();

      const rx = s * 0.8;
      const ry = s * 0.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = hue;
      ctx.globalAlpha = 0.35 * alpha;
      ctx.lineWidth = 1;
      ctx.stroke();

      const ang = t * 0.0009;
      const px = cx + Math.cos(ang) * rx;
      const py = cy + Math.sin(ang) * ry;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#6fdcff";
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const sceneHuman = (cx: number, cy: number, s: number, hue: string, alpha: number) => {
      // a luminous human silhouette built from dots (a "standing wave" of a person)
      ctx.globalAlpha = alpha;
      const u = s / 100;
      const pts: [number, number][] = [];
      // head
      for (let i = 0; i < 26; i++) {
        const a = (i / 26) * Math.PI * 2;
        pts.push([Math.cos(a) * 11, -64 + Math.sin(a) * 11]);
      }
      // body line
      for (let i = 0; i <= 40; i++) pts.push([0, -50 + i * 2.2]);
      // arms
      for (let i = 0; i <= 24; i++) pts.push([-i * 1.4, -40 + i * 0.6]);
      for (let i = 0; i <= 24; i++) pts.push([i * 1.4, -40 + i * 0.6]);
      // legs
      for (let i = 0; i <= 30; i++) pts.push([-i * 0.7, 38 + i * 1.5]);
      for (let i = 0; i <= 30; i++) pts.push([i * 0.7, 38 + i * 1.5]);
      pts.forEach(([px, py], i) => {
        const wob = Math.sin(t * 0.002 + i * 0.4) * 1.2;
        ctx.beginPath();
        ctx.arc(cx + px * u + wob, cy + py * u, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = i % 4 === 0 ? "#cdb2ff" : "#a6ecff";
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const sceneAtom = (cx: number, cy: number, s: number, hue: string, alpha: number) => {
      // probability-cloud orbital + nucleus
      ctx.globalAlpha = alpha;
      for (let i = 0; i < 260; i++) {
        const a = rndStable(i) * Math.PI * 2;
        const rr = (0.3 + Math.pow(rndStable(i + 999), 0.5) * 0.7) * s * 0.85;
        const jitter = Math.sin(t * 0.0015 + i) * 4;
        const x = cx + Math.cos(a) * (rr + jitter);
        const y = cy + Math.sin(a) * (rr + jitter) * 0.7;
        ctx.beginPath();
        ctx.arc(x, y, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = "#6fdcff";
        ctx.globalAlpha = alpha * (0.15 + 0.4 * (1 - rr / (s * 0.85)));
        ctx.fill();
      }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 0.16);
      g.addColorStop(0, `rgba(154,107,255,${alpha})`);
      g.addColorStop(1, "rgba(154,107,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const sceneNucleus = (cx: number, cy: number, s: number, hue: string, alpha: number) => {
      // three quarks jittering inside a confinement bubble
      ctx.globalAlpha = 0.18 * alpha;
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = hue;
      ctx.fill();
      ctx.globalAlpha = 1;
      const cols = ["#3fc6f5", "#9a6bff", "#f2c45a"];
      for (let i = 0; i < 3; i++) {
        const base = (i / 3) * Math.PI * 2 + t * 0.0008;
        const jx = Math.sin(t * 0.004 + i * 2) * s * 0.12;
        const jy = Math.cos(t * 0.005 + i * 3) * s * 0.12;
        const x = cx + Math.cos(base) * s * 0.26 + jx;
        const y = cy + Math.sin(base) * s * 0.26 + jy;
        // gluon string toward centre
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = cols[i];
        ctx.globalAlpha = 0.4 * alpha;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.globalAlpha = alpha;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 12);
        g.addColorStop(0, cols[i]);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const sceneFoam = (cx: number, cy: number, s: number, hue: string, alpha: number) => {
      // quantum foam — flickering virtual loops at the Planck floor
      for (let i = 0; i < 90; i++) {
        const fx = cx + (rndStable(i) - 0.5) * s * 1.9;
        const fy = cy + (rndStable(i + 333) - 0.5) * s * 1.9;
        const flick = Math.max(0, Math.sin(t * 0.006 + i * 1.7));
        const rr = 4 + rndStable(i + 77) * 14;
        ctx.beginPath();
        ctx.arc(fx, fy, rr, 0, Math.PI * 2);
        ctx.strokeStyle = i % 3 === 0 ? "#f2c45a" : i % 2 === 0 ? "#9a6bff" : "#3fc6f5";
        ctx.globalAlpha = alpha * flick * 0.7;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    // small stable PRNG keyed by an integer for scenes that need fixed layouts
    function rndStable(n: number) {
      const x = Math.sin(n * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    }

    const painters = [
      sceneGalaxies,
      sceneSpiral,
      sceneOrbit,
      sceneHuman,
      sceneAtom,
      sceneNucleus,
      sceneFoam,
    ];

    const draw = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (!reduced) t += dt;

      // ease the morph value toward the target
      const m = morphRef.current;
      m.shown += (m.target - m.shown) * 0.12;
      if (Math.abs(m.target - m.shown) < 0.002) m.shown = m.target;

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const base = Math.min(w, h) * 0.42;

      // blend the two nearest scenes by the fractional morph value
      const lo = Math.floor(m.shown);
      const hi = Math.min(painters.length - 1, lo + 1);
      const f = m.shown - lo;

      // outgoing scene shrinks + fades; incoming scene grows in
      if (f < 0.999 && painters[lo]) {
        const a = 1 - f;
        const s = base * (1 + f * 0.5); // zoom-out feel
        painters[lo](cx, cy, s, ACCENTS[lo] ?? "#3fc6f5", a);
      }
      if (f > 0.001 && painters[hi]) {
        const a = f;
        const s = base * (0.6 + f * 0.4); // grows into place
        painters[hi](cx, cy, s, ACCENTS[hi] ?? "#3fc6f5", a);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden />;
}

/* ------------------------------------------------------------------ ladder rung */

function Rung({
  scale,
  i,
  active,
  onSelect,
}: {
  scale: Scale;
  i: number;
  active: boolean;
  onSelect: () => void;
}) {
  const hex = ACCENTS[i] ?? "#3fc6f5";
  return (
    <button
      onClick={onSelect}
      style={{ ["--accent" as string]: hex }}
      aria-pressed={active}
      className={`group relative flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all duration-300
        ${
          active
            ? "border-[color:var(--accent)]/60 bg-void-700/50"
            : "border-transparent hover:border-[color:var(--accent)]/30 hover:bg-void-800/40"
        }`}
    >
      <span
        aria-hidden
        className="relative flex h-2.5 w-2.5 shrink-0 rounded-full transition-all duration-300"
        style={{
          background: active ? hex : "rgba(106,113,156,0.5)",
          boxShadow: active ? `0 0 12px ${hex}` : "none",
          transform: active ? "scale(1.25)" : "scale(1)",
        }}
      />
      <span
        className={`font-mono text-[0.7rem] tabular-nums transition-colors duration-300 ${
          active ? "text-ether-50" : "text-ether-500 group-hover:text-ether-200"
        }`}
      >
        {scale.power}
      </span>
      <span
        className={`truncate text-xs transition-colors duration-300 ${
          active ? "text-ether-200" : "text-ether-500 group-hover:text-ether-400"
        }`}
      >
        <T v={scale.label} />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ root */

export default function CosmicZoom() {
  const [i, setI] = useState(0);
  const n = scales.length;
  const active = scales[i];
  const hex = ACCENTS[i] ?? "#3fc6f5";

  const go = (next: number) => setI(Math.max(0, Math.min(n - 1, next)));

  // arrow-key stepping when the widget is focused
  const rootRef = useRef<HTMLDivElement>(null);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      go(i + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(i - 1);
    }
  };

  return (
    <div className="mt-16">
      <div className="mb-8 flex items-center gap-4">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-synapse-400">
          <T v={LABELS.eyebrow} />
        </span>
        <span className="hairline flex-1" />
      </div>

      <div
        ref={rootRef}
        tabIndex={0}
        onKeyDown={onKey}
        className="glass relative grid gap-6 rounded-3xl p-5 outline-none focus-visible:ring-1 focus-visible:ring-synapse-400/40 sm:p-7 lg:grid-cols-[14rem_1fr]"
        role="group"
        aria-label="Cosmic scale ladder / 宇宙尺度阶梯"
      >
        {/* the seven rungs */}
        <div className="flex flex-col gap-1.5">
          {scales.map((s, idx) => (
            <Rung key={s.power} scale={s} i={idx} active={idx === i} onSelect={() => go(idx)} />
          ))}
        </div>

        {/* stage: canvas + readout */}
        <div className="grid gap-5 md:grid-cols-[1fr_18rem]">
          {/* canvas */}
          <div
            className="relative aspect-square w-full overflow-hidden rounded-2xl border border-ether-600/20 bg-void-950/60 sm:aspect-[4/3] md:aspect-auto md:min-h-[20rem]"
            style={{
              boxShadow: `inset 0 0 80px -20px ${hex}55`,
            }}
          >
            <CosmicCanvas index={i} />
            {/* huge power readout overlay */}
            <div className="pointer-events-none absolute left-4 top-4">
              <div
                className="font-mono text-3xl tabular-nums leading-none sm:text-4xl"
                style={{ color: hex, textShadow: `0 0 30px ${hex}88` }}
              >
                {active.power}
              </div>
              <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-ether-400">
                <T v={LABELS.scaleOf} /> {i + 1} / {n}
              </div>
            </div>
          </div>

          {/* readout panel */}
          <div className="flex flex-col">
            <span
              key={`m-${i}`}
              className="lang-fade font-mono text-xs text-ether-400"
            >
              <T v={active.meters} />
            </span>
            <h3
              key={`l-${i}`}
              className="lang-fade mt-2 font-display text-3xl leading-tight text-ether-50"
              style={{ textShadow: `0 0 28px ${hex}33` }}
            >
              <T v={active.label} />
            </h3>
            <p key={`n-${i}`} className="lang-fade mt-3 text-sm leading-relaxed text-ether-200">
              <T v={active.note} />
            </p>

            {/* slider */}
            <div className="mt-auto pt-6">
              <input
                type="range"
                min={0}
                max={n - 1}
                step={1}
                value={i}
                onChange={(e) => go(Number(e.target.value))}
                aria-label="Scale slider / 尺度滑块"
                className="zoom-slider w-full"
                style={{ ["--accent" as string]: hex }}
              />
              {/* prev / next */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  onClick={() => go(i - 1)}
                  disabled={i === 0}
                  className="flex items-center gap-1.5 rounded-full border border-ether-600/40 bg-void-900/40 px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ether-400 transition enabled:hover:border-synapse-400/60 enabled:hover:text-ether-50 disabled:opacity-30"
                >
                  <span aria-hidden>↑</span>
                  <T v={LABELS.prev} />
                </button>
                <button
                  onClick={() => go(i + 1)}
                  disabled={i === n - 1}
                  className="flex items-center gap-1.5 rounded-full border border-ether-600/40 bg-void-900/40 px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ether-400 transition enabled:hover:border-synapse-400/60 enabled:hover:text-ether-50 disabled:opacity-30"
                >
                  <T v={LABELS.next} />
                  <span aria-hidden>↓</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-ether-500">
        <T v={LABELS.throughline} />
      </p>

      <style jsx global>{`
        .zoom-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 3px;
          border-radius: 99px;
          background: linear-gradient(90deg, rgba(63, 198, 245, 0.5), rgba(154, 107, 255, 0.5), rgba(242, 196, 90, 0.6));
          outline: none;
          cursor: pointer;
        }
        .zoom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent, #3fc6f5);
          border: 2px solid #03040a;
          box-shadow: 0 0 14px -2px var(--accent, #3fc6f5);
          transition: transform 0.2s ease;
        }
        .zoom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.18);
        }
        .zoom-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent, #3fc6f5);
          border: 2px solid #03040a;
          box-shadow: 0 0 14px -2px var(--accent, #3fc6f5);
        }
      `}</style>
    </div>
  );
}
