"use client";

import { useEffect, useRef, useState } from "react";
import { T, useLang, pick } from "@/components/lang";
import { lab } from "@/data/content";

/**
 * The Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2.
 *
 *  - The first measurement (of either particle) is a fair 50/50 coin and
 *    instantly sets BOTH particles to the SAME value (perfect correlation).
 *  - Measuring the partner afterwards just reveals the matching value.
 *  - Agreement is always 100% for Φ⁺ — that is the entire point; the running
 *    tally converges to / stays at 100%.
 *
 * A collapse flash travels the link from the measured particle to its partner.
 */

type V = null | 0 | 1;

export default function Entanglement() {
  const { lang } = useLang();
  const t = lab.entangle;
  const reduce = useRef(false);

  const [a, setA] = useState<V>(null);
  const [b, setB] = useState<V>(null);
  const [trials, setTrials] = useState(0);
  const [agreements, setAgreements] = useState(0);
  // direction of the flash: "ab" = A→B, "ba" = B→A, null = none
  const [flash, setFlash] = useState<null | "ab" | "ba">(null);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const measure = (which: "a" | "b") => {
    // already fully measured → ignore
    if (a !== null && b !== null) return;

    if (a === null && b === null) {
      // first measurement: random 50/50, both collapse to the SAME value
      const val: V = Math.random() < 0.5 ? 0 : 1;
      setA(val);
      setB(val);
      setTrials((n) => n + 1);
      setAgreements((n) => n + 1); // Φ⁺ always agrees
      setFlash(which === "a" ? "ab" : "ba");
    } else {
      // partner already set — measuring this one reveals the matching value
      if (which === "a" && a === null) {
        setA(b);
        setFlash("ba");
      } else if (which === "b" && b === null) {
        setB(a);
        setFlash("ab");
      }
    }
    if (!reduce.current) {
      window.setTimeout(() => setFlash(null), 700);
    } else {
      setFlash(null);
    }
  };

  const reset = () => {
    setA(null);
    setB(null);
    setFlash(null);
  };

  const agreePct = trials === 0 ? 100 : (agreements / trials) * 100;

  const orb = (val: V, label: string, color: string) => {
    const undetermined = val === null;
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-28 w-28 sm:h-32 sm:w-32">
          {/* undetermined shimmering halo */}
          <div
            className={`absolute inset-0 rounded-full ${undetermined && !reduce.current ? "animate-breathe" : ""}`}
            style={{
              background: undetermined
                ? `radial-gradient(circle at 50% 50%, rgba(${color},0.35), transparent 70%)`
                : `radial-gradient(circle at 50% 50%, rgba(${color},0.55), transparent 72%)`,
            }}
          />
          <div
            className="absolute inset-3 flex items-center justify-center rounded-full border transition-all duration-500"
            style={{
              borderColor: `rgba(${color},${undetermined ? 0.4 : 0.85})`,
              background: undetermined
                ? `radial-gradient(circle at 35% 30%, rgba(${color},0.18), rgba(8,10,24,0.7))`
                : `radial-gradient(circle at 35% 30%, rgba(${color},0.6), rgba(8,10,24,0.85))`,
              boxShadow: undetermined ? "none" : `0 0 30px -4px rgba(${color},0.7)`,
            }}
          >
            <span
              className={`font-mono text-3xl transition-all ${undetermined ? "text-ether-500" : "text-white"} ${
                undetermined && !reduce.current ? "animate-phase" : ""
              }`}
            >
              {undetermined ? "?" : val}
            </span>
          </div>
        </div>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ether-400">{label}</span>
      </div>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      {/* stage */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-synapse-500/15 bg-void-950 px-4 py-10">
        <span className="pointer-events-none absolute left-3 top-3 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ether-500">
          |Φ⁺⟩ = (|00⟩+|11⟩)/√2
        </span>

        <div className="relative flex w-full max-w-md items-center justify-between gap-2">
          {orb(a, "A", "63,198,245")}

          {/* entanglement link */}
          <div className="relative h-1 flex-1">
            <div
              className={`absolute inset-0 rounded-full ${
                a === null && b === null && !reduce.current ? "animate-entangle" : ""
              }`}
              style={{
                background:
                  "linear-gradient(90deg, rgba(63,198,245,0.5), rgba(154,107,255,0.6), rgba(63,198,245,0.5))",
              }}
            />
            {/* traveling collapse pulse */}
            {flash && (
              <span
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white"
                style={{
                  boxShadow: "0 0 16px 4px rgba(251,233,184,0.9)",
                  animation: reduce.current ? "none" : `${flash === "ab" ? "elinkAB" : "elinkBA"} 0.65s ease-out forwards`,
                }}
              />
            )}
          </div>

          {orb(b, "B", "154,107,255")}
        </div>

        {/* local keyframes for the traveling pulse */}
        <style>{`
          @keyframes elinkAB { from { left: 0%; opacity: 1; } to { left: 100%; opacity: 0.2; } }
          @keyframes elinkBA { from { left: 100%; opacity: 1; } to { left: 0%; opacity: 0.2; } }
        `}</style>

        <p className="mt-8 max-w-sm text-center text-sm text-ether-400">
          {a === null && b === null
            ? pick({ en: "Undetermined — neither particle has a value yet.", zh: "尚未确定——两个粒子都还没有取值。" }, lang)
            : pick(
                { en: "Correlated. Both particles agree — every single time.", zh: "已关联。两个粒子一致——每一次都如此。" },
                lang,
              )}
        </p>
      </div>

      {/* controls + stats */}
      <div className="flex flex-col gap-5">
        <button
          onClick={() => measure("a")}
          disabled={a !== null && b !== null}
          className="glass rounded-full border-pulse-500/30 px-5 py-2.5 text-sm transition hover:-translate-y-0.5 hover:border-pulse-300/60 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <T v={t.measureA} />
        </button>
        <button
          onClick={() => measure("b")}
          disabled={a !== null && b !== null}
          className="glass rounded-full border-synapse-500/30 px-5 py-2.5 text-sm transition hover:-translate-y-0.5 hover:border-synapse-300/60 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <T v={t.measureB} />
        </button>
        <button
          onClick={reset}
          className="glass rounded-full border-ether-500/20 px-5 py-2.5 text-sm text-ether-400 transition hover:-translate-y-0.5 hover:border-ether-400/40 hover:text-ether-200"
        >
          <T v={t.reset} />
        </button>

        <div className="mt-2 space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-ether-500">
              <T v={t.trials} />
            </span>
            <span className="tabular-nums font-mono text-2xl text-ether-50">{trials}</span>
          </div>
          <div>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-ether-500">
                <T v={t.agree} />
              </span>
              <span className="tabular-nums font-mono text-2xl text-awaken-300">{agreePct.toFixed(0)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-void-700">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${agreePct}%`,
                  background: "linear-gradient(90deg, rgba(242,196,90,0.4), rgba(242,196,90,1))",
                  boxShadow: "0 0 12px rgba(242,196,90,0.6)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
