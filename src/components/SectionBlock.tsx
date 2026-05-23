"use client";

import { ReactNode } from "react";
import type { Section } from "@/data/content";
import { T, TLines } from "./lang";
import Reveal from "./Reveal";

const ACCENT: Record<Section["accent"], { text: string; dot: string; glow: string; line: string }> = {
  synapse: { text: "text-synapse-300", dot: "bg-synapse-400", glow: "rgba(154,107,255,0.16)", line: "from-synapse-400" },
  pulse: { text: "text-pulse-300", dot: "bg-pulse-400", glow: "rgba(63,198,245,0.15)", line: "from-pulse-400" },
  awaken: { text: "text-awaken-400", dot: "bg-awaken-400", glow: "rgba(242,196,90,0.16)", line: "from-awaken-400" },
};

export default function SectionBlock({
  section,
  index,
  visual,
  extra,
}: {
  section: Section;
  index: number;
  visual: ReactNode;
  extra?: ReactNode;
}) {
  const a = ACCENT[section.accent];
  const reverse = index % 2 === 1;

  return (
    <section id={section.id} className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8 md:py-32">
      {/* heading */}
      <Reveal>
        <div className="relative mb-12">
          <span className="pointer-events-none absolute -top-16 left-0 select-none font-display text-[7rem] font-light leading-none text-white/[0.035] sm:text-[10rem]">
            {section.num}
          </span>
          <div className="relative flex items-center gap-3">
            <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
            <p className={`font-mono text-[0.68rem] uppercase tracking-[0.28em] ${a.text}`}>
              <T v={section.eyebrow} />
            </p>
          </div>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-light leading-[1.08] text-ether-50 sm:text-5xl md:text-6xl">
            <T v={section.title} />
          </h2>
        </div>
      </Reveal>

      {/* visual + prose */}
      <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-14 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <Reveal y={40}>
          <div
            className="glass relative h-[340px] overflow-hidden rounded-3xl sm:h-[420px]"
            style={{ boxShadow: `inset 0 1px 0 rgba(205,178,255,0.08), 0 40px 90px -50px ${a.glow}` }}
          >
            <div className="absolute inset-0" style={{ background: `radial-gradient(120% 80% at 50% 0%, ${a.glow}, transparent 70%)` }} />
            {visual}
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="font-display text-2xl font-light leading-snug text-ether-100 md:text-[1.7rem]">
              <T v={section.lead} />
            </p>
          </Reveal>
          <div className="mt-6 space-y-5">
            {section.paras.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="text-[0.98rem] leading-[1.85] text-ether-200/85">
                  <T v={p} />
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* open questions */}
      <Reveal>
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/5 sm:grid-cols-2">
          {section.questions.map((q, i) => (
            <div key={i} className="flex gap-3 bg-white/[0.015] p-5 transition hover:bg-white/[0.04]">
              <span className={`font-mono text-xs ${a.text} pt-0.5`}>?</span>
              <p className="text-sm leading-relaxed text-ether-200/80">
                <T v={q} />
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {extra}

      {/* pull quote */}
      <Reveal>
        <figure className="relative mx-auto mt-20 max-w-3xl text-center">
          <div className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-40 w-3/4 blur-3xl" style={{ background: a.glow }} />
          <div className={`mx-auto mb-7 h-px w-24 bg-gradient-to-r ${a.line} to-transparent`} />
          <blockquote className="font-display text-2xl font-light italic leading-snug text-ether-50 sm:text-3xl md:text-[2.3rem]">
            <TLines v={section.quote} />
          </blockquote>
        </figure>
      </Reveal>
    </section>
  );
}
