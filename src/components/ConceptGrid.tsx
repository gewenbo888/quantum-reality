"use client";

/**
 * THE QUANTUM WORLD — nine expandable concept cards.
 *
 * A responsive grid of glass cards, each carrying its own GPU-light animated
 * mini-diagram (inline SVG + CSS animation), the bilingual name / tag / math /
 * preview. Clicking a card opens an elegant glass modal (backdrop-blur) with the
 * full definition plus labelled bilingual Interpretation / Application sections
 * and a larger diagram. Closes on backdrop click or Escape.
 *
 * Dependency-free. Reduced-motion is honoured globally in globals.css
 * (animation-duration is clamped), so the diagrams freeze gracefully.
 */

import { useEffect, useRef, useState } from "react";
import { concepts, type Concept, type Bi } from "@/data/content";
import { T } from "@/components/lang";

/* per-concept accent so each card glows in its own colour from the palette */
type Accent = "synapse" | "pulse" | "awaken";
const ACCENT: Record<string, Accent> = {
  duality: "pulse",
  superposition: "synapse",
  entanglement: "synapse",
  tunneling: "pulse",
  uncertainty: "awaken",
  collapse: "synapse",
  observer: "awaken",
  fields: "pulse",
  vacuum: "synapse",
};

const HEX: Record<Accent, string> = {
  synapse: "#9a6bff",
  pulse: "#3fc6f5",
  awaken: "#f2c45a",
};

const LABELS = {
  meaning: { en: "Meaning", zh: "含义" },
  interpretation: { en: "Interpretation", zh: "诠释" },
  application: { en: "Application", zh: "应用" },
  eyebrow: { en: "The Quantum World · Nine Impossible Truths", zh: "量子世界 · 九个不可能的真理" },
  formula: { en: "Formula", zh: "公式" },
  close: { en: "Close", zh: "关闭" },
  open: { en: "Reveal", zh: "展开" },
} satisfies Record<string, Bi>;

/* ------------------------------------------------------------------ diagrams */

/**
 * A single shared diagram component. `switch(id)` returns a distinct, looping,
 * GPU-light inline-SVG visual for each of the nine concepts. `large` simply
 * scales the rendered box; the SVG itself is a 0 0 120 120 viewBox throughout.
 */
function ConceptDiagram({ id, color, large = false }: { id: string; color: string; large?: boolean }) {
  const size = large ? 168 : 96;
  const common = {
    viewBox: "0 0 120 120",
    width: size,
    height: size,
    fill: "none",
    role: "img" as const,
    "aria-hidden": true,
  };

  switch (id) {
    /* duality: a sine wave that morphs while a particle dot pulses at its centre */
    case "duality":
      return (
        <svg {...common}>
          <path
            d="M6 60 Q21 24 36 60 T66 60 T96 60 T126 60"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          >
            <animate attributeName="opacity" values="0.9;0.25;0.9" dur="3.4s" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0;-30 0;0 0"
              dur="3.4s"
              repeatCount="indefinite"
            />
          </path>
          <circle cx="60" cy="60" r="7" fill={color} className="animate-breathe" style={{ transformOrigin: "60px 60px" }}>
            <animate attributeName="r" values="3;9;3" dur="3.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="60" r="14" stroke={color} strokeWidth="1" opacity="0.4">
            <animate attributeName="r" values="8;22;8" dur="3.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="3.4s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    /* superposition: two overlapping translucent state-blobs |0> and |1> blended */
    case "superposition":
      return (
        <svg {...common}>
          <circle cx="48" cy="60" r="26" fill={color} opacity="0.22">
            <animate attributeName="cx" values="46;52;46" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.28;0.14;0.28" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="72" cy="60" r="26" fill="#a6ecff" opacity="0.2">
            <animate attributeName="cx" values="74;68;74" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.24;0.12;0.24" dur="4s" repeatCount="indefinite" />
          </circle>
          <text x="42" y="66" fontSize="15" fontFamily="monospace" fill="#e7ebff" opacity="0.85">0</text>
          <text x="70" y="66" fontSize="15" fontFamily="monospace" fill="#e7ebff" opacity="0.85">1</text>
        </svg>
      );

    /* entanglement: two dots joined by a pulsing link (animate-entangle), mirrored */
    case "entanglement":
      return (
        <svg {...common}>
          <line x1="30" y1="60" x2="90" y2="60" stroke={color} strokeWidth="2" className="animate-entangle" />
          <circle cx="30" cy="60" r="8" fill={color}>
            <animate attributeName="cy" values="48;72;48" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="90" cy="60" r="8" fill="#a6ecff">
            <animate attributeName="cy" values="72;48;72" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="60" r="3" fill="#fff" className="animate-entangle" />
        </svg>
      );

    /* tunneling: a wave hits a barrier, a small amplitude leaks through the far side */
    case "tunneling":
      return (
        <svg {...common}>
          <rect x="56" y="24" width="8" height="72" fill={color} opacity="0.3" rx="2" />
          <path d="M6 60 Q18 38 30 60 T54 60" stroke={color} strokeWidth="2.4" strokeLinecap="round">
            <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M66 60 Q78 52 90 60 T114 60" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5">
            <animate attributeName="opacity" values="0.15;0.6;0.15" dur="3s" repeatCount="indefinite" />
          </path>
          <circle cx="100" cy="60" r="4" fill={color}>
            <animate attributeName="opacity" values="0;0.9;0" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    /* uncertainty: position Gaussian narrows while conjugate momentum Gaussian widens */
    case "uncertainty":
      return (
        <svg {...common}>
          <path d="M14 96 C30 96 30 36 46 36 C62 36 62 96 78 96" stroke={color} strokeWidth="2" strokeLinecap="round">
            <animateTransform
              attributeName="transform"
              type="scale"
              additive="sum"
              values="1 1;0.55 1.4;1 1"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M40 96 C58 96 58 56 76 56 C94 56 94 96 112 96" stroke="#a6ecff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
            <animateTransform
              attributeName="transform"
              type="scale"
              additive="sum"
              values="1 1;1.5 0.6;1 1"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      );

    /* collapse: a spread cloud of dots snaps inward to a single bright point */
    case "collapse":
      return (
        <svg {...common}>
          {[
            [36, 40],
            [84, 44],
            [30, 76],
            [88, 80],
            [54, 30],
            [70, 90],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="4" fill={color} opacity="0.7">
              <animate attributeName="cx" values={`${cx};60;${cx}`} dur="2.8s" begin={`${i * 0.05}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${cy};60;${cy}`} dur="2.8s" begin={`${i * 0.05}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;1;0.7" dur="2.8s" repeatCount="indefinite" />
            </circle>
          ))}
          <circle cx="60" cy="60" r="6" fill="#fff">
            <animate attributeName="r" values="2;8;2" dur="2.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    /* observer: an iris with converging rays */
    case "observer":
      return (
        <svg {...common}>
          {[...Array(8)].map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const x2 = 60 + Math.cos(a) * 46;
            const y2 = 60 + Math.sin(a) * 46;
            return <line key={i} x1={60} y1={60} x2={x2} y2={y2} stroke={color} strokeWidth="1" opacity="0.35" />;
          })}
          <ellipse cx="60" cy="60" rx="34" ry="20" stroke={color} strokeWidth="2" opacity="0.85" />
          <circle cx="60" cy="60" r="11" stroke={color} strokeWidth="2" fill="none">
            <animate attributeName="r" values="8;13;8" dur="3.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="60" r="4" fill="#fff">
            <animate attributeName="opacity" values="1;0.4;1" dur="3.2s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    /* fields: a lattice of points rippling like a field excitation */
    case "fields":
      return (
        <svg {...common}>
          {[...Array(5)].map((_, r) =>
            [...Array(5)].map((__, c) => {
              const cx = 24 + c * 18;
              const cy = 24 + r * 18;
              const delay = ((r + c) % 5) * 0.18;
              return (
                <circle key={`${r}-${c}`} cx={cx} cy={cy} r="2.6" fill={color} opacity="0.6">
                  <animate attributeName="r" values="1.6;4.2;1.6" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.35;0.95;0.35" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
                </circle>
              );
            })
          )}
        </svg>
      );

    /* vacuum: virtual particle pairs flickering in and out of existence */
    case "vacuum":
      return (
        <svg {...common}>
          {[
            [38, 42, 0],
            [80, 50, 0.7],
            [50, 84, 1.3],
            [86, 82, 0.4],
            [30, 72, 1.0],
          ].map(([cx, cy, d], i) => (
            <g key={i}>
              <circle cx={cx - 5} cy={cy} r="3.4" fill={color}>
                <animate attributeName="opacity" values="0;0.9;0" dur="2.6s" begin={`${d}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={cx + 5} cy={cy} r="3.4" stroke={color} strokeWidth="1.4" fill="none">
                <animate attributeName="opacity" values="0;0.9;0" dur="2.6s" begin={`${d}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <circle cx="60" cy="60" r="20" stroke={color} strokeWidth="2" className="animate-breathe" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ card */

function ConceptCard({
  concept,
  index,
  onOpen,
}: {
  concept: Concept;
  index: number;
  onOpen: () => void;
}) {
  const accent = ACCENT[concept.id] ?? "synapse";
  const hex = HEX[accent];
  const ref = useRef<HTMLButtonElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      onClick={onOpen}
      style={{
        transitionDelay: shown ? `${(index % 3) * 90 + Math.floor(index / 3) * 60}ms` : "0ms",
        ["--accent" as string]: hex,
      }}
      className={`group glass relative flex flex-col overflow-hidden rounded-2xl p-6 text-left transition-all duration-700 ease-out
        hover:-translate-y-1.5 hover:border-[color:var(--accent)]/45
        focus:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--accent)]/60
        ${shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
    >
      {/* accent glow that blooms on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(120% 80% at 50% 0%, ${hex}1f, transparent 70%)` }}
      />
      {/* top hairline accent */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-50 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${hex}, transparent)` }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-24 w-24 items-center justify-center">
          <ConceptDiagram id={concept.id} color={hex} />
        </div>
        <span className="font-display text-4xl leading-none text-ether-400 transition-colors duration-300 group-hover:text-[color:var(--accent)]">
          {concept.glyph}
        </span>
      </div>

      <div className="relative mt-5">
        <span
          className="block font-mono text-[0.62rem] uppercase tracking-[0.25em]"
          style={{ color: hex, textShadow: `0 0 18px ${hex}66` }}
        >
          <T v={concept.tag} />
        </span>
        <h3 className="mt-2 font-display text-2xl leading-tight text-ether-50">
          <T v={concept.name} />
        </h3>
      </div>

      <p className="relative mt-3 line-clamp-3 text-sm leading-relaxed text-ether-400">
        <T v={concept.definition} />
      </p>

      <div className="relative mt-auto pt-5">
        <div className="hairline mb-3 opacity-60" />
        <div className="flex items-center justify-between gap-3">
          <code className="truncate font-mono text-[0.72rem] text-pulse-300">{concept.math}</code>
          <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-ether-500 transition-colors duration-300 group-hover:text-[color:var(--accent)]">
            <T v={LABELS.open} />
            <span aria-hidden className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ modal */

function ConceptModal({ concept, onClose }: { concept: Concept; onClose: () => void }) {
  const accent = ACCENT[concept.id] ?? "synapse";
  const hex = HEX[accent];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-void-950/75 backdrop-blur-xl"
        style={{ animation: "qm-fade 0.35s ease forwards" }}
      />

      {/* panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass relative z-10 max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-7 sm:p-10"
        style={{ animation: "qm-rise 0.45s cubic-bezier(0.22,1,0.36,1) forwards" }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${hex}, transparent)` }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: hex }}
        />

        {/* close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-ether-600/40 bg-void-900/50 text-ether-400 backdrop-blur transition hover:border-[color:var(--accent)] hover:text-ether-50"
          style={{ ["--accent" as string]: hex }}
          aria-label="Close / 关闭"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div
            className="flex h-44 w-44 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: `radial-gradient(80% 80% at 50% 50%, ${hex}14, transparent 75%)` }}
          >
            <ConceptDiagram id={concept.id} color={hex} large />
          </div>
          <div>
            <div className="font-mono text-[0.62rem] uppercase tracking-[0.25em]" style={{ color: hex, textShadow: `0 0 18px ${hex}66` }}>
              <T v={concept.tag} />
            </div>
            <h2 className="mt-2 font-display text-4xl leading-tight text-ether-50 sm:text-5xl">
              <T v={concept.name} />
            </h2>
            <code className="mt-3 inline-block rounded-md border border-pulse-400/20 bg-void-900/50 px-3 py-1.5 font-mono text-sm text-pulse-300">
              {concept.math}
            </code>
          </div>
        </div>

        <div className="hairline my-7" />

        <Section label={LABELS.meaning} hex={hex} body={concept.definition} />
        <Section label={LABELS.interpretation} hex={hex} body={concept.interpretation} />
        <Section label={LABELS.application} hex={hex} body={concept.application} last />
      </div>

      <style jsx>{`
        @keyframes qm-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes qm-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          div :global([style*="qm-rise"]),
          div :global([style*="qm-fade"]) {
            animation-duration: 0.001ms !important;
          }
        }
      `}</style>
    </div>
  );
}

function Section({ label, hex, body, last }: { label: Bi; hex: string; body: Bi; last?: boolean }) {
  return (
    <div className={last ? "" : "mb-6"}>
      <div className="mb-2 flex items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: hex, boxShadow: `0 0 10px ${hex}` }} />
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em]" style={{ color: hex }}>
          <T v={label} />
        </span>
      </div>
      <p className="text-[0.95rem] leading-relaxed text-ether-200">
        <T v={body} />
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ grid */

export default function ConceptGrid() {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = openId ? concepts.find((c) => c.id === openId) ?? null : null;

  return (
    <div className="mt-16">
      <div className="mb-8 flex items-center gap-4">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-pulse-400">
          <T v={LABELS.eyebrow} />
        </span>
        <span className="hairline flex-1" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {concepts.map((c, i) => (
          <ConceptCard key={c.id} concept={c} index={i} onOpen={() => setOpenId(c.id)} />
        ))}
      </div>

      {active && <ConceptModal concept={active} onClose={() => setOpenId(null)} />}
    </div>
  );
}
