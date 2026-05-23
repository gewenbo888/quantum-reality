"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { timeline } from "@/data/content";
import type { TimelineEvent } from "@/data/content";
import { T, useLang, pick } from "@/components/lang";

/* ─── tag metadata ─────────────────────────────────────────────────── */

type TagKey = TimelineEvent["tag"];

const TAG_META: Record<
  TagKey,
  { label: { en: string; zh: string }; color: string; glow: string; border: string; bg: string; dot: string }
> = {
  theory: {
    label: { en: "Theory", zh: "理论" },
    color: "text-pulse-400",
    glow: "0 0 22px 0 rgba(63,198,245,0.55)",
    border: "border-pulse-500/60",
    bg: "bg-pulse-500/10",
    dot: "#3fc6f5",
  },
  experiment: {
    label: { en: "Experiment", zh: "实验" },
    color: "text-awaken-400",
    glow: "0 0 22px 0 rgba(242,196,90,0.55)",
    border: "border-awaken-500/60",
    bg: "bg-awaken-500/10",
    dot: "#f2c45a",
  },
  debate: {
    label: { en: "Debate", zh: "论战" },
    color: "text-synapse-400",
    glow: "0 0 22px 0 rgba(154,107,255,0.55)",
    border: "border-synapse-500/60",
    bg: "bg-synapse-500/10",
    dot: "#9a6bff",
  },
  technology: {
    label: { en: "Technology", zh: "技术" },
    color: "text-ether-200",
    glow: "0 0 22px 0 rgba(205,211,242,0.45)",
    border: "border-ether-200/50",
    bg: "bg-ether-200/8",
    dot: "#cdd3f2",
  },
};

const ALL_TAGS: TagKey[] = ["theory", "experiment", "debate", "technology"];

/* ─── helper: stagger delay ─────────────────────────────────────────── */
function staggerDelay(i: number) {
  return `${i * 55}ms`;
}

/* ─── main component ────────────────────────────────────────────────── */
export default function Timeline() {
  const { lang } = useLang();

  const [activeIdx, setActiveIdx] = useState(0);
  const [activeTags, setActiveTags] = useState<Set<TagKey>>(new Set(ALL_TAGS));
  const [cardVisible, setCardVisible] = useState(false);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const axisRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // mount stagger
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // card animate-in when activeIdx changes
  useEffect(() => {
    setCardVisible(false);
    const t = setTimeout(() => setCardVisible(true), 80);
    return () => clearTimeout(t);
  }, [activeIdx]);

  /* visible events (filtered) */
  const visibleIndices = timeline
    .map((ev, i) => ({ ev, i }))
    .filter(({ ev }) => activeTags.has(ev.tag));

  /* progress fraction: up to the active node along the axis */
  const totalNodes = timeline.length;
  const progressFraction = totalNodes > 1 ? activeIdx / (totalNodes - 1) : 0;

  /* ── tag chip toggle ── */
  function toggleTag(tag: TagKey) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        // don't allow deselecting all
        if (next.size === 1) return next;
        next.delete(tag);
        // if activeIdx event is now hidden, jump to first visible
        const currentTag = timeline[activeIdx].tag;
        if (!next.has(currentTag)) {
          const firstVisible = timeline.findIndex((ev) => next.has(ev.tag));
          if (firstVisible !== -1) setActiveIdx(firstVisible);
        }
      } else {
        next.add(tag);
      }
      return next;
    });
  }

  /* ── navigate prev/next (skip filtered-out events) ── */
  const navigate = useCallback(
    (dir: 1 | -1) => {
      let idx = activeIdx + dir;
      while (idx >= 0 && idx < timeline.length) {
        if (activeTags.has(timeline[idx].tag)) {
          setPrevIdx(activeIdx);
          setActiveIdx(idx);
          return;
        }
        idx += dir;
      }
    },
    [activeIdx, activeTags]
  );

  /* keyboard nav */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") navigate(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") navigate(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  /* ── active event ── */
  const active = timeline[activeIdx];
  const tagMeta = TAG_META[active.tag];

  /* ── can prev/next ── */
  const canPrev = visibleIndices.some(({ i }) => i < activeIdx);
  const canNext = visibleIndices.some(({ i }) => i > activeIdx);

  return (
    <div className="mt-16">
      {/* ── Section header ── */}
      <div className="mb-12 text-center">
        <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.25em] text-pulse-400">
          <T v={{ en: "History of Quantum Theory", zh: "量子理论史" }} />
        </p>
        <h2 className="font-display text-3xl font-light tracking-tight text-ether-50 md:text-4xl">
          <T v={{ en: "A century of impossible discoveries", zh: "一个世纪的不可能发现" }} />
        </h2>
        <div className="hairline mx-auto mt-5 w-24" />
      </div>

      {/* ── Tag filter chips ── */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {ALL_TAGS.map((tag) => {
          const meta = TAG_META[tag];
          const active = activeTags.has(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              aria-pressed={active}
              className={[
                "relative flex items-center gap-1.5 rounded-full border px-3.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] transition-all duration-300",
                active
                  ? `${meta.border} ${meta.bg} ${meta.color}`
                  : "border-ether-600/30 bg-transparent text-ether-500 opacity-45",
              ].join(" ")}
              style={active ? { boxShadow: meta.glow } : undefined}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: active ? meta.dot : "#474d72" }}
              />
              <T v={meta.label} />
            </button>
          );
        })}
      </div>

      {/* ────────────────── DESKTOP: horizontal axis ────────────────── */}
      <div className="hidden md:block">
        {/* Axis container */}
        <div ref={axisRef} className="relative mx-auto mb-10 px-6" style={{ maxWidth: "1100px" }}>
          {/* Background rail */}
          <div
            className="absolute left-6 right-6 top-[22px] h-[1px]"
            style={{
              background: "linear-gradient(90deg, rgba(154,107,255,0.12), rgba(63,198,245,0.15), rgba(154,107,255,0.12))",
            }}
          />

          {/* Glowing progress fill */}
          <div
            className="absolute left-6 top-[22px] h-[2px] rounded-full transition-all duration-700 ease-out"
            style={{
              width: `calc((100% - 3rem) * ${progressFraction})`,
              background: `linear-gradient(90deg, rgba(154,107,255,0.7), ${tagMeta.dot}cc)`,
              boxShadow: `0 0 12px 0 ${tagMeta.dot}88`,
            }}
          />

          {/* Year nodes */}
          <div className="relative flex items-start justify-between">
            {timeline.map((ev, i) => {
              const meta = TAG_META[ev.tag];
              const isActive = i === activeIdx;
              const isFiltered = !activeTags.has(ev.tag);
              return (
                <div
                  key={i}
                  className="flex flex-col items-center"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity 0.5s ease ${staggerDelay(i)}, transform 0.5s ease ${staggerDelay(i)}`,
                  }}
                >
                  {/* Node button */}
                  <button
                    onClick={() => {
                      setPrevIdx(activeIdx);
                      setActiveIdx(i);
                    }}
                    disabled={isFiltered}
                    aria-label={`${ev.year}: ${pick(ev.title, lang)}`}
                    className="group relative mb-2 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-pulse-400"
                    style={{
                      opacity: isFiltered ? 0.2 : 1,
                    }}
                  >
                    {/* Outer ring for active */}
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-full animate-breathe"
                        style={{
                          border: `1px solid ${meta.dot}55`,
                          boxShadow: meta.glow,
                        }}
                      />
                    )}
                    {/* Dot */}
                    <span
                      className="relative z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full transition-all duration-300"
                      style={{
                        background: isActive
                          ? meta.dot
                          : isFiltered
                          ? "#1a1f47"
                          : `${meta.dot}55`,
                        boxShadow: isActive ? meta.glow : "none",
                        transform: isActive ? "scale(1.4)" : "scale(1)",
                      }}
                    >
                      {isActive && (
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: meta.dot,
                            filter: "blur(4px)",
                            opacity: 0.6,
                          }}
                        />
                      )}
                    </span>
                  </button>

                  {/* Year label */}
                  <span
                    className={[
                      "font-mono text-[0.62rem] tracking-widest transition-all duration-300",
                      isActive ? `${meta.color} font-medium` : isFiltered ? "text-ether-600/30" : "text-ether-500",
                    ].join(" ")}
                  >
                    {ev.year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ────────────────── MOBILE: vertical timeline ────────────────── */}
      <div className="md:hidden mb-6">
        <div className="relative pl-8">
          {/* Vertical rail */}
          <div
            className="absolute bottom-0 left-[18px] top-0 w-[1px]"
            style={{
              background: "linear-gradient(180deg, rgba(154,107,255,0.12), rgba(63,198,245,0.18), rgba(154,107,255,0.12))",
            }}
          />
          {/* Vertical progress */}
          <div
            className="absolute left-[18px] top-0 w-[2px] rounded-full transition-all duration-700 ease-out"
            style={{
              height: `calc(${progressFraction * 100}%)`,
              background: `linear-gradient(180deg, rgba(154,107,255,0.7), ${tagMeta.dot}cc)`,
              boxShadow: `0 0 10px 0 ${tagMeta.dot}88`,
            }}
          />

          <div className="space-y-1">
            {timeline.map((ev, i) => {
              const meta = TAG_META[ev.tag];
              const isActive = i === activeIdx;
              const isFiltered = !activeTags.has(ev.tag);
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (!isFiltered) {
                      setPrevIdx(activeIdx);
                      setActiveIdx(i);
                    }
                  }}
                  disabled={isFiltered}
                  className={[
                    "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-300",
                    isActive ? `${meta.bg} ${meta.border} border` : "border border-transparent",
                    isFiltered ? "opacity-25 cursor-default" : "cursor-pointer",
                  ].join(" ")}
                  style={{
                    opacity: mounted ? (isFiltered ? 0.25 : 1) : 0,
                    transform: mounted ? "translateX(0)" : "translateX(-8px)",
                    transition: `opacity 0.4s ease ${staggerDelay(i)}, transform 0.4s ease ${staggerDelay(i)}, background 0.3s, border 0.3s`,
                  }}
                >
                  {/* Node dot on rail */}
                  <span
                    className="absolute -left-[15px] flex h-4 w-4 items-center justify-center rounded-full"
                    style={{
                      background: isActive ? meta.dot : `${meta.dot}33`,
                      boxShadow: isActive ? meta.glow : "none",
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-full animate-breathe"
                        style={{ border: `1px solid ${meta.dot}55` }}
                      />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-mono text-[0.65rem] tracking-widest ${meta.color}`}>{ev.year}</span>
                      <span className="truncate font-body text-sm text-ether-200">
                        <T v={ev.title} />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ────────────────── Detail card ────────────────── */}
      <div
        className="mx-auto max-w-3xl"
        style={{ transition: "opacity 0.35s ease, transform 0.35s ease" }}
      >
        <div
          key={activeIdx}
          className="glass rounded-2xl p-7 md:p-10"
          style={{
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
            borderColor: `${tagMeta.dot}28`,
          }}
        >
          {/* Card top row: year + tag chip */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            {/* Year */}
            <div>
              <span
                className="font-display text-6xl font-light leading-none md:text-7xl"
                style={{
                  background: `linear-gradient(120deg, ${tagMeta.dot}, #f4f6ff)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                }}
              >
                {active.year}
              </span>
            </div>

            {/* Tag chip */}
            <span
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] ${tagMeta.border} ${tagMeta.bg} ${tagMeta.color}`}
              style={{ boxShadow: tagMeta.glow }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: tagMeta.dot }}
              />
              <T v={TAG_META[active.tag].label} />
            </span>
          </div>

          {/* Who */}
          <p className="mb-2 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-ether-400">
            <T v={active.who} />
          </p>

          {/* Title */}
          <h3 className="mb-5 font-display text-2xl font-light leading-snug text-ether-50 md:text-3xl">
            <T v={active.title} />
          </h3>

          {/* Divider */}
          <div className="hairline mb-5" />

          {/* Blurb */}
          <p className="font-body text-base leading-relaxed text-ether-200 md:text-lg">
            <T v={active.blurb} />
          </p>

          {/* Prev / Next navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              disabled={!canPrev}
              aria-label={pick({ en: "Previous event", zh: "上一个" }, lang)}
              className={[
                "group flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.15em] transition-all duration-300",
                canPrev
                  ? "border-ether-600/40 text-ether-300 hover:border-pulse-400/50 hover:text-pulse-300"
                  : "cursor-not-allowed border-ether-600/20 text-ether-600/30",
              ].join(" ")}
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
              <T v={{ en: "Prev", zh: "上一个" }} />
            </button>

            {/* Position indicator */}
            <div className="flex items-center gap-1.5">
              {visibleIndices.map(({ i }) => (
                <button
                  key={i}
                  onClick={() => { setPrevIdx(activeIdx); setActiveIdx(i); }}
                  aria-label={timeline[i].year}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIdx ? "18px" : "5px",
                    height: "5px",
                    background: i === activeIdx ? tagMeta.dot : `${tagMeta.dot}44`,
                    boxShadow: i === activeIdx ? tagMeta.glow : "none",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => navigate(1)}
              disabled={!canNext}
              aria-label={pick({ en: "Next event", zh: "下一个" }, lang)}
              className={[
                "group flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.15em] transition-all duration-300",
                canNext
                  ? "border-ether-600/40 text-ether-300 hover:border-pulse-400/50 hover:text-pulse-300"
                  : "cursor-not-allowed border-ether-600/20 text-ether-600/30",
              ].join(" ")}
            >
              <T v={{ en: "Next", zh: "下一个" }} />
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Event count / context ── */}
      <p className="mt-6 text-center font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ether-600/60">
        <T
          v={{
            en: `${visibleIndices.length} of ${timeline.length} events · 1900–2022`,
            zh: `显示 ${visibleIndices.length} / ${timeline.length} 个事件 · 1900–2022`,
          }}
        />
      </p>
    </div>
  );
}
