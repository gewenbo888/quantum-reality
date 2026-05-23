"use client";

/**
 * QUOTE WALL — a contemplative wall of voices on the nature of reality.
 *
 * Eight quotes mixing physicists (Bohr, Wheeler, Heisenberg, Rovelli,
 * Schrödinger, Feynman) with ancient wisdom (Laozi, Heart Sutra, Zhuangzi).
 * A varied-size masonry grid of glass cards: some featured (wider/taller),
 * each with a large glowing quotation glyph, the text in display italic, and
 * author + source as a mono eyebrow. Ancient-wisdom voices carry a warm gold
 * accent; physicists alternate cyan / violet.
 *
 * Staggered entrance via IntersectionObserver; gentle drift + hover bloom.
 * Reduced-motion is honoured globally (globals.css clamps animation-duration).
 */

import { useEffect, useRef, useState } from "react";
import { quotes, type Quote } from "@/data/content";
import { T } from "@/components/lang";
import type { Bi } from "@/data/content";

const EYEBROW: Bi = {
  en: "Voices · Physics Meets the Ancient Mind",
  zh: "众声 · 物理与古老心灵的相遇",
};

/* English author names used to tag the ancient-wisdom voices (stable keys) */
const ANCIENT = new Set(["Laozi", "The Heart Sutra", "Zhuangzi"]);

type Accent = "pulse" | "synapse" | "awaken";
const HEX: Record<Accent, string> = {
  synapse: "#9a6bff",
  pulse: "#3fc6f5",
  awaken: "#f2c45a",
};

/** Ancient wisdom → gold; physicists alternate cyan / violet. */
function accentFor(q: Quote, physicistIndex: number): Accent {
  if (ANCIENT.has(q.author.en)) return "awaken";
  return physicistIndex % 2 === 0 ? "pulse" : "synapse";
}

/**
 * Layout emphasis per index — a deliberate, varied masonry rhythm.
 * "feature" cards span two columns and read larger; the rest are standard.
 */
const FEATURE = new Set([0, 3, 6]);

function QuoteCard({
  quote,
  index,
  accent,
  feature,
}: {
  quote: Quote;
  index: number;
  accent: Accent;
  feature: boolean;
}) {
  const hex = HEX[accent];
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
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // gentle, varied float so the wall breathes (frozen under reduced-motion)
  const driftDur = 9 + (index % 4) * 1.7;
  const driftDelay = (index % 5) * 0.6;

  return (
    <article
      ref={ref}
      style={{
        transitionDelay: shown ? `${index * 80}ms` : "0ms",
        ["--accent" as string]: hex,
        animation: shown ? `qw-drift ${driftDur}s ease-in-out ${driftDelay}s infinite` : undefined,
      }}
      className={`group glass relative flex flex-col overflow-hidden rounded-2xl p-7 transition-all duration-[900ms] ease-out
        hover:border-[color:var(--accent)]/50 sm:p-9
        ${feature ? "sm:col-span-2" : ""}
        ${shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      {/* hover bloom */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: `radial-gradient(110% 90% at 20% 0%, ${hex}1c, transparent 70%)` }}
      />
      {/* glowing hairline along the top */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-9 top-0 h-px opacity-40 transition-opacity duration-700 group-hover:opacity-90"
        style={{ background: `linear-gradient(90deg, transparent, ${hex}, transparent)` }}
      />

      {/* quotation glyph */}
      <span
        aria-hidden
        className="font-display leading-none transition-transform duration-700 group-hover:scale-105"
        style={{
          color: hex,
          fontSize: feature ? "5rem" : "3.5rem",
          opacity: 0.5,
          textShadow: `0 0 40px ${hex}66`,
          marginBottom: "-0.6em",
        }}
      >
        &ldquo;
      </span>

      <blockquote
        className={`relative font-display italic leading-snug text-ether-50 ${
          feature ? "text-2xl sm:text-[2rem]" : "text-xl sm:text-[1.4rem]"
        }`}
      >
        <T v={quote.text} />
      </blockquote>

      <div className="relative mt-6 flex items-center gap-3">
        <span
          aria-hidden
          className="h-px w-7"
          style={{ background: `linear-gradient(90deg, ${hex}, transparent)` }}
        />
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em]" style={{ color: hex }}>
          <T v={quote.author} />
        </span>
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ether-500">
          · <T v={quote.source} />
        </span>
      </div>
    </article>
  );
}

export default function QuoteWall() {
  // assign physicist alternation so cyan/violet alternate among non-ancient voices
  let physicistCount = -1;

  return (
    <div className="mt-16">
      <div className="mb-8 flex items-center gap-4">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-awaken-500">
          <T v={EYEBROW} />
        </span>
        <span className="hairline flex-1" />
      </div>

      <div className="grid auto-rows-auto grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((q, i) => {
          const isAncient = ANCIENT.has(q.author.en);
          if (!isAncient) physicistCount += 1;
          const accent = accentFor(q, physicistCount);
          return (
            <QuoteCard
              key={`${q.author.en}-${i}`}
              quote={q}
              index={i}
              accent={accent}
              feature={FEATURE.has(i)}
            />
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes qw-drift {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="qw-drift"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
