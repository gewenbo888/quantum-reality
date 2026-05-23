"use client";

import { useMemo, useState } from "react";
import { T, useLang, pick } from "@/components/lang";
import { lab } from "@/data/content";

/**
 * A two-qubit quantum circuit. The register state is a 4-vector of complex
 * amplitudes for |00⟩, |01⟩, |10⟩, |11⟩ (start |00⟩). Single-qubit gates act
 * via their tensor-product on the 4-vector; CNOT(control q0, target q1) swaps
 * the amplitudes of |10⟩ ↔ |11⟩.
 *
 * Basis index convention: index = 2*q0 + q1 (q0 is the high bit).
 */

type C = { re: number; im: number };
const cAdd = (a: C, b: C): C => ({ re: a.re + b.re, im: a.im + b.im });
const cMul = (a: C, b: C): C => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
const cAbs2 = (a: C) => a.re * a.re + a.im * a.im;
const R = (re: number, im = 0): C => ({ re, im });
const S2 = 1 / Math.SQRT2;

type Vec4 = [C, C, C, C];
type Single = [C, C, C, C]; // 2×2: [[a,b],[c,d]]

const SINGLE: Record<string, Single> = {
  H: [R(S2), R(S2), R(S2), R(-S2)],
  X: [R(0), R(1), R(1), R(0)],
  Z: [R(1), R(0), R(0), R(-1)],
};

// gate placed in the circuit
type GateOp =
  | { kind: "single"; name: "H" | "X" | "Z"; q: 0 | 1 }
  | { kind: "cnot" };

const PALETTE: { label: string; op: GateOp }[] = [
  { label: "H q0", op: { kind: "single", name: "H", q: 0 } },
  { label: "H q1", op: { kind: "single", name: "H", q: 1 } },
  { label: "X q0", op: { kind: "single", name: "X", q: 0 } },
  { label: "X q1", op: { kind: "single", name: "X", q: 1 } },
  { label: "Z q0", op: { kind: "single", name: "Z", q: 0 } },
  { label: "Z q1", op: { kind: "single", name: "Z", q: 1 } },
  { label: "CNOT", op: { kind: "cnot" } },
];

// apply a single-qubit gate on qubit q to the 4-vector
function applySingle(g: Single, q: 0 | 1, v: Vec4): Vec4 {
  const out: Vec4 = [R(0), R(0), R(0), R(0)];
  // pair the basis states that differ only in bit q
  for (let i = 0; i < 4; i++) {
    const q0 = (i >> 1) & 1;
    const q1 = i & 1;
    const bit = q === 0 ? q0 : q1;
    if (bit === 1) continue; // process each pair once from the bit=0 partner
    const j = q === 0 ? i | 0b10 : i | 0b01; // partner with bit=1
    const a0 = v[i];
    const a1 = v[j];
    out[i] = cAdd(out[i], cAdd(cMul(g[0], a0), cMul(g[1], a1)));
    out[j] = cAdd(out[j], cAdd(cMul(g[2], a0), cMul(g[3], a1)));
  }
  return out;
}

// CNOT control q0 → target q1 : swap |10⟩ (idx 2) ↔ |11⟩ (idx 3)
function applyCnot(v: Vec4): Vec4 {
  return [v[0], v[1], v[3], v[2]];
}

function computeState(ops: GateOp[]): Vec4 {
  let v: Vec4 = [R(1), R(0), R(0), R(0)]; // |00⟩
  for (const op of ops) {
    if (op.kind === "cnot") v = applyCnot(v);
    else v = applySingle(SINGLE[op.name], op.q, v);
  }
  return v;
}

const BASIS = ["00", "01", "10", "11"];
const BAR_COLORS = ["63,198,245", "154,107,255", "247,217,138", "111,220,255"];

export default function QuantumCircuit() {
  const { lang } = useLang();
  const t = lab.circuit;
  const [ops, setOps] = useState<GateOp[]>([]);
  const [measured, setMeasured] = useState<number | null>(null);

  const state = useMemo(() => computeState(ops), [ops]);
  const probs = useMemo(() => state.map((c) => cAbs2(c)) as [number, number, number, number], [state]);

  const addGate = (op: GateOp) => {
    setMeasured(null);
    setOps((prev) => (prev.length >= 12 ? prev : [...prev, op]));
  };
  const clear = () => {
    setOps([]);
    setMeasured(null);
  };
  const measureRegister = () => {
    const r = Math.random();
    let acc = 0;
    let idx = 0;
    for (let i = 0; i < 4; i++) {
      acc += probs[i];
      if (r <= acc) {
        idx = i;
        break;
      }
      idx = i;
    }
    setMeasured(idx);
  };

  // ---- circuit diagram geometry ----
  const COLS = Math.max(ops.length, 4);
  const colW = 56;
  const x0 = 64;
  const wireY = [40, 92];
  const width = x0 + COLS * colW + 30;

  return (
    <div className="flex flex-col gap-6">
      {/* gate palette */}
      <div>
        <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ether-500">
          <T v={t.add} />
        </p>
        <div className="flex flex-wrap gap-2">
          {PALETTE.map((p) => (
            <button
              key={p.label}
              onClick={() => addGate(p.op)}
              className="glass rounded-full border-synapse-500/25 px-4 py-2 font-mono text-sm text-synapse-200 transition hover:-translate-y-0.5 hover:border-synapse-300/60 hover:text-synapse-100"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* circuit diagram */}
        <div className="overflow-x-auto rounded-2xl border border-synapse-500/15 bg-void-950 p-4">
          <span className="mb-2 block font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ether-500">
            {pick({ en: "Circuit", zh: "电路" }, lang)}
          </span>
          <svg viewBox={`0 0 ${width} 132`} width={width} height={132} className="max-w-none">
            {/* wires */}
            {wireY.map((y, i) => (
              <g key={i}>
                <text x={10} y={y + 4} fill="#9aa3cf" fontFamily="'Space Mono', monospace" fontSize="13">
                  q{i}
                </text>
                <line x1={x0 - 10} y1={y} x2={width - 16} y2={y} stroke="rgba(154,107,255,0.3)" strokeWidth="1.5" />
              </g>
            ))}

            {/* gates */}
            {ops.map((op, c) => {
              const cx = x0 + c * colW + colW / 2;
              if (op.kind === "cnot") {
                return (
                  <g key={c}>
                    <line x1={cx} y1={wireY[0]} x2={cx} y2={wireY[1]} stroke="#a6ecff" strokeWidth="1.6" />
                    <circle cx={cx} cy={wireY[0]} r="5" fill="#a6ecff" />
                    <circle cx={cx} cy={wireY[1]} r="11" fill="none" stroke="#a6ecff" strokeWidth="1.6" />
                    <line x1={cx - 11} y1={wireY[1]} x2={cx + 11} y2={wireY[1]} stroke="#a6ecff" strokeWidth="1.6" />
                    <line x1={cx} y1={wireY[1] - 11} x2={cx} y2={wireY[1] + 11} stroke="#a6ecff" strokeWidth="1.6" />
                  </g>
                );
              }
              const y = op.q === 0 ? wireY[0] : wireY[1];
              const fill =
                op.name === "H" ? "rgba(63,198,245,0.18)" : op.name === "X" ? "rgba(247,217,138,0.18)" : "rgba(154,107,255,0.18)";
              const stroke = op.name === "H" ? "#3fc6f5" : op.name === "X" ? "#f7d98a" : "#9a6bff";
              return (
                <g key={c}>
                  <rect x={cx - 15} y={y - 15} width="30" height="30" rx="6" fill={fill} stroke={stroke} strokeWidth="1.3" />
                  <text
                    x={cx}
                    y={y + 5}
                    textAnchor="middle"
                    fill={stroke}
                    fontFamily="'Space Mono', monospace"
                    fontSize="15"
                    fontWeight="bold"
                  >
                    {op.name}
                  </text>
                </g>
              );
            })}
          </svg>
          {ops.length === 0 && (
            <p className="mt-2 text-sm text-ether-500">
              {pick(
                { en: "Empty circuit — register sits in |00⟩. Add gates above.", zh: "空电路——寄存器停在 |00⟩。在上方添加门。" },
                lang,
              )}
            </p>
          )}
        </div>

        {/* probability bar chart + measure */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ether-500">
            {pick({ en: "Output probabilities", zh: "输出概率" }, lang)}
          </span>
          <div className="space-y-2.5">
            {BASIS.map((bs, i) => {
              const hit = measured === i;
              return (
                <div key={bs}>
                  <div className="mb-1 flex items-center justify-between font-mono text-xs">
                    <span className={hit ? "text-awaken-300" : "text-ether-400"}>|{bs}⟩</span>
                    <span className="tabular-nums text-ether-100">{(probs[i] * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-void-700">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${probs[i] * 100}%`,
                        background: `linear-gradient(90deg, rgba(${BAR_COLORS[i]},0.4), rgba(${BAR_COLORS[i]},1))`,
                        boxShadow: hit
                          ? `0 0 18px rgba(${BAR_COLORS[i]},0.95)`
                          : `0 0 10px rgba(${BAR_COLORS[i]},0.5)`,
                        outline: hit ? "1px solid rgba(251,233,184,0.9)" : "none",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {measured !== null && (
            <div className="rounded-xl border border-awaken-500/40 bg-awaken-500/5 px-3 py-2 text-center font-mono text-sm text-awaken-300">
              {pick({ en: "Measured →", zh: "测得 →" }, lang)} |{BASIS[measured]}⟩
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={measureRegister}
              className="glass rounded-full border-awaken-500/40 px-5 py-2.5 text-sm text-awaken-300 transition hover:-translate-y-0.5 hover:border-awaken-300/70"
            >
              <T v={t.run} />
            </button>
            <button
              onClick={clear}
              className="glass rounded-full border-ether-500/20 px-5 py-2.5 text-sm text-ether-400 transition hover:-translate-y-0.5 hover:border-ether-400/40 hover:text-ether-200"
            >
              <T v={t.clear} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
