"use client";

/**
 * FUTUREGRID — a forward-looking horizontal progression / timeline of four
 * quantum–civilisational eras (Now→2035, 2035→2050, 2050→2100, Beyond).
 *
 * Each stage is a glass card with:
 *   • era   — mono eyebrow
 *   • title — font-display
 *   • body  — ether text
 *   • metric — small glowing chip representing rising capability
 *
 * The four cards are connected by a glowing gradient line (cyan → violet → gold).
 * Desktop: horizontal flow. Mobile: vertical stack + vertical connector.
 * Intersection-observer entrance reveals. Hover glow. Bilingual throughout.
 */

import { useEffect, useRef, useState } from "react";
import { futures, type Future } from "@/data/content";
import { T, useLang } from "@/components/lang";

/* ── accent progression: pulse → synapse → awaken → awaken-warm ─────── */
const CARD_ACCENTS = [
  { hex: "#3fc6f5", name: "pulse" as const },
  { hex: "#9a6bff", name: "synapse" as const },
  { hex: "#f2c45a", name: "awaken" as const },
  { hex: "#f7d98a", name: "awaken-light" as const },
];

/* ── connector gradient: flows across the four nodes ─────────────────── */
const CONNECTOR_GRADIENT =
  "linear-gradient(90deg, #3fc6f522, #3fc6f5aa 20%, #9a6bffaa 50%, #f2c45aaa 80%, #f7d98a44)";
const CONNECTOR_GRADIENT_V =
  "linear-gradient(180deg, #3fc6f522, #3fc6f5aa 20%, #9a6bffaa 50%, #f2c45aaa 80%, #f7d98a44)";

/* ── bilingual intro ─────────────────────────────────────────────────── */
const LABEL_INTRO = {
  en: "The quantum future is not a single moment. It is a cascade — each era unlocking the next.",
  zh: "量子的未来并非某一瞬间，而是一场级联——每个时代都解锁着下一个时代。",
};
const LABEL_METRIC = { en: "Rising capability", zh: "跃升能力" };

/* ── FutureCard ───────────────────────────────────────────────────────── */
function FutureCard({
  future,
  index,
  total,
  isLast,
}: {
  future: Future;
  index: number;
  total: number;
  isLast: boolean;
}) {
  const accent = CARD_ACCENTS[index] ?? CARD_ACCENTS[CARD_ACCENTS.length - 1];
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
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative flex flex-1 flex-col items-center">
      {/* ── Desktop connector arrow (between cards, not after last) ─── */}
      {!isLast && (
        <div
          aria-hidden
          className="absolute -right-3 top-[2.6rem] z-10 hidden md:flex items-center"
          style={{ width: "24px" }}
        >
          {/* Arrow stem */}
          <div
            className="h-[2px] w-5"
            style={{
              background: `linear-gradient(90deg, ${accent.hex}88, ${
                CARD_ACCENTS[index + 1]?.hex ?? accent.hex
              }88)`,
              boxShadow: `0 0 8px 0 ${accent.hex}55`,
            }}
          />
          {/* Arrow head */}
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" aria-hidden>
            <path
              d="M1 1l6 4-6 4"
              stroke={CARD_ACCENTS[index + 1]?.hex ?? accent.hex}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
          </svg>
        </div>
      )}

      {/* ── Card ──────────────────────────────────────────────────────── */}
      <div
        ref={ref}
        className="group glass relative flex w-full flex-col overflow-hidden rounded-2xl p-5 transition-all duration-700 ease-out
          hover:-translate-y-1.5"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : "translateY(22px)",
          transitionDelay: shown ? `${index * 120}ms` : "0ms",
          borderColor: `${accent.hex}28`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ["--accent" as any]: accent.hex,
        }}
      >
        {/* ambient hover glow */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(120% 90% at 50% 0%, ${accent.hex}1a, transparent 72%)`,
          }}
        />
        {/* top accent hairline */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent.hex}dd, transparent)`,
            opacity: 0.55,
            boxShadow: `0 0 12px 0 ${accent.hex}55`,
          }}
        />

        {/* node index indicator — small step counter */}
        <div
          aria-hidden
          className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[0.55rem] font-medium"
          style={{
            borderColor: `${accent.hex}44`,
            color: accent.hex,
            background: `${accent.hex}12`,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* era eyebrow */}
        <span
          className="relative mb-2 block font-mono text-[0.6rem] uppercase tracking-[0.25em] pr-8"
          style={{ color: accent.hex, textShadow: `0 0 14px ${accent.hex}55` }}
        >
          <T v={future.era} />
        </span>

        {/* title */}
        <h3 className="relative mb-3 font-display text-xl font-light leading-tight text-ether-50 md:text-2xl">
          <T v={future.title} />
        </h3>

        {/* body */}
        <p className="relative flex-1 font-body text-sm leading-relaxed text-ether-300">
          <T v={future.body} />
        </p>

        {/* metric chip */}
        <div className="relative mt-4">
          <div className="hairline mb-3 opacity-50" />
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full animate-breathe"
              style={{ background: accent.hex, boxShadow: `0 0 8px 0 ${accent.hex}` }}
            />
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ether-500">
              <T v={LABEL_METRIC} />
            </span>
            <span
              className="ml-auto rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] font-medium"
              style={{
                borderColor: `${accent.hex}55`,
                color: accent.hex,
                background: `${accent.hex}14`,
                boxShadow: `0 0 14px -2px ${accent.hex}44`,
              }}
            >
              <T v={future.metric} />
            </span>
          </div>
        </div>
      </div>

      {/* ── Mobile connector (vertical, between cards) ─────────────────── */}
      {!isLast && (
        <div
          aria-hidden
          className="relative my-4 flex w-full flex-col items-center md:hidden"
        >
          {/* stem */}
          <div
            className="h-8 w-[2px] rounded-full"
            style={{
              background: `linear-gradient(180deg, ${accent.hex}aa, ${
                CARD_ACCENTS[index + 1]?.hex ?? accent.hex
              }88)`,
              boxShadow: `0 0 10px 0 ${accent.hex}55`,
            }}
          />
          {/* chevron */}
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
            <path
              d="M1 1l4 5 4-5"
              stroke={CARD_ACCENTS[index + 1]?.hex ?? accent.hex}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.75"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────────── */
export default function FutureGrid() {
  const { lang: _lang } = useLang(); // kept so context is consumed (bilingual re-render)
  void _lang;

  const [connectorShown, setConnectorShown] = useState(false);
  const connectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = connectorRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setConnectorShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="mt-16">
      {/* intro line */}
      <p className="mb-10 text-center font-body text-sm leading-relaxed text-ether-400">
        <T v={LABEL_INTRO} />
      </p>

      {/* ── DESKTOP: horizontal flow with shared gradient connector rail ── */}
      <div className="hidden md:block">
        {/* Connector rail sits behind the cards */}
        <div
          ref={connectorRef}
          className="relative mb-2 h-[2px] mx-[calc(12.5%)] rounded-full transition-all duration-1000 ease-out"
          style={{
            background: CONNECTOR_GRADIENT,
            boxShadow: connectorShown
              ? "0 0 22px -4px rgba(63,198,245,0.5), 0 0 40px -10px rgba(154,107,255,0.4)"
              : "none",
            opacity: connectorShown ? 1 : 0,
            transitionDelay: "200ms",
          }}
        >
          {/* Animated travelling glow dot */}
          <span
            aria-hidden
            className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
            style={{
              background: "white",
              boxShadow: "0 0 16px 4px rgba(255,255,255,0.7), 0 0 30px 8px rgba(63,198,245,0.5)",
              animation: connectorShown ? "fg-travel 5s linear infinite" : "none",
            }}
          />
        </div>

        {/* Cards row */}
        <div className="flex items-stretch gap-6">
          {futures.map((future, i) => (
            <FutureCard
              key={future.era.en}
              future={future}
              index={i}
              total={futures.length}
              isLast={i === futures.length - 1}
            />
          ))}
        </div>
      </div>

      {/* ── MOBILE: vertical stack ─────────────────────────────────────── */}
      <div className="flex flex-col md:hidden">
        {/* Vertical connector rail */}
        <div className="relative">
          <div
            className="absolute bottom-0 left-[1.4rem] top-0 w-[2px] rounded-full"
            style={{
              background: CONNECTOR_GRADIENT_V,
              boxShadow: "0 0 14px -2px rgba(63,198,245,0.4), 0 0 28px -8px rgba(154,107,255,0.3)",
            }}
          />
          <div className="flex flex-col gap-0 pl-12">
            {futures.map((future, i) => (
              <FutureCard
                key={future.era.en}
                future={future}
                index={i}
                total={futures.length}
                isLast={i === futures.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* keyframe for the travelling glow dot */}
      <style>{`
        @keyframes fg-travel {
          0%   { left: 0%; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fg-travel-dot { animation-duration: 0.001ms !important; }
        }
      `}</style>
    </div>
  );
}
