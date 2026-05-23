"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Persistent full-screen WebGL field behind the whole page:
 *  - a galaxy of ~4.5k shader-lit "quantum foam" points that twinkle and drift
 *  - faint pulsing "entanglement" links between distant pairs of points
 *  - a soft central probability glow
 *  - camera eases back as you scroll (hero → cosmos = zoom out into deep space)
 *  - subtle observer parallax: the field leans toward the cursor
 */
export default function QuantumField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const W = () => mount.clientWidth;
    const H = () => mount.clientHeight;

    // WebGL may be unavailable (privacy modes, old devices, headless crawlers).
    // Fail gracefully to the CSS `void-bg` gradient instead of crashing the tree.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(W(), H());
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03040a, 0.00055);
    const camera = new THREE.PerspectiveCamera(62, W() / H(), 0.1, 4000);
    camera.position.set(0, 0, 360);

    const root = new THREE.Group();
    scene.add(root);

    // ---------------------------------------------------------------- quantum foam points
    const COUNT = reduce ? 1500 : 4500;
    const positions = new Float32Array(COUNT * 3);
    const pcolors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    const palette = [
      new THREE.Color("#3fc6f5"),
      new THREE.Color("#6fdcff"),
      new THREE.Color("#9a6bff"),
      new THREE.Color("#b48dff"),
      new THREE.Color("#a6ecff"),
      new THREE.Color("#f2c45a"),
      new THREE.Color("#ffffff"),
    ];
    for (let i = 0; i < COUNT; i++) {
      const r = Math.pow(Math.random(), 0.55) * 1080 + 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.62;
      positions[i * 3 + 2] = r * Math.cos(phi);
      const col = palette[Math.floor(Math.random() * palette.length)];
      pcolors[i * 3] = col.r; pcolors[i * 3 + 1] = col.g; pcolors[i * 3 + 2] = col.b;
      sizes[i] = Math.random() * 2.6 + 0.5;
      phases[i] = Math.random() * Math.PI * 2;
    }
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pgeo.setAttribute("aColor", new THREE.BufferAttribute(pcolors, 3));
    pgeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    pgeo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const pmat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uBright: { value: 1 } },
      vertexShader: `
        attribute vec3 aColor; attribute float aSize; attribute float aPhase;
        uniform float uTime; uniform float uPR;
        varying vec3 vColor; varying float vTw;
        void main(){
          vColor = aColor;
          float tw = 0.55 + 0.45 * sin(uTime * 1.5 + aPhase);
          vTw = tw;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPR * (320.0 / max(-mv.z, 1.0)) * (0.6 + 0.6 * tw);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec3 vColor; varying float vTw;
        uniform float uBright;
        void main(){
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float a = smoothstep(0.5, 0.0, d);
          a = pow(a, 1.7);
          gl_FragColor = vec4(vColor * (0.65 + 0.7 * vTw) * uBright, a);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pgeo, pmat);
    root.add(points);

    // ---------------------------------------------------------------- entanglement links
    const PAIRS = reduce ? 18 : 46;
    const anchors: THREE.Vector3[] = [];
    for (let i = 0; i < PAIRS * 2; i++) {
      const r = 90 + Math.random() * 320;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      anchors.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.7,
        r * Math.cos(phi),
      ));
    }
    const linePts: number[] = [];
    for (let i = 0; i < PAIRS; i++) {
      const a = anchors[i * 2], b = anchors[i * 2 + 1];
      linePts.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const lgeo = new THREE.BufferGeometry();
    lgeo.setAttribute("position", new THREE.Float32BufferAttribute(linePts, 3));
    const lmat = new THREE.LineBasicMaterial({
      color: 0x6fdcff, transparent: true, opacity: 0.12,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const links = new THREE.LineSegments(lgeo, lmat);
    root.add(links);

    // glowing anchor nodes
    const ngeo = new THREE.BufferGeometry();
    const npos = new Float32Array(anchors.length * 3);
    anchors.forEach((p, i) => { npos[i * 3] = p.x; npos[i * 3 + 1] = p.y; npos[i * 3 + 2] = p.z; });
    ngeo.setAttribute("position", new THREE.BufferAttribute(npos, 3));
    const nmat = new THREE.PointsMaterial({
      color: 0xa6ecff, size: 5.5, transparent: true, opacity: 0.75,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    const nodes = new THREE.Points(ngeo, nmat);
    root.add(nodes);

    // ---------------------------------------------------------------- central probability glow
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 256;
    const gctx = glowCanvas.getContext("2d")!;
    const grad = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(166,236,255,0.85)");
    grad.addColorStop(0.25, "rgba(63,198,245,0.4)");
    grad.addColorStop(0.55, "rgba(154,107,255,0.16)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 256, 256);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.SpriteMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(360, 360, 1);
    root.add(glow);

    // ---------------------------------------------------------------- interaction
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    let scrollP = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollP = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    };
    window.addEventListener("resize", onResize);

    // ---------------------------------------------------------------- loop
    const clock = new THREE.Clock();
    let raf = 0;
    let camZ = 360;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      pmat.uniforms.uTime.value = t;

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      root.rotation.y = t * 0.016 + pointer.x * 0.35;
      root.rotation.x = pointer.y * 0.2;
      links.rotation.y = -t * 0.026;
      nodes.rotation.y = -t * 0.026;
      lmat.opacity = 0.07 + 0.09 * (0.5 + 0.5 * Math.sin(t * 0.9));

      const targetZ = 330 + scrollP * 540;
      camZ += (targetZ - camZ) * 0.05;
      camera.position.z = camZ;
      pmat.uniforms.uBright.value = 0.82 + scrollP * 0.3;
      glow.scale.setScalar(300 + Math.sin(t * 0.6) * 16 + scrollP * 60);

      renderer.render(scene, camera);
    };
    animate();

    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else animate(); };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      pgeo.dispose(); pmat.dispose();
      lgeo.dispose(); lmat.dispose();
      ngeo.dispose(); nmat.dispose();
      glowTex.dispose(); glowMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10 h-full w-full" aria-hidden="true" />;
}
