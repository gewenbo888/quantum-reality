"use client";

/**
 * MATHEMATICAL BEAUTY — a gallery of the great quantum equations.
 *
 * Each card renders its LaTeX source with KaTeX (displayMode), set sacred
 * behind a soft gradient glow. Beneath sits the bilingual name, a "how to
 * read it" line and a "why it matters" line. Clicking a card lifts the
 * equation into a focused glass overlay where the formula floats huge.
 *
 * KaTeX CSS is imported globally in layout.tsx — not re-imported here.
 * Reduced-motion is honoured globally (globals.css clamps animation-duration).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import katex from "katex";
import { equationCards, type EquationCard, type Bi } from "@/data/content";
import { T } from "@/components/lang";

type Accent = "pulse" | "synapse" | "awaken";

const HEX: Record<Accent, string> = {
  synapse: "#9a6bff",
  pulse: "#3fc6f5",
  awaken: "#f2c45a",
};

/* cycle the palette across the six cards */
const CYCLE: Accent[] = ["pulse", "synapse", "awaken"];

const LABELS = {
  eyebrow: { en: "Mathematical Beauty · The Equations That Dream the World", zh: "数学之美 · 那些梦见世界的方程" },
  reading: { en: "How to read it", zh: "如何读它" },
  meaning: { en: "Why it matters", zh: "何以重要" },
  enlarge: { en: "Enlarge", zh: "放大" },
  close: { en: "Close", zh: "关闭" },
} satisfies Record<string, Bi>;

/* ------------------------------------------------------------------ KaTeX render */

/**
 * Renders a LaTeX string to an HTML string via KaTeX and injects it.
 * KaTeX inherits `color`, so the wrapping container carries `text-ether-50`
 * to render light-on-dark. `throwOnError: false` keeps a malformed source
 * from crashing the whole page.
 */
function TeX({ tex, className }: { tex: string; className?: string }) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        throwOnError: false,
        displayMode: true,
        output: "html",
      }),
    [tex]
  );
  return (
    <span
      className={`katex-light text-ether-50 ${className ?? ""}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ------------------------------------------------------------------ card */

function EquationCardView({
  card,
  index,
  onOpen,
}: {
  card: EquationCard;
  index: number;
  onOpen: () => void;
}) {
  const hex = HEX[CYCLE[index % CYCLE.length]];
  const ref = useRef<HTMLElement>(null);
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
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      style={{
        transitionDelay: shown ? `${(index % 2) * 90 + Math.floor(index / 2) * 70}ms` : "0ms",
        ["--accent" as string]: hex,
      }}
      className={`group glass relative flex flex-col overflow-hidden rounded-2xl p-6 transition-all duration-700 ease-out
        hover:-translate-y-1.5 hover:border-[color:var(--accent)]/45
        sm:p-8 ${shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
    >
      {/* accent glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(120% 80% at 50% 0%, ${hex}1f, transparent 70%)` }}
      />
      {/* top hairline accent */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px opacity-50 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${hex}, transparent)` }}
      />

      <header className="relative flex items-start justify-between gap-4">
        <h3 className="font-display text-2xl leading-tight text-ether-50 sm:text-[1.7rem]">
          <T v={card.name} />
        </h3>
        <button
          onClick={onOpen}
          className="shrink-0 rounded-full border border-ether-600/40 bg-void-900/40 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-ether-500 transition hover:border-[color:var(--accent)] hover:text-ether-50"
          aria-label="Enlarge equation / 放大方程"
        >
          <T v={LABELS.enlarge} />
        </button>
      </header>

      {/* the sacred equation */}
      <button
        onClick={onOpen}
        aria-label="Enlarge equation / 放大方程"
        className="relative my-7 flex min-h-[7.5rem] items-center justify-center overflow-x-auto rounded-2xl px-4 py-7 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--accent)]/60"
      >
        {/* glow backdrop behind the formula */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-80"
          style={{ background: `radial-gradient(70% 120% at 50% 50%, ${hex}14, transparent 72%)` }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
          style={{ background: hex }}
        />
        <TeX tex={card.tex} className="relative text-xl sm:text-2xl" />
      </button>

      <div className="relative space-y-3">
        <p className="text-sm leading-relaxed text-ether-200">
          <span
            className="mr-2 font-mono text-[0.58rem] uppercase tracking-[0.22em]"
            style={{ color: hex }}
          >
            <T v={LABELS.reading} />
          </span>
          <T v={card.reading} />
        </p>
        <div className="hairline opacity-50" />
        <p className="text-sm leading-relaxed text-ether-400">
          <span
            className="mr-2 font-mono text-[0.58rem] uppercase tracking-[0.22em]"
            style={{ color: hex }}
          >
            <T v={LABELS.meaning} />
          </span>
          <T v={card.meaning} />
        </p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ overlay */

function EquationModal({
  card,
  index,
  onClose,
}: {
  card: EquationCard;
  index: number;
  onClose: () => void;
}) {
  const hex = HEX[CYCLE[index % CYCLE.length]];

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
      <div
        aria-hidden
        className="absolute inset-0 bg-void-950/80 backdrop-blur-xl"
        style={{ animation: "eq-fade 0.35s ease forwards" }}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="glass relative z-10 max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-7 text-center sm:p-12"
        style={{ animation: "eq-rise 0.45s cubic-bezier(0.22,1,0.36,1) forwards" }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-12 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${hex}, transparent)` }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: hex }}
        />

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

        <h2 className="relative font-display text-3xl leading-tight text-ether-50 sm:text-4xl">
          <T v={card.name} />
        </h2>

        <div className="relative my-10 flex items-center justify-center overflow-x-auto px-2">
          <TeX tex={card.tex} className="text-2xl sm:text-4xl" />
        </div>

        <div className="hairline mx-auto mb-7 max-w-sm opacity-60" />

        <div className="relative mx-auto max-w-xl space-y-5 text-left">
          <p className="text-[0.95rem] leading-relaxed text-ether-200">
            <span className="mr-2 font-mono text-[0.58rem] uppercase tracking-[0.22em]" style={{ color: hex }}>
              <T v={LABELS.reading} />
            </span>
            <T v={card.reading} />
          </p>
          <p className="text-[0.95rem] leading-relaxed text-ether-400">
            <span className="mr-2 font-mono text-[0.58rem] uppercase tracking-[0.22em]" style={{ color: hex }}>
              <T v={LABELS.meaning} />
            </span>
            <T v={card.meaning} />
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes eq-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes eq-rise {
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
          div :global([style*="eq-rise"]),
          div :global([style*="eq-fade"]) {
            animation-duration: 0.001ms !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ gallery */

export default function EquationGallery() {
  const [openId, setOpenId] = useState<string | null>(null);
  const activeIndex = openId ? equationCards.findIndex((c) => c.id === openId) : -1;
  const active = activeIndex >= 0 ? equationCards[activeIndex] : null;

  return (
    <div className="mt-16">
      <div className="mb-8 flex items-center gap-4">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-pulse-400">
          <T v={LABELS.eyebrow} />
        </span>
        <span className="hairline flex-1" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {equationCards.map((c, i) => (
          <EquationCardView key={c.id} card={c} index={i} onOpen={() => setOpenId(c.id)} />
        ))}
      </div>

      {active && <EquationModal card={active} index={activeIndex} onClose={() => setOpenId(null)} />}

      {/* KaTeX renders light-on-dark; ensure the display block is centred and not clipped */}
      <style jsx global>{`
        .katex-light .katex-display {
          margin: 0;
          overflow-x: auto;
          overflow-y: hidden;
        }
        .katex-light .katex {
          color: inherit;
        }
      `}</style>
    </div>
  );
}
