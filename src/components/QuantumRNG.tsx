"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { T, useLang, pick } from "@/components/lang";
import { lab } from "@/data/content";

/**
 * Quantum randomness: prepare H|0⟩ = (|0⟩+|1⟩)/√2, then measure. Each bit is a
 * fair coin — |amp|² = 1/2 for each outcome. The bits are drawn fresh from the
 * runtime's CSPRNG on every click; in a real device this randomness is, in
 * principle, uncomputable / truly nondeterministic.
 */

// one fair quantum coin flip (H then measure; both outcomes have prob 1/2)
function flipBit(): 0 | 1 {
  // prefer the cryptographic source where available
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint8Array(1);
    crypto.getRandomValues(buf);
    return (buf[0] & 1) as 0 | 1;
  }
  return Math.random() < 0.5 ? 0 : 1;
}

export default function QuantumRNG() {
  const { lang } = useLang();
  const t = lab.rng;

  const [bits, setBits] = useState<(0 | 1)[]>([]);
  const [latest, setLatest] = useState<0 | 1 | null>(null);
  const [spin, setSpin] = useState(0); // bumps to re-trigger the flip animation
  const reduce = useRef(false);
  const streamRaf = useRef<number>(0);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => cancelAnimationFrame(streamRaf.current);
  }, []);

  const flipOne = useCallback(() => {
    const bit = flipBit();
    setLatest(bit);
    setSpin((s) => s + 1);
    setBits((prev) => {
      const next = [...prev, bit];
      return next.length > 1024 ? next.slice(next.length - 1024) : next;
    });
  }, []);

  // stream 256 bits, filling in rapidly across frames
  const stream = useCallback(() => {
    cancelAnimationFrame(streamRaf.current);
    let added = 0;
    const TOTAL = 256;
    const collected: (0 | 1)[] = [];
    const tick = () => {
      const batch = reduce.current ? TOTAL : 14;
      for (let i = 0; i < batch && added < TOTAL; i++) {
        collected.push(flipBit());
        added++;
      }
      setBits((prev) => {
        const next = [...prev, ...collected.splice(0)];
        return next.length > 1024 ? next.slice(next.length - 1024) : next;
      });
      if (added < TOTAL && !document.hidden) {
        streamRaf.current = requestAnimationFrame(tick);
      }
    };
    streamRaf.current = requestAnimationFrame(tick);
  }, []);

  const clear = () => {
    cancelAnimationFrame(streamRaf.current);
    setBits([]);
    setLatest(null);
  };

  const zeros = bits.reduce<number>((n, b) => n + (b === 0 ? 1 : 0), 0);
  const ones = bits.length - zeros;
  const total = bits.length || 1;
  const zPct = (zeros / total) * 100;
  const oPct = (ones / total) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* controls + latest flip */}
      <div className="flex flex-col gap-5">
        {/* the latest flip — a glowing qubit/coin */}
        <div className="glass flex flex-col items-center gap-3 rounded-2xl p-5">
          <div className="relative h-24 w-24">
            <div
              key={spin}
              className={`flex h-full w-full items-center justify-center rounded-full border-2 ${
                latest === null ? "" : reduce.current ? "" : "animate-collapse"
              }`}
              style={{
                borderColor: latest === 1 ? "rgba(242,196,90,0.85)" : latest === 0 ? "rgba(63,198,245,0.7)" : "rgba(106,113,156,0.4)",
                background:
                  latest === 1
                    ? "radial-gradient(circle at 35% 30%, rgba(247,217,138,0.6), rgba(8,10,24,0.85))"
                    : latest === 0
                      ? "radial-gradient(circle at 35% 30%, rgba(63,198,245,0.4), rgba(8,10,24,0.85))"
                      : "radial-gradient(circle at 35% 30%, rgba(106,113,156,0.18), rgba(8,10,24,0.7))",
                boxShadow:
                  latest === 1
                    ? "0 0 30px -4px rgba(242,196,90,0.8)"
                    : latest === 0
                      ? "0 0 26px -6px rgba(63,198,245,0.7)"
                      : "none",
              }}
            >
              <span className="font-mono text-4xl text-white">{latest === null ? "ψ" : latest}</span>
            </div>
          </div>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ether-500">
            {pick({ en: "Latest measurement", zh: "最近一次测量" }, lang)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={flipOne}
            className="glass rounded-full border-pulse-500/30 px-5 py-2.5 text-sm transition hover:-translate-y-0.5 hover:border-pulse-300/60"
          >
            <T v={t.flip} />
          </button>
          <button
            onClick={stream}
            className="glass rounded-full border-synapse-500/30 px-5 py-2.5 text-sm transition hover:-translate-y-0.5 hover:border-synapse-300/60"
          >
            <T v={t.stream} />
          </button>
          <button
            onClick={clear}
            className="glass rounded-full border-ether-500/20 px-5 py-2.5 text-sm text-ether-400 transition hover:-translate-y-0.5 hover:border-ether-400/40 hover:text-ether-200"
          >
            <T v={t.reset} />
          </button>
        </div>

        {/* zeros vs ones tally */}
        <div className="space-y-3">
          {[
            { label: t.zeros, val: zeros, pct: zPct, color: "63,198,245" },
            { label: t.ones, val: ones, pct: oPct, color: "242,196,90" },
          ].map((row, i) => (
            <div key={i}>
              <div className="mb-1 flex items-baseline justify-between font-mono text-xs">
                <span className="text-ether-400">
                  <T v={row.label} />
                </span>
                <span className="tabular-nums text-ether-100">
                  {row.val} · {row.pct.toFixed(1)}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-void-700">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${row.pct}%`,
                    background: `linear-gradient(90deg, rgba(${row.color},0.4), rgba(${row.color},1))`,
                    boxShadow: `0 0 12px rgba(${row.color},0.6)`,
                  }}
                />
              </div>
            </div>
          ))}
          <p className="pt-1 text-center font-mono text-[0.65rem] text-ether-500">
            {bits.length} {pick({ en: "bits · converging to 50 / 50", zh: "比特 · 正收敛至 50 / 50" }, lang)}
          </p>
        </div>
      </div>

      {/* bit grid */}
      <div className="flex flex-col gap-3">
        <div className="relative min-h-[260px] flex-1 overflow-hidden rounded-2xl border border-synapse-500/15 bg-void-950 p-4">
          <span className="pointer-events-none absolute right-3 top-3 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ether-500">
            {pick({ en: "Bit stream", zh: "比特流" }, lang)}
          </span>
          {bits.length === 0 ? (
            <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-ether-500">
              {pick({ en: "Measure a qubit to begin.", zh: "测量一个量子比特以开始。" }, lang)}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 pt-6">
              {bits.map((b, i) => (
                <span
                  key={i}
                  className="h-3 w-3 rounded-[3px] transition-colors"
                  style={{
                    background: b === 1 ? "rgba(242,196,90,0.95)" : "rgba(63,198,245,0.28)",
                    boxShadow: b === 1 ? "0 0 7px rgba(242,196,90,0.8)" : "none",
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <p className="text-sm text-ether-400">
          <T v={t.desc} />
        </p>
      </div>
    </div>
  );
}
