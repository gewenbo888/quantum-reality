"use client";

import { useMemo } from "react";
import { equations } from "@/data/content";
import { useLang } from "./lang";

/**
 * Slowly drifting mathematical equations + philosophical fragments scattered
 * across the deep background — the "language the universe is written in".
 */
export default function FloatingEquations() {
  const { lang } = useLang();
  const placed = useMemo(
    () =>
      equations.map((e, i) => ({
        ...e,
        top: 8 + ((i * 37) % 84),
        left: 6 + ((i * 53) % 86),
        dur: 16 + (i % 5) * 4,
        delay: -(i * 3),
        size: i % 3 === 0 ? "text-base" : "text-xs",
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden" aria-hidden="true">
      {placed.map((e, i) => (
        <div
          key={i}
          className="absolute select-none font-mono text-pulse-300/20"
          style={{
            top: `${e.top}%`,
            left: `${e.left}%`,
            animation: `floatEq ${e.dur}s ease-in-out ${e.delay}s infinite`,
          }}
        >
          <span className={e.size}>{e.tex}</span>
          <span className="ml-2 text-[0.6rem] uppercase tracking-[0.2em] text-synapse-400/20">
            {e.label[lang]}
          </span>
        </div>
      ))}
      <style jsx>{`
        @keyframes floatEq {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.5;
          }
          50% {
            transform: translate(18px, -26px);
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  );
}
