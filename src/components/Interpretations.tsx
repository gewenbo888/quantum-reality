"use client";

/**
 * INTERPRETATIONS — the six great readings of quantum mechanics.
 *
 * Two modes that the user can toggle:
 *  1. GRID (default)  — all six glass cards visible at once for quick scanning,
 *                       each showing name / tagline / three facets.
 *  2. FOCUS           — a selectable tab row + a large single-card deep-dive.
 *
 * Each interpretation gets a distinct accent cycling: pulse → synapse → awaken.
 * Fully bilingual via <T v={...}/> / useLang(). Respects prefers-reduced-motion.
 */

import { useState, useEffect, useRef } from "react";
import { interpretations, type Interpretation } from "@/data/content";
import { T, useLang, pick } from "@/components/lang";

/* ── accent palette, cycling pulse / synapse / awaken ────────────────── */
type AccentKey = "pulse" | "synapse" | "awaken";

const ACCENTS: AccentKey[] = ["pulse", "synapse", "awaken", "pulse", "synapse", "awaken"];

const HEX: Record<AccentKey, string> = {
  pulse: "#3fc6f5",
  synapse: "#9a6bff",
  awaken: "#f2c45a",
};

const BORDER_CLASS: Record<AccentKey, string> = {
  pulse: "border-pulse-500/40",
  synapse: "border-synapse-500/40",
  awaken: "border-awaken-500/40",
};

const TEXT_CLASS: Record<AccentKey, string> = {
  pulse: "text-pulse-400",
  synapse: "text-synapse-400",
  awaken: "text-awaken-400",
};

/* ── bilingual row labels ────────────────────────────────────────────── */
const LABEL_COLLAPSE = { en: "At measurement", zh: "测量时" };
const LABEL_REALITY = { en: "What reality is", zh: "实在为何" };
const LABEL_COST = { en: "The price", zh: "代价" };
const LABEL_GRID_VIEW = { en: "Compare All", zh: "全览对比" };
const LABEL_FOCUS_VIEW = { en: "Deep Dive", zh: "深度细读" };
const LABEL_CLOSING = {
  en: "None has been ruled out. To choose one is to choose what you believe the universe is.",
  zh: "它们无一被排除。选择其一，便是选择你所相信的宇宙。",
};
const LABEL_INTRO = {
  en: "Six interpretations. One set of equations. Infinitely different visions of reality.",
  zh: "六种诠释，同一套方程，无穷不同的实在图景。",
};
const LABEL_WHO = { en: "Proposed by", zh: "提出者" };

/* ── FacetRow ─────────────────────────────────────────────────────────── */
function FacetRow({
  label,
  value,
  hex,
}: {
  label: { en: string; zh: string };
  value: { en: string; zh: string };
  hex: string;
}) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-ether-600/20 last:border-0">
      <span
        className="font-mono text-[0.62rem] uppercase tracking-[0.22em]"
        style={{ color: hex, textShadow: `0 0 14px ${hex}55` }}
      >
        <T v={label} />
      </span>
      <p className="font-body text-sm leading-relaxed text-ether-200">
        <T v={value} />
      </p>
    </div>
  );
}

/* ── GridCard ─────────────────────────────────────────────────────────── */
function GridCard({
  interp,
  accentKey,
  index,
  onFocus,
}: {
  interp: Interpretation;
  accentKey: AccentKey;
  index: number;
  onFocus: () => void;
}) {
  const hex = HEX[accentKey];
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onFocus}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onFocus()}
      aria-label={`${interp.name.en} — ${interp.year}`}
      className="group glass relative flex cursor-pointer flex-col overflow-hidden rounded-2xl p-5 transition-all duration-700 ease-out
        hover:-translate-y-1.5 focus:outline-none focus-visible:ring-1"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(20px)",
        transitionDelay: shown ? `${index * 70}ms` : "0ms",
        borderColor: shown ? `${hex}25` : undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ["--accent" as any]: hex,
      }}
    >
      {/* hover bloom */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(130% 80% at 50% 0%, ${hex}18, transparent 70%)`,
        }}
      />
      {/* top accent line */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${hex}cc, transparent)`,
          opacity: 0.6,
        }}
      />

      {/* header */}
      <div className="relative mb-3 flex items-start justify-between gap-3">
        <div>
          <span
            className="block font-mono text-[0.6rem] uppercase tracking-[0.22em] mb-1"
            style={{ color: hex }}
          >
            {interp.year}
          </span>
          <h3 className="font-display text-xl font-light leading-tight text-ether-50">
            <T v={interp.name} />
          </h3>
        </div>
        <span
          className="shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-ether-500 transition-colors duration-300 group-hover:text-[color:var(--accent)] mt-1"
        >
          →
        </span>
      </div>

      {/* tagline */}
      <p
        className="relative mb-4 font-display text-base italic leading-snug"
        style={{ color: hex }}
      >
        <T v={interp.tagline} />
      </p>

      <div className="relative flex flex-col gap-0 flex-1">
        <FacetRow label={LABEL_COLLAPSE} value={interp.collapse} hex={hex} />
        <FacetRow label={LABEL_REALITY} value={interp.reality} hex={hex} />
        <FacetRow label={LABEL_COST} value={interp.cost} hex={hex} />
      </div>

      {/* who eyebrow at bottom */}
      <div className="relative mt-4 flex items-center gap-2">
        <span className="h-1 w-1 rounded-full shrink-0" style={{ background: hex, boxShadow: `0 0 8px ${hex}` }} />
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ether-500">
          <T v={interp.who} />
        </span>
      </div>
    </div>
  );
}

/* ── FocusPanel ───────────────────────────────────────────────────────── */
function FocusPanel({ interp, accentKey }: { interp: Interpretation; accentKey: AccentKey }) {
  const hex = HEX[accentKey];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [interp.id]);

  return (
    <div
      className="glass rounded-2xl overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.4s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)",
        borderColor: `${hex}30`,
      }}
    >
      {/* top glow bar */}
      <div
        aria-hidden
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${hex}, transparent)` }}
      />

      <div className="p-7 md:p-10">
        {/* eyebrow: who + year */}
        <div className="mb-2 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: hex, boxShadow: `0 0 10px ${hex}` }} />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-ether-400">
            <T v={interp.who} />
            <span className="mx-1.5 text-ether-600">·</span>
            {interp.year}
          </span>
        </div>

        {/* tagline — big display */}
        <p
          className="mb-6 font-display text-2xl italic leading-snug md:text-3xl"
          style={{
            background: `linear-gradient(120deg, ${hex}, #f4f6ff)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <T v={interp.tagline} />
        </p>

        <div className="hairline mb-6" />

        {/* three facet rows */}
        <div className="flex flex-col gap-0">
          <FacetRow label={LABEL_COLLAPSE} value={interp.collapse} hex={hex} />
          <FacetRow label={LABEL_REALITY} value={interp.reality} hex={hex} />
          <FacetRow label={LABEL_COST} value={interp.cost} hex={hex} />
        </div>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────────── */
export default function Interpretations() {
  const { lang } = useLang();
  const [mode, setMode] = useState<"grid" | "focus">("grid");
  const [selectedId, setSelectedId] = useState<string>(interpretations[0].id);

  const selectedInterp = interpretations.find((i) => i.id === selectedId) ?? interpretations[0];
  const selectedAccentIdx = interpretations.findIndex((i) => i.id === selectedId);
  const selectedAccent = ACCENTS[selectedAccentIdx] ?? "pulse";

  function handleFocus(id: string) {
    setSelectedId(id);
    setMode("focus");
  }

  return (
    <div className="mt-16">
      {/* intro line */}
      <p className="mb-8 text-center font-body text-sm leading-relaxed text-ether-400">
        <T v={LABEL_INTRO} />
      </p>

      {/* mode toggle */}
      <div className="mb-8 flex justify-center gap-2">
        {(["grid", "focus"] as const).map((m) => {
          const label = m === "grid" ? LABEL_GRID_VIEW : LABEL_FOCUS_VIEW;
          const isActive = mode === m;
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={isActive}
              className={[
                "flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] transition-all duration-300",
                isActive
                  ? "border-pulse-500/60 bg-pulse-500/10 text-pulse-400"
                  : "border-ether-600/30 bg-transparent text-ether-500 hover:border-ether-500/50 hover:text-ether-300",
              ].join(" ")}
              style={isActive ? { boxShadow: "0 0 22px -2px rgba(63,198,245,0.35)" } : undefined}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full transition-all duration-300"
                style={{ background: isActive ? "#3fc6f5" : "#474d72" }}
              />
              <T v={label} />
            </button>
          );
        })}
      </div>

      {/* GRID MODE */}
      {mode === "grid" && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {interpretations.map((interp, i) => (
            <GridCard
              key={interp.id}
              interp={interp}
              accentKey={ACCENTS[i]}
              index={i}
              onFocus={() => handleFocus(interp.id)}
            />
          ))}
        </div>
      )}

      {/* FOCUS MODE */}
      {mode === "focus" && (
        <div>
          {/* tab chips */}
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {interpretations.map((interp, i) => {
              const hex = HEX[ACCENTS[i]];
              const isActive = interp.id === selectedId;
              return (
                <button
                  key={interp.id}
                  onClick={() => setSelectedId(interp.id)}
                  aria-pressed={isActive}
                  className={[
                    "flex flex-col items-center gap-0.5 rounded-xl border px-3.5 py-2 transition-all duration-300 text-left",
                    isActive
                      ? `${BORDER_CLASS[ACCENTS[i]]} bg-void-800/60`
                      : "border-ether-600/25 bg-transparent opacity-55 hover:opacity-80",
                  ].join(" ")}
                  style={isActive ? { boxShadow: `0 0 24px -4px ${hex}55` } : undefined}
                >
                  <span
                    className="font-mono text-[0.58rem] uppercase tracking-[0.2em]"
                    style={{ color: isActive ? hex : "#6a719c" }}
                  >
                    {interp.year}
                  </span>
                  <span
                    className={`font-body text-[0.78rem] font-medium leading-tight transition-colors duration-300 ${
                      isActive ? TEXT_CLASS[ACCENTS[i]] : "text-ether-400"
                    }`}
                  >
                    <T v={interp.name} />
                  </span>
                </button>
              );
            })}
          </div>

          {/* detail panel */}
          <div className="mx-auto max-w-2xl">
            <FocusPanel
              key={selectedId}
              interp={selectedInterp}
              accentKey={selectedAccent}
            />
          </div>
        </div>
      )}

      {/* closing statement */}
      <div className="mt-12 text-center">
        <div className="hairline mx-auto mb-6 w-24" />
        <p
          className="mx-auto max-w-xl font-display text-base italic leading-relaxed md:text-lg"
          style={{
            background: "linear-gradient(120deg, #3fc6f5, #cdb2ff, #f2c45a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <T v={LABEL_CLOSING} />
        </p>
      </div>
    </div>
  );
}
