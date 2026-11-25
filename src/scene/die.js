import * as THREE from "three";

/* ---------- Dado de 42 caras ----------
   Poliedro de Goldberg GP(2,0): 12 pentágonos y 30 hexágonos. Se construye como el dual de un icosaedro
   subdividido una vez (42 vértices -> 42 caras). Cada cara es un panel translúcido con el centro violeta,
   un borde luminoso y un símbolo. Los símbolos cambian solos y al azar (el 4 sale más a menudo) y todos se
   mezclan al "tirar" el dado. Todo se dibuja en solo dos mallas. */

const COLS = 8, CELL = 128;

// ---- Símbolos (atlas de 8x8 celdas) ----
function poly(g, cx, cy, r, n, rot = -Math.PI / 2) {
  for (let i = 0; i < n; i++) {
    const a = rot + (i * Math.PI * 2) / n, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.closePath();
}
function drawGlyph(g, kind, cx, cy) {
  g.fillStyle = "#fff"; g.strokeStyle = "#fff"; g.lineCap = "round"; g.lineJoin = "round";
  g.lineWidth = 11;
  g.beginPath();
  switch (kind) {
    case "inf": {
      for (let i = 0; i <= 80; i++) {
        const t = (i / 80) * Math.PI * 2, d = 1 + Math.sin(t) * Math.sin(t);
        const x = cx + (48 * Math.cos(t)) / d, y = cy + (48 * Math.sin(t) * Math.cos(t)) / d;
        if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.stroke(); break;
    }
    case "heart":
      g.moveTo(cx, cy + 38); g.bezierCurveTo(cx - 62, cy - 4, cx - 36, cy - 50, cx, cy - 22);
      g.bezierCurveTo(cx + 36, cy - 50, cx + 62, cy - 4, cx, cy + 38); g.fill(); break;
    case "diamond":
      g.moveTo(cx, cy - 46); g.lineTo(cx + 32, cy); g.lineTo(cx, cy + 46); g.lineTo(cx - 32, cy); g.closePath(); g.fill(); break;
    case "triangle":
      g.moveTo(cx, cy - 42); g.lineTo(cx + 44, cy + 34); g.lineTo(cx - 44, cy + 34); g.closePath(); g.fill(); break;
    case "circle":
      g.arc(cx, cy, 40, 0, Math.PI * 2); g.fill(); break;
    case "star":
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 20 : 46;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.closePath(); g.fill(); break;
    case "plus":
      g.moveTo(cx - 40, cy); g.lineTo(cx + 40, cy); g.moveTo(cx, cy - 40); g.lineTo(cx, cy + 40); g.lineWidth = 18; g.stroke(); break;
    case "cross":
      g.moveTo(cx - 34, cy - 34); g.lineTo(cx + 34, cy + 34); g.moveTo(cx + 34, cy - 34); g.lineTo(cx - 34, cy + 34); g.lineWidth = 18; g.stroke(); break;
    // ---- Símbolos de la rueda de Bill: uno por personaje ----
    case "pine": // Dipper: pino de su gorra
      g.moveTo(cx, cy - 48); g.lineTo(cx + 26, cy - 12); g.lineTo(cx + 12, cy - 12); g.lineTo(cx + 34, cy + 16); g.lineTo(cx + 14, cy + 16);
      g.lineTo(cx + 40, cy + 40); g.lineTo(cx - 40, cy + 40); g.lineTo(cx - 14, cy + 16); g.lineTo(cx - 34, cy + 16); g.lineTo(cx - 12, cy - 12);
      g.lineTo(cx - 26, cy - 12); g.closePath(); g.fill(); g.fillRect(cx - 6, cy + 40, 12, 12); break;
    case "shooting": { // Mabel: estrella fugaz de su suéter
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 13 : 28, x = cx + 14 + Math.cos(a) * r, y = cy - 12 + Math.sin(a) * r;
        if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.closePath(); g.fill();
      g.beginPath(); g.lineWidth = 8;
      g.moveTo(cx - 4, cy + 6); g.lineTo(cx - 44, cy + 40); g.moveTo(cx - 20, cy - 6); g.lineTo(cx - 52, cy + 16); g.moveTo(cx + 10, cy + 20); g.lineTo(cx - 16, cy + 48);
      g.stroke(); break;
    }
    case "halfmoon": // Stan: media luna del fez
      g.arc(cx, cy - 8, 44, 0, Math.PI, false); g.arc(cx, cy - 22, 38, Math.PI, 0, true); g.closePath(); g.fill(); break;
    case "hand6": // Ford: mano de seis dedos
      g.arc(cx, cy + 20, 26, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.lineWidth = 11;
      for (let i = 0; i < 6; i++) {
        const a = ((-75 + i * 30) * Math.PI) / 180;
        g.moveTo(cx + Math.sin(a) * 20, cy + 20 - Math.cos(a) * 20); g.lineTo(cx + Math.sin(a) * 52, cy + 20 - Math.cos(a) * 52);
      }
      g.stroke(); break;
    case "ice": // Wendy: bolsa de hielo
      g.moveTo(cx - 26, cy - 12); g.lineTo(cx + 26, cy - 12); g.lineTo(cx + 32, cy + 44); g.lineTo(cx - 32, cy + 44); g.closePath(); g.lineWidth = 10; g.stroke();
      g.fillRect(cx - 14, cy - 34, 28, 20);
      g.beginPath(); g.lineWidth = 7; g.moveTo(cx, cy + 4); g.lineTo(cx, cy + 34); g.moveTo(cx - 15, cy + 19); g.lineTo(cx + 15, cy + 19); g.stroke(); break;
    case "glasses": // McGucket: lentes
      g.lineWidth = 9; g.arc(cx - 26, cy + 2, 21, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.arc(cx + 26, cy + 2, 21, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(cx - 6, cy - 2); g.quadraticCurveTo(cx, cy - 10, cx + 6, cy - 2);
      g.moveTo(cx - 47, cy - 6); g.lineTo(cx - 58, cy - 14); g.moveTo(cx + 47, cy - 6); g.lineTo(cx + 58, cy - 14); g.stroke(); break;
    case "eyestar": // Gideon: estrella con un ojo
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 24 : 52, x = cx + Math.cos(a) * r, y = cy + 2 + Math.sin(a) * r;
        if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.closePath(); g.lineWidth = 9; g.stroke();
      g.beginPath(); g.ellipse(cx, cy + 4, 16, 9, 0, 0, Math.PI * 2); g.lineWidth = 6; g.stroke();
      g.beginPath(); g.arc(cx, cy + 4, 5, 0, Math.PI * 2); g.fill(); break;
    case "flame": // Pacífica: llama
      g.moveTo(cx, cy + 50);
      g.bezierCurveTo(cx - 40, cy + 50, cx - 46, cy + 8, cx - 26, cy - 16);   // lado izquierdo, hasta la lengua pequeña
      g.bezierCurveTo(cx - 22, cy - 6, cx - 16, cy - 4, cx - 14, cy + 4);     // muesca entre las dos lenguas
      g.bezierCurveTo(cx - 14, cy - 24, cx + 2, cy - 34, cx + 4, cy - 54);    // lengua grande hasta la punta
      g.bezierCurveTo(cx + 22, cy - 32, cx + 46, cy - 8, cx + 40, cy + 20);   // lado derecho
      g.bezierCurveTo(cx + 36, cy + 42, cx + 18, cy + 50, cx, cy + 50); g.fill(); break;
    case "stitch": // Robbie: corazón cosido
      g.moveTo(cx, cy + 40); g.bezierCurveTo(cx - 62, cy - 2, cx - 36, cy - 50, cx, cy - 22);
      g.bezierCurveTo(cx + 36, cy - 50, cx + 62, cy - 2, cx, cy + 40); g.lineWidth = 9; g.stroke();
      g.beginPath(); g.lineWidth = 6; g.moveTo(cx, cy - 20); g.lineTo(cx, cy + 32);
      [-12, 2, 16, 30].forEach((t) => { g.moveTo(cx - 11, cy + t - 6); g.lineTo(cx + 11, cy + t + 6); });
      g.stroke(); break;
    case "smile":
      g.arc(cx, cy, 42, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.arc(cx - 15, cy - 12, 5, 0, Math.PI * 2); g.arc(cx + 15, cy - 12, 5, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(cx, cy + 4, 22, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); break;
    case "cherry":
      g.arc(cx - 18, cy + 22, 19, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(cx + 20, cy + 28, 19, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.moveTo(cx - 18, cy + 4); g.quadraticCurveTo(cx - 10, cy - 30, cx + 8, cy - 42);
      g.moveTo(cx + 20, cy + 10); g.quadraticCurveTo(cx + 18, cy - 24, cx + 8, cy - 42); g.lineWidth = 8; g.stroke(); break;
    case "eye": // triángulo con un ojo, guiño al círculo de símbolos del dado original
      poly(g, cx, cy + 4, 50, 3); g.lineWidth = 9; g.stroke();
      g.beginPath(); g.arc(cx, cy + 12, 13, 0, Math.PI * 2); g.fill(); break;
    case "pent":
      poly(g, cx, cy + 4, 46, 5); g.lineWidth = 10; g.stroke();
      g.beginPath(); g.arc(cx, cy + 4, 11, 0, Math.PI * 2); g.fill(); break;
    case "hex":
      poly(g, cx, cy, 44, 6, 0); g.lineWidth = 12; g.stroke(); break;
    default:
      g.font = "700 84px 'Space Grotesk', system-ui, 'Segoe UI', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(kind, cx, cy + 4);
  }
}
// 23 símbolos (10 de ellos son los de la rueda de Bill) + 10 dígitos + 26 letras = 59 caras posibles (caben 64 en el atlas)
const SYMBOLS = ["inf", "heart", "diamond", "triangle", "circle", "cherry", "smile", "star", "plus", "eye", "pent", "hex", "cross",
  "pine", "shooting", "halfmoon", "hand6", "?", "ice", "glasses", "eyestar", "flame", "stitch"];
const KINDS = [...SYMBOLS, ..."0123456789".split(""), ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];
const N_KINDS = KINDS.length;
// Sorteo con trampa: el 4 pesa cinco veces más, como en el dado de la serie
const FOUR = KINDS.indexOf("4");
const POOL = [...KINDS.keys(), FOUR, FOUR, FOUR, FOUR];

function makeAtlas() {
  const c = document.createElement("canvas"); c.width = c.height = COLS * CELL;
  const g = c.getContext("2d");
  KINDS.forEach((k, i) => {
    g.save(); g.beginPath(); g.rect((i % COLS) * CELL, Math.floor(i / COLS) * CELL, CELL, CELL); g.clip();
    drawGlyph(g, k, (i % COLS) * CELL + CELL / 2, Math.floor(i / COLS) * CELL + CELL / 2);
    g.restore();
  });
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
  return tex;
}
// UV de una celda del atlas para las 6 esquinas del cuadrado (dos triángulos)
function cellUv(idx) {
  const col = idx % COLS, row = Math.floor(idx / COLS);
  const u0 = col / COLS, u1 = (col + 1) / COLS, v1 = 1 - row / COLS, v0 = 1 - (row + 1) / COLS;
  return [u0, v0, u1, v0, u1, v1, u0, v0, u1, v1, u0, v1];
}

// ---- Geometría ----
function dual() {
  const ico = new THREE.IcosahedronGeometry(1, 1), p = ico.attributes.position;
  const idx = new Map(), V = [], T = [];
  for (let t = 0; t < p.count; t += 3) {
    const tri = [];
    for (let k = 0; k < 3; k++) {
      const x = p.getX(t + k), y = p.getY(t + k), z = p.getZ(t + k);
      const key = Math.round(x * 1e4) + "," + Math.round(y * 1e4) + "," + Math.round(z * 1e4);
      if (!idx.has(key)) { idx.set(key, V.length); V.push(new THREE.Vector3(x, y, z).normalize()); }
      tri.push(idx.get(key));
    }
    T.push(tri);
  }
  ico.dispose();
  return { V, T };
}

export function makeDie(R) {
  const { V, T } = dual();
  const F = V.length;
  const fPos = [], fNor = [], fT = [], fB = [];
  const gPos = [], gNor = [];
  const INSET = 0.1;
  const up = new THREE.Vector3(0, 1, 0), alt = new THREE.Vector3(1, 0, 0);

  // Símbolo inicial de cada cara: todos distintos y el ∞ en la primera
  const glyph = [...Array(N_KINDS).keys()].sort(() => Math.random() - 0.5).slice(0, F);
  const at = glyph.indexOf(0); if (at > 0) glyph[at] = glyph[0];
  glyph[0] = 0;
  const gUv = [];

  V.forEach((n, vi) => {
    // Esquinas de la cara: centroides de los triángulos que rodean al vértice, sobre la esfera
    const pts = T.filter((t) => t.includes(vi)).map((t) => new THREE.Vector3().add(V[t[0]]).add(V[t[1]]).add(V[t[2]]).normalize().multiplyScalar(R));
    // Base tangente (derecha, arriba) vista desde fuera; la "arriba" apunta hacia +Y para que los símbolos queden derechos
    const ref = Math.abs(n.dot(up)) > 0.96 ? alt : up;
    const right = new THREE.Vector3().crossVectors(ref, n).normalize();
    const upT = new THREE.Vector3().crossVectors(n, right).normalize();
    pts.sort((a, b) => Math.atan2(a.dot(upT), a.dot(right)) - Math.atan2(b.dot(upT), b.dot(right)));
    const c = pts.reduce((s, q) => s.add(q), new THREE.Vector3()).multiplyScalar(1 / pts.length);
    const q = pts.map((a) => a.clone().lerp(c, INSET));
    const push = (v, t, b) => { fPos.push(v.x, v.y, v.z); fNor.push(n.x, n.y, n.z); fT.push(t); fB.push(b); };
    const m = pts.length;
    for (let k = 0; k < m; k++) {
      const k2 = (k + 1) % m;
      push(c, 0, 0); push(q[k], 1, 0); push(q[k2], 1, 0);                 // relleno: centro indigo a violeta
      push(pts[k], 1, 1); push(pts[k2], 1, 1); push(q[k2], 1, 1);        // borde luminoso (dos triángulos por lado)
      push(pts[k], 1, 1); push(q[k2], 1, 1); push(q[k], 1, 1);
    }
    // Símbolo: un cuadrado tangente en el centro de la cara (6 vértices por cara, en el orden de las caras)
    let inr = Infinity;
    for (let k = 0; k < m; k++) inr = Math.min(inr, c.distanceTo(pts[k].clone().add(pts[(k + 1) % m]).multiplyScalar(0.5)));
    const s = inr * 0.66, lift = c.clone().add(n.clone().multiplyScalar(R * 0.012));
    const corner = (sx, sy) => lift.clone().add(right.clone().multiplyScalar(sx * s)).add(upT.clone().multiplyScalar(sy * s));
    const Q = [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)];
    [0, 1, 2, 0, 2, 3].forEach((i) => { const v = Q[i]; gPos.push(v.x, v.y, v.z); gNor.push(n.x, n.y, n.z); });
    gUv.push(...cellUv(glyph[vi]));
  });

  const fillGeo = new THREE.BufferGeometry();
  fillGeo.setAttribute("position", new THREE.Float32BufferAttribute(fPos, 3));
  fillGeo.setAttribute("normal", new THREE.Float32BufferAttribute(fNor, 3));
  fillGeo.setAttribute("aT", new THREE.Float32BufferAttribute(fT, 1));
  fillGeo.setAttribute("aB", new THREE.Float32BufferAttribute(fB, 1));
  const uvAttr = new THREE.Float32BufferAttribute(gUv, 2);
  const alphaAttr = new THREE.Float32BufferAttribute(new Float32Array(F * 6).fill(1), 1);
  const glyphGeo = new THREE.BufferGeometry();
  glyphGeo.setAttribute("position", new THREE.Float32BufferAttribute(gPos, 3));
  glyphGeo.setAttribute("normal", new THREE.Float32BufferAttribute(gNor, 3));
  glyphGeo.setAttribute("uv", uvAttr);
  glyphGeo.setAttribute("aA", alphaAttr);

  // Paneles de cristal con la paleta del núcleo: centro indigo-700, paneles violeta y bordes de violeta claro a cian
  const fillMat = new THREE.ShaderMaterial({
    uniforms: {
      uOpacity: { value: 1 },
      uCenter: { value: new THREE.Color(0x4338ca) }, uRim: { value: new THREE.Color(0x7000ff) },
      uBorder: { value: new THREE.Color(0xb86bff) }, uBorder2: { value: new THREE.Color(0x00f0ff) },
    },
    vertexShader: [
      "attribute float aT; attribute float aB; varying float vT; varying float vB; varying float vRim;",
      "void main() {",
      "  vT = aT; vB = aB;",
      "  vec4 mv = modelViewMatrix * vec4(position, 1.0);",
      "  vec3 n = normalize(normalMatrix * normal); vec3 v = normalize(-mv.xyz);",
      "  vRim = 1.0 - abs(dot(n, v));",
      "  gl_Position = projectionMatrix * mv;",
      "}",
    ].join("\n"),
    fragmentShader: [
      "uniform vec3 uCenter; uniform vec3 uRim; uniform vec3 uBorder; uniform vec3 uBorder2; uniform float uOpacity;",
      "varying float vT; varying float vB; varying float vRim;",
      "void main() {",
      "  vec3 col = mix(uCenter, uRim, smoothstep(0.0, 1.0, vT));",
      "  float a = mix(0.62, 0.34, vT);",
      "  col = mix(col, mix(uBorder, uBorder2, smoothstep(0.25, 0.95, vRim)), vB);",
      "  a = mix(a, 0.95, vB);",
      "  a *= 0.7 + 0.9 * vRim;",
      "  gl_FragColor = vec4(col, a * uOpacity);",
      "}",
    ].join("\n"),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide,
  });
  const atlas = makeAtlas();
  // Símbolos cian; cada cara tiene su propia opacidad (aA) para poder cambiar de símbolo con un fundido
  const glyphMat = new THREE.ShaderMaterial({
    uniforms: { map: { value: atlas }, uColor: { value: new THREE.Color(0x00f0ff) }, uOpacity: { value: 1 } },
    vertexShader: [
      "attribute float aA; varying vec2 vUv; varying float vA;",
      "void main() { vUv = uv; vA = aA; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    ].join("\n"),
    fragmentShader: [
      "uniform sampler2D map; uniform vec3 uColor; uniform float uOpacity; varying vec2 vUv; varying float vA;",
      "void main() { float t = texture2D(map, vUv).a; gl_FragColor = vec4(uColor, t * vA * uOpacity); }",
    ].join("\n"),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide,
  });

  const fill = new THREE.Mesh(fillGeo, fillMat);
  const glyphs = new THREE.Mesh(glyphGeo, glyphMat);
  glyphs.renderOrder = 1;
  const group = new THREE.Group();
  group.add(fill, glyphs);

  // ---- Cambio aleatorio de símbolos ----
  const FADE = 0.22;
  const swaps = new Array(F).fill(null);
  let timer = 1.2, cooldown = 0;
  const pick = (f) => { let k; do { k = POOL[Math.floor(Math.random() * POOL.length)]; } while (k === glyph[f]); return k; };
  const start = (f, delay = 0) => { if (!swaps[f]) swaps[f] = { phase: 0, t: -delay, next: pick(f) }; };
  const setAlpha = (f, a) => { for (let k = 0; k < 6; k++) alphaAttr.setX(f * 6 + k, a); };
  const setGlyph = (f, k) => { glyph[f] = k; const u = cellUv(k); for (let i = 0; i < 6; i++) uvAttr.setXY(f * 6 + i, u[i * 2], u[i * 2 + 1]); };

  return {
    group,
    setOpacity(o) { fillMat.uniforms.uOpacity.value = o; glyphMat.uniforms.uOpacity.value = Math.min(1, o * 0.75); },
    // "Tirar" el dado: todas las caras cambian de símbolo, escalonadas (con una pausa para no encadenar tiradas)
    roll() {
      if (cooldown > 0) return;
      cooldown = 1.6;
      for (let f = 0; f < F; f++) start(f, Math.random() * 0.4);
    },
    // auto: cambia de vez en cuando un par de caras al azar (solo con los efectos completos)
    update(dt, auto) {
      cooldown -= dt;
      if (auto) {
        timer -= dt;
        if (timer <= 0) { timer = 0.8 + Math.random() * 0.8; start(Math.floor(Math.random() * F)); start(Math.floor(Math.random() * F)); }
      }
      let dirty = false;
      for (let f = 0; f < F; f++) {
        const s = swaps[f];
        if (!s) continue;
        s.t += dt;
        if (s.t < 0) continue;
        let a;
        if (s.phase === 0) {
          a = 1 - s.t / FADE;
          if (s.t >= FADE) { setGlyph(f, s.next); s.phase = 1; s.t = 0; a = 0; uvAttr.needsUpdate = true; }
        } else {
          a = s.t / FADE;
          if (s.t >= FADE) { a = 1; swaps[f] = null; }
        }
        setAlpha(f, Math.max(0, Math.min(1, a)));
        dirty = true;
      }
      if (dirty) alphaAttr.needsUpdate = true;
    },
    dispose() { fillGeo.dispose(); glyphGeo.dispose(); fillMat.dispose(); glyphMat.dispose(); atlas.dispose(); },
  };
}
