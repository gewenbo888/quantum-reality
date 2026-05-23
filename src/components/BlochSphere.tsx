"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { T, useLang, pick } from "@/components/lang";
import { lab } from "@/data/content";

/**
 * A single qubit on the Bloch sphere.  |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩.
 *
 * We keep complex amplitudes α, β as {re,im}. Gates are exact 2×2 unitaries
 * applied to (α,β). Measurement collapses to |0⟩/|1⟩ by the Born rule. The
 * camera is rotated by manual pointer drag (dependency-free, only `three`).
 */

type C = { re: number; im: number };
const cAdd = (a: C, b: C): C => ({ re: a.re + b.re, im: a.im + b.im });
const cMul = (a: C, b: C): C => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
const cAbs2 = (a: C) => a.re * a.re + a.im * a.im;

// gate as a 2×2 matrix of complex entries [[a,b],[c,d]]
type Gate = [C, C, C, C];
const R = (re: number, im = 0): C => ({ re, im });
const S2 = 1 / Math.SQRT2;

const GATES: Record<string, Gate> = {
  X: [R(0), R(1), R(1), R(0)],
  Y: [R(0), R(0, -1), R(0, 1), R(0)],
  Z: [R(1), R(0), R(0), R(-1)],
  H: [R(S2), R(S2), R(S2), R(-S2)],
  S: [R(1), R(0), R(0), R(0, 1)], // diag(1, i)
  T: [R(1), R(0), R(0), R(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4))], // diag(1, e^{iπ/4})
};

function applyGate(g: Gate, a: C, b: C): [C, C] {
  const na = cAdd(cMul(g[0], a), cMul(g[1], b));
  const nb = cAdd(cMul(g[2], a), cMul(g[3], b));
  return [na, nb];
}

// (α,β) → Bloch vector (x,y,z), with |0⟩ at +z (top), |1⟩ at −z (bottom)
function blochVector(a: C, b: C): [number, number, number] {
  // x = 2 Re(ā β), y = 2 Im(ā β), z = |α|² − |β|²
  const conjA: C = { re: a.re, im: -a.im };
  const ab = cMul(conjA, b);
  const x = 2 * ab.re;
  const y = 2 * ab.im;
  const z = cAbs2(a) - cAbs2(b);
  return [x, y, z];
}

export default function BlochSphere() {
  const { lang } = useLang();
  const t = lab.bloch;
  const mountRef = useRef<HTMLDivElement>(null);

  // amplitudes (start in |0⟩)
  const [alpha, setAlpha] = useState<C>({ re: 1, im: 0 });
  const [beta, setBeta] = useState<C>({ re: 0, im: 0 });
  const [collapsed, setCollapsed] = useState<null | 0 | 1>(null);
  const [noGL, setNoGL] = useState(false);

  // refs the render loop reads
  const stateRef = useRef<{ a: C; b: C }>({ a: alpha, b: beta });
  stateRef.current = { a: alpha, b: beta };
  const flashRef = useRef(0);

  const applyNamed = (name: string) => {
    setCollapsed(null);
    const [na, nb] = applyGate(GATES[name], stateRef.current.a, stateRef.current.b);
    setAlpha(na);
    setBeta(nb);
  };

  const measure = () => {
    const p0 = cAbs2(stateRef.current.a);
    const r = Math.random();
    const out: 0 | 1 = r < p0 ? 0 : 1;
    setCollapsed(out);
    flashRef.current = 1;
    if (out === 0) {
      setAlpha({ re: 1, im: 0 });
      setBeta({ re: 0, im: 0 });
    } else {
      setAlpha({ re: 0, im: 0 });
      setBeta({ re: 1, im: 0 });
    }
  };

  const reset = () => {
    setCollapsed(null);
    setAlpha({ re: 1, im: 0 });
    setBeta({ re: 0, im: 0 });
  };

  // ---------------- three.js scene ----------------
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const W = () => mount.clientWidth || 1;
    const H = () => mount.clientHeight || 1;

    // WebGL may be unavailable; degrade gracefully so the rest of the lab keeps working.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setNoGL(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W(), H());
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W() / H(), 0.1, 100);
    const camR = 4.4;
    camera.position.set(0, 1.6, camR);
    camera.lookAt(0, 0, 0);

    const root = new THREE.Group();
    scene.add(root);

    // translucent sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x6fdcff, transparent: true, opacity: 0.05 }),
    );
    root.add(sphere);

    // wireframe equator + meridians (circles built from points)
    const ringMat = new THREE.LineBasicMaterial({ color: 0x9a6bff, transparent: true, opacity: 0.28 });
    const circlePts = (radius: number, axis: "x" | "y" | "z") => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        const c = Math.cos(a) * radius;
        const s = Math.sin(a) * radius;
        if (axis === "z") pts.push(new THREE.Vector3(c, s, 0));
        else if (axis === "y") pts.push(new THREE.Vector3(c, 0, s));
        else pts.push(new THREE.Vector3(0, c, s));
      }
      return new THREE.BufferGeometry().setFromPoints(pts);
    };
    const eq = new THREE.Line(circlePts(1.5, "y"), ringMat);
    const mer1 = new THREE.Line(circlePts(1.5, "z"), ringMat);
    const mer2 = new THREE.Line(circlePts(1.5, "x"), ringMat);
    root.add(eq, mer1, mer2);

    // axes (X, Y, Z) — thin lines
    const axisMat = new THREE.LineBasicMaterial({ color: 0x474d72, transparent: true, opacity: 0.5 });
    const axisGeo = (a: THREE.Vector3, b: THREE.Vector3) => new THREE.BufferGeometry().setFromPoints([a, b]);
    root.add(new THREE.Line(axisGeo(new THREE.Vector3(0, 1.7, 0), new THREE.Vector3(0, -1.7, 0)), axisMat));
    root.add(new THREE.Line(axisGeo(new THREE.Vector3(1.7, 0, 0), new THREE.Vector3(-1.7, 0, 0)), axisMat));
    root.add(new THREE.Line(axisGeo(new THREE.Vector3(0, 0, 1.7), new THREE.Vector3(0, 0, -1.7)), axisMat));

    // pole + axis text labels (sprites built from canvas)
    const makeLabel = (text: string, color: string) => {
      const cv = document.createElement("canvas");
      cv.width = 128;
      cv.height = 64;
      const cx = cv.getContext("2d")!;
      cx.fillStyle = color;
      cx.font = "bold 40px 'Space Mono', monospace";
      cx.textAlign = "center";
      cx.textBaseline = "middle";
      cx.fillText(text, 64, 32);
      const tex = new THREE.CanvasTexture(cv);
      tex.minFilter = THREE.LinearFilter;
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
      spr.scale.set(0.7, 0.35, 1);
      return { spr, tex };
    };
    const labels = [
      { ...makeLabel("|0⟩", "#a6ecff"), pos: new THREE.Vector3(0, 1.95, 0) },
      { ...makeLabel("|1⟩", "#cdb2ff"), pos: new THREE.Vector3(0, -1.95, 0) },
      { ...makeLabel("x", "#6a719c"), pos: new THREE.Vector3(1.95, 0, 0) },
      { ...makeLabel("y", "#6a719c"), pos: new THREE.Vector3(0, 0, 1.95) },
    ];
    labels.forEach((l) => {
      l.spr.position.copy(l.pos);
      root.add(l.spr);
    });

    // state-vector arrow (shaft + head)
    const vecGroup = new THREE.Group();
    const shaftMat = new THREE.MeshBasicMaterial({ color: 0xf2c45a });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1, 12), shaftMat);
    shaft.position.y = 0.5;
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.2, 16), shaftMat);
    head.position.y = 1.0;
    vecGroup.add(shaft, head);
    // glow tip
    const tipGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({ color: 0xfbe9b8, transparent: true, opacity: 0.8, depthTest: false }),
    );
    tipGlow.scale.set(0.4, 0.4, 1);
    vecGroup.add(tipGlow);
    root.add(vecGroup);

    // point at the sphere surface
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xfbe9b8 });
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), dotMat);
    root.add(dot);

    // ---- pointer drag to rotate the group ----
    const rot = { x: 0.35, y: -0.5, vx: 0, vy: 0 };
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      rot.y += dx * 0.01;
      rot.x += dy * 0.01;
      rot.x = Math.max(-1.3, Math.min(1.3, rot.x));
      rot.vy = dx * 0.01;
      rot.vx = dy * 0.01;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    const onResize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // smooth-following bloch vector
    const cur = new THREE.Vector3(0, 1, 0);
    const up = new THREE.Vector3(0, 1, 0);
    const q = new THREE.Quaternion();

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (document.hidden) return;

      // idle auto-spin when not dragging (unless reduced motion)
      if (!dragging && !reduce) {
        rot.y += 0.0016;
      }
      root.rotation.x = rot.x;
      root.rotation.y = rot.y;

      // target bloch vector from current amplitudes
      const [bx, by, bz] = blochVector(stateRef.current.a, stateRef.current.b);
      // map physics (z up) → three (y up): (x, z, y)
      const target = new THREE.Vector3(bx, bz, by);
      if (target.lengthSq() < 1e-6) target.set(0, 1, 0);
      target.normalize();
      cur.lerp(target, 0.18);
      const len = Math.max(cur.length(), 1e-4);
      const dir = cur.clone().multiplyScalar(1 / len);

      // orient arrow (default points +y) toward dir
      q.setFromUnitVectors(up, dir);
      vecGroup.quaternion.copy(q);
      vecGroup.scale.set(1, 1.5, 1); // shaft built unit-length; scale to sphere radius
      const surf = dir.clone().multiplyScalar(1.5);
      dot.position.copy(surf);

      // measurement flash
      if (flashRef.current > 0) {
        flashRef.current = Math.max(0, flashRef.current - 0.04);
        const f = flashRef.current;
        shaftMat.color.setRGB(0.95 + f * 0.05, 0.77 + f * 0.2, 0.35 + f * 0.6);
        tipGlow.scale.setScalar(0.4 + f * 1.4);
        (tipGlow.material as THREE.SpriteMaterial).opacity = 0.8;
      } else {
        shaftMat.color.set(0xf2c45a);
        tipGlow.scale.setScalar(0.4);
        (tipGlow.material as THREE.SpriteMaterial).opacity = 0.7;
      }

      renderer.render(scene, camera);
    };
    animate();

    const onVis = () => {
      if (!document.hidden) {
        cancelAnimationFrame(raf);
        animate();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      sphere.geometry.dispose();
      (sphere.material as THREE.Material).dispose();
      ringMat.dispose();
      axisMat.dispose();
      eq.geometry.dispose();
      mer1.geometry.dispose();
      mer2.geometry.dispose();
      shaft.geometry.dispose();
      head.geometry.dispose();
      shaftMat.dispose();
      dot.geometry.dispose();
      dotMat.dispose();
      (tipGlow.material as THREE.SpriteMaterial).dispose();
      labels.forEach((l) => {
        l.tex.dispose();
        (l.spr.material as THREE.SpriteMaterial).dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  // readout values
  const p0 = cAbs2(alpha);
  const p1 = cAbs2(beta);
  const fmt = (c: C) => `${c.re >= 0 ? " " : "-"}${Math.abs(c.re).toFixed(2)}${c.im >= 0 ? "+" : "-"}${Math.abs(c.im).toFixed(2)}i`;
  const theta = 2 * Math.acos(Math.min(1, Math.sqrt(p0)));
  const phi = Math.atan2(beta.im, beta.re) - Math.atan2(alpha.im, alpha.re);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* sphere */}
      <div className="relative overflow-hidden rounded-2xl border border-synapse-500/15 bg-void-950">
        <div ref={mountRef} className="h-[340px] w-full sm:h-[400px]" />
        {noGL && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center p-6 text-center">
            <p className="font-mono text-xs leading-relaxed text-ether-400">
              {pick({ en: "WebGL unavailable — the qubit math below is still live.", zh: "WebGL 不可用——下方的量子比特运算依然实时有效。" }, lang)}
            </p>
          </div>
        )}
        {!noGL && (
          <span className="pointer-events-none absolute left-3 top-3 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ether-500">
            {pick({ en: "Drag to rotate", zh: "拖动以旋转" }, lang)}
          </span>
        )}
        {collapsed !== null && (
          <span className="pointer-events-none absolute right-3 top-3 font-mono text-xs text-awaken-400">
            {pick({ en: "collapsed →", zh: "坍缩为 →" }, lang)} |{collapsed}⟩
          </span>
        )}
      </div>

      {/* controls + readout */}
      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ether-500">
            <T v={t.gates} />
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(["X", "Y", "Z", "H", "S", "T"] as const).map((g) => (
              <button
                key={g}
                onClick={() => applyNamed(g)}
                className="glass rounded-xl border-synapse-500/25 py-2.5 font-mono text-base text-synapse-200 transition hover:-translate-y-0.5 hover:border-synapse-300/60 hover:text-synapse-100"
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* probability bars */}
        <div className="space-y-2.5">
          {[
            { label: t.p0, p: p0, color: "63,198,245" },
            { label: t.p1, p: p1, color: "154,107,255" },
          ].map((row, i) => (
            <div key={i}>
              <div className="mb-1 flex items-center justify-between font-mono text-xs">
                <span className="text-ether-400">
                  <T v={row.label} />
                </span>
                <span className="tabular-nums text-ether-100">{(row.p * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-void-700">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${row.p * 100}%`,
                    background: `linear-gradient(90deg, rgba(${row.color},0.4), rgba(${row.color},1))`,
                    boxShadow: `0 0 12px rgba(${row.color},0.6)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* amplitudes / angles */}
        <div className="rounded-xl border border-ether-600/20 bg-void-900/40 p-3 font-mono text-[0.7rem] leading-relaxed text-ether-300">
          <div>α = {fmt(alpha)}</div>
          <div>β = {fmt(beta)}</div>
          <div className="mt-1 text-ether-500">
            θ = {((theta * 180) / Math.PI).toFixed(1)}° · φ = {(((((phi * 180) / Math.PI) % 360) + 360) % 360).toFixed(1)}°
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={measure}
            className="glass rounded-full border-awaken-500/40 px-5 py-2.5 text-sm text-awaken-300 transition hover:-translate-y-0.5 hover:border-awaken-300/70"
          >
            <T v={t.measure} />
          </button>
          <button
            onClick={reset}
            className="glass rounded-full border-ether-500/20 px-5 py-2.5 text-sm text-ether-400 transition hover:-translate-y-0.5 hover:border-ether-400/40 hover:text-ether-200"
          >
            <T v={t.reset} />
          </button>
        </div>
      </div>
    </div>
  );
}
