"use client";

import { useState } from "react";
import { T } from "@/components/lang";
import { lab, type Bi } from "@/data/content";
import DoubleSlit from "@/components/DoubleSlit";
import BlochSphere from "@/components/BlochSphere";
import Entanglement from "@/components/Entanglement";
import QuantumCircuit from "@/components/QuantumCircuit";
import QuantumRNG from "@/components/QuantumRNG";

/**
 * The Quantum Lab — five live experiments behind elegant glass tabs.
 * Each experiment computes real amplitudes / probabilities; nothing is faked.
 */

type Tab = {
  id: string;
  title: Bi;
  desc: Bi;
  accent: string; // "r,g,b"
  Component: () => JSX.Element;
};

const TABS: Tab[] = [
  { id: "double-slit", title: lab.doubleSlit.title, desc: lab.doubleSlit.desc, accent: "63,198,245", Component: DoubleSlit },
  { id: "bloch", title: lab.bloch.title, desc: lab.bloch.desc, accent: "154,107,255", Component: BlochSphere },
  { id: "entangle", title: lab.entangle.title, desc: lab.entangle.desc, accent: "111,220,255", Component: Entanglement },
  { id: "circuit", title: lab.circuit.title, desc: lab.circuit.desc, accent: "247,217,138", Component: QuantumCircuit },
  { id: "rng", title: lab.rng.title, desc: lab.rng.desc, accent: "242,196,90", Component: QuantumRNG },
];

export default function QuantumLab() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];
  const Active = tab.Component;

  return (
    <div className="mt-16">
      {/* intro */}
      <p className="mx-auto mb-8 max-w-2xl text-center text-base text-ether-300 sm:text-lg">
        <T v={lab.intro} />
      </p>

      {/* tabs */}
      <div className="-mx-2 mb-8 flex snap-x gap-2 overflow-x-auto px-2 pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
        {TABS.map((tb, i) => {
          const isActive = i === active;
          return (
            <button
              key={tb.id}
              onClick={() => setActive(i)}
              className="group relative shrink-0 snap-start rounded-full px-5 py-2.5 text-sm transition hover:-translate-y-0.5"
              style={{
                background: isActive ? `rgba(${tb.accent},0.1)` : "rgba(20,24,55,0.35)",
                border: `1px solid rgba(${tb.accent},${isActive ? 0.55 : 0.14})`,
                color: isActive ? "#f4f6ff" : "#9aa3cf",
                boxShadow: isActive ? `0 0 24px -8px rgba(${tb.accent},0.7)` : "none",
                backdropFilter: "blur(12px)",
              }}
            >
              <T v={tb.title} />
              {/* glowing active underline */}
              <span
                className="absolute -bottom-px left-1/2 h-px -translate-x-1/2 rounded-full transition-all duration-300"
                style={{
                  width: isActive ? "60%" : "0%",
                  background: `rgba(${tb.accent},1)`,
                  boxShadow: `0 0 10px rgba(${tb.accent},0.9)`,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* active experiment panel */}
      <div className="glass rounded-3xl p-5 sm:p-7">
        <header className="mb-6">
          <span
            className="mb-2 block font-mono text-[0.6rem] uppercase tracking-[0.25em]"
            style={{ color: `rgb(${tab.accent})` }}
          >
            {`0${active + 1} / 05`}
          </span>
          <h3 className="font-display text-3xl text-ether-50 sm:text-4xl">
            <T v={tab.title} />
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ether-400">
            <T v={tab.desc} />
          </p>
        </header>

        {/* re-key on tab id so the experiment cross-fades on switch */}
        <div key={tab.id} className="lab-fade">
          <Active />
        </div>
      </div>

      <style>{`
        .lab-fade { animation: labfade 0.45s ease; }
        @keyframes labfade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .lab-fade { animation: none; } }
      `}</style>
    </div>
  );
}
