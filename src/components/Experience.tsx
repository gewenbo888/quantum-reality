"use client";

import { sections } from "@/data/content";
import { LangProvider } from "./lang";
import QuantumField from "./QuantumField";
import FloatingEquations from "./FloatingEquations";
import Nav from "./Nav";
import Hero from "./Hero";
import SectionBlock from "./SectionBlock";
import Closing from "./Closing";
import SectionVisual, { Variant } from "./SectionVisual";

// Big interactive "extra" per section (built as self-contained modules)
import Timeline from "./Timeline";
import ConceptGrid from "./ConceptGrid";
import QuantumLab from "./QuantumLab";
import Interpretations from "./Interpretations";
import FutureGrid from "./FutureGrid";
import EquationGallery from "./EquationGallery";
import CosmicZoom from "./CosmicZoom";
import QuoteWall from "./QuoteWall";

const VISUAL: Record<string, Variant> = {
  history: "wave",
  world: "cloud",
  lab: "qubit",
  mind: "eye",
  civilization: "complex",
  math: "complex",
  cosmos: "blackhole",
  existence: "mandala",
};

const EXTRA: Record<string, React.ReactNode> = {
  history: <Timeline />,
  world: <ConceptGrid />,
  lab: <QuantumLab />,
  mind: <Interpretations />,
  civilization: <FutureGrid />,
  math: <EquationGallery />,
  cosmos: <CosmicZoom />,
  existence: <QuoteWall />,
};

export default function Experience() {
  return (
    <LangProvider>
      <QuantumField />
      <FloatingEquations />
      <Nav />
      <main className="relative">
        <Hero />
        {sections.map((s, i) => (
          <div key={s.id} className="relative">
            {i > 0 && <div className="hairline mx-auto max-w-5xl" />}
            <SectionBlock
              section={s}
              index={i}
              visual={<SectionVisual variant={VISUAL[s.id]} className="absolute inset-0 h-full w-full" />}
              extra={EXTRA[s.id]}
            />
          </div>
        ))}
        <div className="hairline mx-auto max-w-5xl" />
        <Closing />
      </main>
    </LangProvider>
  );
}
