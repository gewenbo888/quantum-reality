"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Bi } from "@/data/content";

export type Lang = "en" | "zh";

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}

/** Pick a string from a bilingual object. */
export function pick(b: Bi, lang: Lang) {
  return b[lang];
}

/**
 * Inline bilingual text. Re-keys on language change so it cross-fades,
 * and applies the serif-CJK font class when Chinese.
 */
export function T({ v, className }: { v: Bi; className?: string }) {
  const { lang } = useLang();
  return (
    <span key={lang} className={`lang-fade ${lang === "zh" ? "zh" : ""} ${className ?? ""}`}>
      {v[lang]}
    </span>
  );
}

/** Same as <T> but renders each newline as a block — for multi-line pull quotes. */
export function TLines({ v, className }: { v: Bi; className?: string }) {
  const { lang } = useLang();
  const lines = v[lang].split("\n");
  return (
    <span key={lang} className={`lang-fade ${lang === "zh" ? "zh" : ""} ${className ?? ""}`}>
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </span>
  );
}

/**
 * Premium language toggle. A sliding luminous pill, a quantum-glow halo —
 * switching is "measurement": the language collapses to one definite state.
 */
export function LangToggle() {
  const { lang, setLang } = useLang();
  const isZh = lang === "zh";
  return (
    <button
      onClick={() => setLang(isZh ? "en" : "zh")}
      aria-label="Toggle language / 切换语言"
      className="group relative flex h-8 items-center overflow-hidden rounded-full border border-pulse-400/25 bg-void-900/55 text-[0.7rem] font-mono backdrop-blur-md transition hover:border-pulse-300/50"
    >
      {/* glow halo */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(60% 120% at 50% 50%, rgba(63,198,245,0.20), transparent 70%)" }}
      />
      {/* sliding pill */}
      <span
        className="absolute top-1 h-6 w-[2.55rem] rounded-full transition-all duration-500"
        style={{
          left: isZh ? "calc(100% - 2.55rem - 0.25rem)" : "0.25rem",
          transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
          background: "linear-gradient(120deg, rgba(154,107,255,0.45), rgba(63,198,245,0.5))",
          boxShadow: "0 0 18px -2px rgba(63,198,245,0.6), inset 0 1px 0 rgba(255,255,255,0.25)",
        }}
      />
      <span className={`relative z-10 w-[2.55rem] text-center tracking-wide transition-colors duration-300 ${!isZh ? "text-white" : "text-ether-500"}`}>
        EN
      </span>
      <span className={`relative z-10 w-[2.55rem] text-center tracking-wide transition-colors duration-300 ${isZh ? "text-white zh" : "text-ether-500"}`}>
        中文
      </span>
    </button>
  );
}
