"use client";

import { useEffect, useState } from "react";
import { sections, nav } from "@/data/content";
import { T, LangToggle, useLang } from "./lang";

export default function Nav() {
  const { lang } = useLang();
  const [active, setActive] = useState("");
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const ids = ["top", ...sections.map((s) => s.id)];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    const onScroll = () => setSolid(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "bg-void-950/55 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative grid h-7 w-7 place-items-center">
            <span className="absolute inset-0 rounded-full bg-synapse-500/30 blur-md transition group-hover:bg-synapse-400/50" />
            <span className="relative h-3.5 w-3.5 rounded-full bg-gradient-to-br from-awaken-400 via-pulse-400 to-synapse-500" />
          </span>
          <span className="text-[0.82rem] font-medium tracking-wide text-ether-100">
            <T v={nav.brand} />
          </span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`text-[0.72rem] font-mono uppercase tracking-[0.15em] transition ${
                active === s.id ? "text-pulse-300" : "text-ether-500 hover:text-ether-200"
              }`}
            >
              <span className="mr-1 opacity-50">{s.num}</span>
              <T v={s.nav} />
            </a>
          ))}
        </nav>

        <LangToggle />
      </div>
    </header>
  );
}
