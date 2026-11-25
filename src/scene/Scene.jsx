import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SECTION_IDS, SECTION_NAMES, MANIFESTO, STACK } from "../data/content";
import { clamp, smooth } from "../lib/motion";

/* ---------- Escena 3D: el núcleo viaja con el scroll ---------- */
// x es un multiplicador del lado derecho/izquierdo; s escala; o opacidad base de las líneas; sp velocidad de giro
export const KF_WIDE = [
  { x: 0, y: 0, s: 1.15, o: 0.36, sp: 1 },     // inicio
  { x: 0, y: 0, s: 1.7, o: 0.55, sp: 2.2 },    // manifiesto
  { x: 1, y: -0.2, s: 0.78, o: 0.32, sp: 1 },  // stack
  { x: -1, y: 0.2, s: 0.72, o: 0.32, sp: 1 },  // proyectos
  { x: 1, y: 0, s: 0.7, o: 0.3, sp: 1 },       // trayectoria
  { x: 0, y: 0, s: 1.2, o: 0.42, sp: 1.5 },    // contacto
];
export const KF_TALL = [
  { x: 0, y: 0.6, s: 0.95, o: 0.34, sp: 1 },
  { x: 0, y: 0, s: 1.4, o: 0.5, sp: 2.2 },
  { x: 0, y: 2.4, s: 0.6, o: 0.14, sp: 1 },
  { x: 0, y: -2.4, s: 0.6, o: 0.14, sp: 1 },
  { x: 0, y: 2.4, s: 0.6, o: 0.14, sp: 1 },
  { x: 0, y: 0, s: 0.9, o: 0.22, sp: 1.5 },
];

// Punto redondo y suave (nodos, partículas y satélites)
export function makeDotTexture(stops) {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  stops.forEach(([o, a]) => gr.addColorStop(o, "rgba(255,255,255," + a + ")"));
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
// Etiqueta con el nombre de una tecnología (píldora con borde de color)
export function makeLabelTexture(text, color) {
  const c = document.createElement("canvas"); c.width = 256; c.height = 64;
  const g = c.getContext("2d");
  const r = 28, x = 4, y = 4, w = 248, h = 56;
  g.beginPath();
  g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  g.fillStyle = "rgba(8,8,16,0.78)"; g.fill();
  g.lineWidth = 2.5; g.strokeStyle = color; g.stroke();
  g.fillStyle = "#ffffff"; g.font = "600 28px system-ui, 'Segoe UI', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(text, 128, 34);
  return new THREE.CanvasTexture(c);
}
// Vértices únicos: evita sumar el mismo nodo varias veces con mezcla aditiva
export function uniqueVertices(geo) {
  const pos = geo.attributes.position, seen = new Set(), out = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const k = Math.round(x * 1000) + "," + Math.round(y * 1000) + "," + Math.round(z * 1000);
    if (!seen.has(k)) { seen.add(k); out.push(x, y, z); }
  }
  return new Float32Array(out);
}
// Líneas suaves: la opacidad sube hacia el contorno y baja de cara a la cámara
export function softWire(color, power) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0.5 }, uTime: { value: 0 }, uPow: { value: power } },
    vertexShader: [
      "uniform float uPow; varying float vRim; varying float vH;",
      "void main() {",
      "  vec4 mv = modelViewMatrix * vec4(position, 1.0);",
      "  vec3 n = normalize(normalMatrix * normal);",
      "  vec3 v = normalize(-mv.xyz);",
      "  vRim = pow(1.0 - abs(dot(n, v)), uPow);",
      "  vH = position.y;",
      "  gl_Position = projectionMatrix * mv;",
      "}"
    ].join("\n"),
    fragmentShader: [
      "uniform vec3 uColor; uniform float uOpacity; uniform float uTime; varying float vRim; varying float vH;",
      "void main() {",
      "  float shimmer = 0.88 + 0.12 * sin(uTime * 1.4 + vH * 2.2);",
      "  float a = uOpacity * (0.14 + 0.86 * vRim) * shimmer;",
      "  gl_FragColor = vec4(uColor, a);",
      "}"
    ].join("\n"),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, wireframe: true,
  });
}
export function ringLine(radius, color) {
  const pts = [];
  for (let i = 0; i <= 256; i++) { const a = (i / 256) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)); }
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
}

export function Scene({ fxRef }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // El coste de la escena crece con los píxeles que pinta (brillos y partículas aditivas): se limita el total,
    // no solo la densidad, para que un monitor grande o una pantalla retina no la dejen pegada.
    const dpr0 = window.devicePixelRatio || 1;
    const BUDGET = coarse ? 1.1e6 : 1.8e6;
    const ratioFor = (w, h, q) => Math.max(0.5, Math.min(dpr0, coarse ? 1.5 : 1.75, Math.sqrt(BUDGET / (w * h))) * q);
    try {
      const aa = dpr0 < 1.5 && window.innerWidth * window.innerHeight * dpr0 * dpr0 <= BUDGET;
      renderer = new THREE.WebGLRenderer({ canvas, antialias: aa, alpha: true, powerPreference: "high-performance" });
    } catch { document.documentElement.setAttribute("data-webgl", "off"); return; }
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.03);
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 9;
    const group = new THREE.Group();
    scene.add(group);

    const dotTex = makeDotTexture([[0, 1], [0.35, 0.55], [1, 0]]);
    const glowTex = makeDotTexture([[0, 1], [0.25, 0.5], [1, 0]]);

    // Esferas de líneas suaves + nodos redondos
    const outerGeo = new THREE.IcosahedronGeometry(3, 2);
    const outerMat = softWire(0x7000ff, 1.6);
    const outer = new THREE.Mesh(outerGeo, outerMat);
    const innerGeo = new THREE.IcosahedronGeometry(1.85, 1);
    const innerMat = softWire(0x00f0ff, 1.3);
    const inner = new THREE.Mesh(innerGeo, innerMat);
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(uniqueVertices(outerGeo), 3));
    const nodeMat = new THREE.PointsMaterial({ color: 0xb86bff, size: 0.22, map: dotTex, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    const innerNodeGeo = new THREE.BufferGeometry();
    innerNodeGeo.setAttribute("position", new THREE.BufferAttribute(uniqueVertices(innerGeo), 3));
    const innerNodeMat = new THREE.PointsMaterial({ color: 0x00f0ff, size: 0.16, map: dotTex, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending });
    const innerNodes = new THREE.Points(innerNodeGeo, innerNodeMat);

    // Anillos finos con un satélite luminoso cada uno
    const ring1 = ringLine(3.85, 0x7000ff); ring1.rotation.set(0.3, 0, 0.25);
    const ring2 = ringLine(4.3, 0x00f0ff); ring2.rotation.set(1.2, 0.5, 0);
    const sat1 = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex, color: 0x00f0ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    const sat2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex, color: 0xb86bff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    sat1.scale.setScalar(0.4); sat2.scale.setScalar(0.36);
    ring1.add(sat1); ring2.add(sat2);

    // Centro: esfera lisa indigo-700 con borde más claro, resplandor y halo
    const coreGeo = new THREE.IcosahedronGeometry(0.62, 5);
    const coreMat = new THREE.ShaderMaterial({
      uniforms: { uBase: { value: new THREE.Color(0x4338ca) }, uRim: { value: new THREE.Color(0x818cf8) } },
      vertexShader: [
        "varying vec3 vN; varying vec3 vV;",
        "void main() {",
        "  vec4 mv = modelViewMatrix * vec4(position, 1.0);",
        "  vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);",
        "  gl_Position = projectionMatrix * mv;",
        "}"
      ].join("\n"),
      fragmentShader: [
        "uniform vec3 uBase; uniform vec3 uRim; varying vec3 vN; varying vec3 vV;",
        "void main() {",
        "  float d = max(dot(normalize(vN), normalize(vV)), 0.0);",
        "  float rim = pow(1.0 - d, 2.2);",
        "  vec3 c = mix(uBase * 0.85, uRim, rim) + vec3(0.12, 0.1, 0.3) * pow(d, 6.0);",
        "  gl_FragColor = vec4(c, 1.0);",
        "}"
      ].join("\n"),
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x4338ca, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9, fog: false }));
    glow.scale.set(5.2, 5.2, 1);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x6a3cff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.22, fog: false }));
    halo.scale.set(11, 11, 1);
    group.add(outer, inner, nodes, innerNodes, ring1, ring2, core, glow, halo);

    // Etiquetas de tecnologías que orbitan el núcleo cuando se llega al stack
    const labelTex = [];
    const labelRings = [new THREE.Group(), new THREE.Group()];
    labelRings[0].rotation.set(0.5, 0, 0.2); labelRings[1].rotation.set(-0.7, 0, -0.3);
    group.add(labelRings[0], labelRings[1]);
    const labels = STACK.map((s, i) => {
      const tex = makeLabelTexture(s.name, i % 2 ? "#a77bff" : "#00f0ff");
      labelTex.push(tex);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, fog: false, opacity: 0 });
      const spr = new THREE.Sprite(mat);
      spr.scale.set(2.7, 0.68, 1);
      labelRings[i % 2].add(spr);
      return { spr, mat, a: (Math.floor(i / 2) / Math.ceil(STACK.length / 2)) * Math.PI * 2 + (i % 2) * 0.4, r: i % 2 ? 5.1 : 4.5, w: i % 2 ? -0.35 : 0.3 };
    });

    // Partículas de fondo (redondas) y una capa de bokeh desenfocado más cercana
    const count = window.innerWidth < 640 ? 360 : 900;
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
    const cA = new THREE.Color(0x00f0ff), cB = new THREE.Color(0x7000ff), tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 13, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      pos[i * 3 + 2] = r * Math.cos(ph);
      tmp.copy(cA).lerp(cB, Math.random());
      col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
    }
    const fieldGeo = new THREE.BufferGeometry();
    fieldGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    fieldGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const fieldMat = new THREE.PointsMaterial({ size: 0.13, map: dotTex, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending });
    const field = new THREE.Points(fieldGeo, fieldMat);
    scene.add(field);

    const bCount = window.innerWidth < 640 ? 16 : 36;
    const bPos = new Float32Array(bCount * 3);
    for (let i = 0; i < bCount; i++) {
      const r = 6 + Math.random() * 9, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      bPos[i * 3] = r * Math.sin(ph) * Math.cos(th); bPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7; bPos[i * 3 + 2] = r * Math.cos(ph) * 0.6 + 2;
    }
    const bokehGeo = new THREE.BufferGeometry();
    bokehGeo.setAttribute("position", new THREE.BufferAttribute(bPos, 3));
    const bokehMat = new THREE.PointsMaterial({ size: 0.75, map: dotTex, color: 0x6a3cff, transparent: true, opacity: 0.16, depthWrite: false, blending: THREE.AdditiveBlending });
    const bokeh = new THREE.Points(bokehGeo, bokehMat);
    scene.add(bokeh);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const cur = { x: 0, y: 0, s: 1.15, o: 0.36, sp: 1 };
    const S = { x: 0, y: 0, s: 1, o: 0, sp: 1 };
    const tw = [0, 0, 0, 0, 0, 0];
    let tops = [], mh = 0, vh = window.innerHeight, wide = true, side = 5.6, fit = 1;
    let lastW = 0, lastH = 0;
    let scrollY = window.scrollY, lastY = scrollY, vel = 0, pulse = 0, lastWi = -1, hudN = 0;
    let introStart = -1, tt = 0, slow = 0, frames = 0, qTier = 0, raf = 0, lost = false;
    // Niveles de calidad: factor de resolución y fracción de partículas que se dibujan
    const QUAL = [1, 0.75, 0.55], FIELD = [1, 0.6, 0.35];

    const measure = () => {
      const sy = window.scrollY;
      tops = SECTION_IDS.map((id) => { const el = document.getElementById(id); return el ? el.getBoundingClientRect().top + sy : 0; });
      const m = document.getElementById("manifiesto");
      mh = m ? m.offsetHeight : 0;
    };
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      // En móvil la barra del navegador cambia el alto al hacer scroll: si solo varía un poco, se ignora
      if (w === lastW && Math.abs(h - lastH) < 180) return;
      lastW = w; lastH = h;
      renderer.setPixelRatio(ratioFor(w, h, QUAL[qTier]));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      vh = h;
      wide = w / h > 1.25;
      const halfW = 9 * Math.tan(Math.PI / 6) * (w / h);
      side = Math.min(5.6, halfW * 0.6);
      fit = Math.min(1, halfW / 3.4);
      measure();
    };
    const onMove = (e) => {
      if (fxRef.current !== "full") return;
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => { scrollY = window.scrollY; };
    const onDown = () => { if (fxRef.current === "full") pulse = Math.max(pulse, 1); };
    const onBurst = () => { pulse = 1.6; };
    const clock = new THREE.Clock();
    const onReady = () => { if (introStart < 0) introStart = clock.elapsedTime; };
    const onLost = (e) => { e.preventDefault(); cancelAnimationFrame(raf); lost = true; };
    const onRestored = () => { if (lost) { lost = false; clock.getDelta(); tick(); } };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("portfolio:burst", onBurst);
    window.addEventListener("portfolio:ready", onReady);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    let ro;
    if (window.ResizeObserver) { ro = new ResizeObserver(measure); ro.observe(document.body); }
    const t1 = setTimeout(measure, 800), t2 = setTimeout(measure, 2500), t3 = setTimeout(onReady, 5000);

    const hud = document.getElementById("hud");
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const mode = fxRef.current;
      const full = mode === "full";
      const rdtRaw = clock.getDelta();
      const rdt = Math.min(rdtRaw, 0.05);
      const dt = rdt * (full ? 1 : mode === "calm" ? 0.3 : 0);
      tt += dt;
      const real = clock.elapsedTime;
      const y = scrollY;
      const ik = introStart < 0 ? 0 : 1 - Math.pow(1 - clamp((real - introStart) / 2.0, 0, 1), 4);

      // Calidad adaptativa: si el equipo va justo, baja la resolución y reduce partículas, hasta dos niveles.
      // Se ignoran los fotogramas muy largos (pestaña en segundo plano) y los primeros, que compilan shaders.
      if (qTier < 2 && rdtRaw < 0.5 && ++frames > 40) {
        if (rdtRaw > 0.03) slow++; else slow = Math.max(0, slow - 2);
        if (slow > 24) {
          qTier++; slow = 0; frames = 0;
          renderer.setPixelRatio(ratioFor(lastW, lastH, QUAL[qTier]));
          renderer.setSize(lastW, lastH, false);
          fieldGeo.setDrawRange(0, Math.floor(count * FIELD[qTier]));
          if (qTier === 2) bokeh.visible = false;
        }
      }

      // Estado objetivo según el scroll: se mantiene en cada sección y viaja al entrar la siguiente
      const kf = wide ? KF_WIDE : KF_TALL;
      S.x = kf[0].x; S.y = kf[0].y; S.s = kf[0].s; S.o = kf[0].o; S.sp = kf[0].sp;
      let secIdx = 0, wi = -1;
      if (tops.length === SECTION_IDS.length) {
        for (let j = 1; j < kf.length; j++) {
          const a = tops[j] - vh, b = tops[j] - vh * 0.2;
          const k = smooth(clamp((y - a) / Math.max(1, b - a), 0, 1));
          tw[j] = k;
          S.x += (kf[j].x - S.x) * k; S.y += (kf[j].y - S.y) * k; S.s += (kf[j].s - S.s) * k;
          S.o += (kf[j].o - S.o) * k; S.sp += (kf[j].sp - S.sp) * k;
          if (y + vh * 0.5 >= tops[j]) secIdx = j;
        }
        if (full && mh > vh && y >= tops[1] && y <= tops[1] + mh - vh) {
          wi = Math.min(MANIFESTO.length - 1, Math.floor(((y - tops[1]) / (mh - vh)) * MANIFESTO.length));
        }
      }
      if (wi !== lastWi && wi >= 0) pulse = Math.max(pulse, 0.8);
      lastWi = wi;

      const k = 1 - Math.exp(-rdt * 4);
      cur.x += (S.x * side - cur.x) * k; cur.y += (S.y - cur.y) * k; cur.s += (S.s - cur.s) * k;
      cur.o += (S.o - cur.o) * k; cur.sp += (S.sp - cur.sp) * k;

      mouse.x += ((full ? mouse.tx : 0) - mouse.x) * 0.05;
      mouse.y += ((full ? mouse.ty : 0) - mouse.y) * 0.05;
      vel += ((full ? Math.abs(y - lastY) : 0) - vel) * Math.min(1, rdt * 8);
      lastY = y;
      pulse *= Math.exp(-rdt * 2.6);

      // Movimiento
      group.rotation.y += dt * (0.12 * cur.sp + vel * 0.014);
      group.rotation.x += dt * 0.04;
      inner.rotation.y -= dt * 0.3; innerNodes.rotation.y = inner.rotation.y;
      ring1.rotation.z = 0.25 + Math.sin(tt * 0.3) * 0.08; ring2.rotation.x = 1.2 + Math.cos(tt * 0.25) * 0.08;
      sat1.position.set(Math.cos(tt * 0.7) * 3.85, 0, Math.sin(tt * 0.7) * 3.85);
      sat2.position.set(Math.cos(-tt * 0.5 + 2) * 4.3, 0, Math.sin(-tt * 0.5 + 2) * 4.3);
      group.position.set(cur.x + mouse.x * 0.35, cur.y - mouse.y * 0.25, 0);
      group.scale.setScalar(cur.s * fit * (1 + pulse * 0.12) * (0.35 + 0.65 * ik));
      const fovT = 60 + Math.min(vel * 0.25, 16);
      if (Math.abs(camera.fov - fovT) > 0.02) { camera.fov += (fovT - camera.fov) * 0.15; camera.updateProjectionMatrix(); }
      camera.position.x = mouse.x * 0.9;
      camera.position.y = -mouse.y * 0.6;
      camera.lookAt(0, 0, 0);

      // Opacidad y brillo por sección
      const o = cur.o * ik;
      outerMat.uniforms.uOpacity.value = Math.min(1, o * 2.3); outerMat.uniforms.uTime.value = tt;
      innerMat.uniforms.uOpacity.value = Math.min(1, o * 2.6); innerMat.uniforms.uTime.value = tt + 1.7;
      ring1.material.opacity = Math.min(0.8, o * 1.5); ring2.material.opacity = Math.min(0.8, o * 1.5);
      nodeMat.opacity = Math.min(1, (0.35 + cur.o) * ik); innerNodeMat.opacity = Math.min(1, (0.3 + cur.o) * ik);
      sat1.material.opacity = ik; sat2.material.opacity = ik;
      core.scale.setScalar(Math.max(0.001, (1 + 0.1 * Math.sin(tt * 2.2) + pulse * 1.2) * ik));
      glow.material.opacity = 0.9 * ik; halo.material.opacity = 0.22 * ik;
      glow.scale.setScalar(5.2 * (1 + 0.06 * Math.sin(tt * 2.2) + pulse * 0.6));

      field.rotation.y += dt * 0.015 * (1 + cur.sp);
      field.rotation.x = mouse.y * 0.12 + y * 0.0003;
      field.position.x = -mouse.x * 0.8;
      field.scale.setScalar(1 + pulse * 0.25 + vel * 0.008);
      fieldMat.opacity = 0.85 * ik;
      bokeh.rotation.y += dt * 0.02; bokeh.position.x = mouse.x * 1.4; bokehMat.opacity = 0.16 * ik;
      // Las etiquetas de tecnologías solo se muestran en pantallas anchas: en móvil taparían el texto
      const wStack = (wide ? 1 : 0) * (tw[2] || 0) * (1 - (tw[3] || 0)) * ik;
      for (let li = 0; li < labels.length; li++) {
        const L = labels[li];
        L.mat.opacity = wStack * 0.92;
        L.spr.visible = wStack > 0.02;
        if (L.spr.visible) {
          const ang = L.a + tt * L.w;
          L.spr.position.set(Math.cos(ang) * L.r, 0, Math.sin(ang) * L.r);
        }
      }
      renderer.render(scene, camera);

      if (hud && ++hudN % 6 === 0) {
        hud.textContent = SECTION_NAMES[secIdx].padEnd(12, " ") + "x " + mouse.x.toFixed(2).padStart(5, " ") + "  y " + (-mouse.y).toFixed(2).padStart(5, " ") + "  rot " + String(Math.round(((group.rotation.y * 57.2958) % 360 + 360) % 360)).padStart(3, "0") + "°";
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("portfolio:burst", onBurst);
      window.removeEventListener("portfolio:ready", onReady);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      [outerGeo, innerGeo, nodeGeo, innerNodeGeo, coreGeo, fieldGeo, bokehGeo, ring1.geometry, ring2.geometry].forEach((g) => g.dispose());
      [outerMat, innerMat, nodeMat, innerNodeMat, coreMat, fieldMat, bokehMat, ring1.material, ring2.material, sat1.material, sat2.material, glow.material, halo.material].forEach((m) => m.dispose());
      labels.forEach((L) => L.mat.dispose()); labelTex.forEach((t) => t.dispose());
      dotTex.dispose(); glowTex.dispose(); renderer.dispose();
    };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-0 h-full w-full pointer-events-none" />;
}
