import { useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { ExternalLink, Code2, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "../data/content";
import { reveal } from "../lib/motion";
import { useFx } from "../lib/fx";
import { navClick } from "../lib/nav";
import { SectionHead } from "./ui";

/* ---------- Vistas previas estilizadas ---------- */
export function Preview({ kind }) {
  if (kind === "chart") return (
    <svg viewBox="0 0 300 150" className="h-full w-full" role="img" aria-label="Gráfico de barras y línea de ejemplo">
      <defs>
        <linearGradient id="barg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#00f0ff" stopOpacity=".85" /><stop offset="1" stopColor="#7000ff" stopOpacity=".25" /></linearGradient>
      </defs>
      {[30, 60, 90, 120].map((y) => <line key={y} x1="16" x2="284" y1={y} y2={y} stroke="rgba(255,255,255,.07)" />)}
      {[44, 72, 58, 96, 80, 112, 100, 126].map((h, i) => <rect key={i} x={24 + i * 33} y={140 - h} width="20" height={h} rx="3" fill="url(#barg)" />)}
      <polyline points="34,98 67,72 100,84 133,50 166,62 199,32 232,44 265,20" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px #00f0ff)" }} />
      <circle cx="265" cy="20" r="4" fill="#050508" stroke="#00f0ff" strokeWidth="2" />
    </svg>
  );
  if (kind === "kanban") return (
    <svg viewBox="0 0 300 150" className="h-full w-full" role="img" aria-label="Tablero de tareas organizado en columnas">
      <defs>
        <linearGradient id="kbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#00f0ff" stopOpacity=".75" /><stop offset="1" stopColor="#7000ff" stopOpacity=".6" /></linearGradient>
      </defs>
      {[0, 1, 2].map((c) => (
        <g key={c} transform={"translate(" + (14 + c * 94) + " 14)"}>
          <rect width="84" height="122" rx="8" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.1)" />
          <rect x="10" y="10" width="38" height="5" rx="2.5" fill="rgba(255,255,255,.35)" />
          {[0, 1, 2].slice(0, 3 - c).map((r) => (
            <g key={r} transform={"translate(8 " + (26 + r * 31) + ")"}>
              <rect width="68" height="25" rx="5" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.12)" />
              <rect x="7" y="7" width={34 + ((c + r) % 3) * 10} height="4" rx="2" fill="rgba(255,255,255,.4)" />
              <rect x="7" y="15" width="22" height="4" rx="2" fill={(c + r) % 2 ? "#00f0ff" : "#a77bff"} opacity=".8" />
            </g>
          ))}
        </g>
      ))}
      <g transform="translate(204 72) rotate(5)" style={{ filter: "drop-shadow(0 0 8px rgba(0,240,255,.6))" }}>
        <rect width="68" height="25" rx="5" fill="url(#kbg)" />
        <rect x="7" y="7" width="40" height="4" rx="2" fill="#fff" opacity=".85" />
        <rect x="7" y="15" width="22" height="4" rx="2" fill="#fff" opacity=".6" />
      </g>
    </svg>
  );
  if (kind === "tracker") return (
    <svg viewBox="0 0 300 150" className="h-full w-full" role="img" aria-label="Anillos de progreso, línea de gastos y hábitos de la semana">
      <defs>
        <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#00f0ff" /><stop offset="1" stopColor="#a77bff" /></linearGradient>
      </defs>
      <g transform="translate(70 75)">
        <circle r="38" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="9" />
        <circle r="38" fill="none" stroke="url(#rg)" strokeWidth="9" strokeLinecap="round" strokeDasharray="170 239" transform="rotate(-90)" style={{ filter: "drop-shadow(0 0 6px rgba(0,240,255,.6))" }} />
        <circle r="22" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="6" />
        <circle r="22" fill="none" stroke="#a77bff" strokeWidth="6" strokeLinecap="round" strokeDasharray="70 138" transform="rotate(-90)" />
      </g>
      <polyline points="140,56 165,46 190,52 215,34 240,40 266,24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 5px #00f0ff)" }} />
      {[0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => {
        const on = (r * 3 + c * 2) % 5 < 3;
        return <rect key={r + "-" + c} x={140 + c * 20} y={80 + r * 20} width="14" height="14" rx="4" fill={on ? "#00f0ff" : "rgba(255,255,255,.08)"} opacity={on ? 0.55 + ((c + r) % 3) * 0.15 : 1} />;
      }))}
    </svg>
  );
  if (kind === "pos") return (
    <svg viewBox="0 0 300 150" className="h-full w-full" role="img" aria-label="Pantalla de punto de venta con productos y ticket">
      {[0, 1, 2].map((c) => [0, 1].map((r) => (
        <g key={c + "-" + r} transform={"translate(" + (14 + c * 62) + " " + (16 + r * 62) + ")"}>
          <rect width="54" height="54" rx="9" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.12)" />
          <circle cx="27" cy="22" r="9" fill={(c + r) % 2 ? "rgba(0,240,255,.55)" : "rgba(167,123,255,.6)"} />
          <rect x="10" y="38" width="34" height="4" rx="2" fill="rgba(255,255,255,.35)" />
        </g>
      )))}
      <g transform="translate(206 12)">
        <rect width="82" height="126" rx="10" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.14)" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={"translate(10 " + (14 + i * 17) + ")"}>
            <rect width={34 + (i % 2) * 10} height="4" rx="2" fill="rgba(255,255,255,.45)" />
            <rect x="56" width="16" height="4" rx="2" fill="rgba(255,255,255,.3)" />
          </g>
        ))}
        <rect x="10" y="86" width="62" height="1" fill="rgba(255,255,255,.2)" />
        <rect x="10" y="94" width="26" height="5" rx="2.5" fill="rgba(255,255,255,.6)" />
        <rect x="46" y="93" width="26" height="7" rx="3" fill="#a77bff" />
        <rect x="10" y="108" width="62" height="12" rx="6" fill="#00f0ff" style={{ filter: "drop-shadow(0 0 6px rgba(0,240,255,.6))" }} />
      </g>
    </svg>
  );
  if (kind === "inventory") return (
    <svg viewBox="0 0 300 150" className="h-full w-full" role="img" aria-label="Tabla de inventario con niveles de existencias y un reporte en PDF">
      <rect x="14" y="14" width="190" height="122" rx="10" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={"translate(26 " + (32 + i * 21) + ")"}>
          <rect width="46" height="5" rx="2.5" fill="rgba(255,255,255,.4)" />
          <rect x="62" y="-1" width="110" height="7" rx="3.5" fill="rgba(255,255,255,.08)" />
          <rect x="62" y="-1" width={[96, 70, 36, 84, 58][i]} height="7" rx="3.5" fill={i === 2 ? "#a77bff" : "#00f0ff"} opacity=".8" />
        </g>
      ))}
      <g transform="translate(222 22)" style={{ filter: "drop-shadow(0 0 8px rgba(112,0,255,.5))" }}>
        <path d="M0 6a6 6 0 0 1 6-6h40l18 18v82a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z" fill="rgba(112,0,255,.25)" stroke="#a77bff" strokeWidth="1.4" />
        <path d="M46 0v14a4 4 0 0 0 4 4h14" fill="none" stroke="#a77bff" strokeWidth="1.4" />
        {[0, 1, 2].map((i) => <rect key={i} x="12" y={34 + i * 14} width={40 - (i % 2) * 10} height="4" rx="2" fill="rgba(255,255,255,.5)" />)}
        <text x="32" y="94" textAnchor="middle" fontSize="11" fontWeight="700" fill="#00f0ff" fontFamily="JetBrains Mono, ui-monospace, monospace">PDF</text>
      </g>
    </svg>
  );
  if (kind === "landing") return (
    <svg viewBox="0 0 300 150" className="h-full w-full" role="img" aria-label="Maqueta de una página de presentación">
      <defs>
        <radialGradient id="lg" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#7000ff" stopOpacity=".9" /><stop offset="1" stopColor="#7000ff" stopOpacity="0" /></radialGradient>
      </defs>
      <rect x="14" y="12" width="272" height="126" rx="10" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.14)" />
      <path d="M14 22a10 10 0 0 1 10-10h252a10 10 0 0 1 10 10v8H14z" fill="rgba(255,255,255,.06)" />
      {["#00f0ff", "#a77bff", "rgba(255,255,255,.5)"].map((c, i) => <circle key={i} cx={28 + i * 10} cy="22" r="2.6" fill={c} opacity=".85" />)}
      <circle cx="226" cy="84" r="46" fill="url(#lg)" />
      <circle cx="226" cy="84" r="22" fill="none" stroke="#00f0ff" strokeWidth="1.4" style={{ filter: "drop-shadow(0 0 5px #00f0ff)" }} />
      <rect x="32" y="52" width="108" height="9" rx="4.5" fill="rgba(255,255,255,.75)" />
      <rect x="32" y="68" width="82" height="9" rx="4.5" fill="rgba(255,255,255,.75)" />
      <rect x="32" y="88" width="120" height="4" rx="2" fill="rgba(255,255,255,.28)" />
      <rect x="32" y="98" width="96" height="4" rx="2" fill="rgba(255,255,255,.28)" />
      <rect x="32" y="112" width="48" height="14" rx="7" fill="#00f0ff" />
    </svg>
  );
  return (
    <svg viewBox="0 0 300 150" className="h-full w-full" role="img" aria-label="Flujo de automatización con nodos conectados">
      <defs>
        <linearGradient id="fg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#00f0ff" /><stop offset="1" stopColor="#a77bff" /></linearGradient>
      </defs>
      <g fill="none" stroke="url(#fg)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M70 75 H100 C112 75 112 40 124 40 H150" />
        <path d="M70 75 H100 C112 75 112 110 124 110 H150" />
        <path d="M200 40 H226 C238 40 238 75 250 75" />
        <path d="M200 110 H226 C238 110 238 75 250 75" />
      </g>
      {[
        { x: 14, y: 60, w: 56, label: "trigger", c: "#00f0ff" },
        { x: 150, y: 25, w: 50, label: "datos", c: "#a77bff" },
        { x: 150, y: 95, w: 50, label: "reglas", c: "#a77bff" },
        { x: 250, y: 60, w: 46, label: "salida", c: "#00f0ff" },
      ].map((n) => (
        <g key={n.label}>
          <rect x={n.x} y={n.y} width={n.w} height="30" rx="8" fill="rgba(255,255,255,.06)" stroke={n.c} strokeOpacity=".7" />
          <circle cx={n.x + 9} cy={n.y + 15} r="3" fill={n.c} />
          <text x={n.x + n.w / 2 + 4} y={n.y + 18} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,.75)" fontFamily="JetBrains Mono, ui-monospace, monospace">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- Tarjeta con inclinación ---------- */
export function ProjectCard({ p, i }) {
  const { calm } = useFx();
  const ref = useRef(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 16, mass: 0.5 });
  const sry = useSpring(ry, { stiffness: 160, damping: 16, mass: 0.5 });
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - r.left + "px");
    el.style.setProperty("--my", e.clientY - r.top + "px");
    if (calm || e.pointerType !== "mouse") return;
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const reset = () => { rx.set(0); ry.set(0); };
  return (
    <motion.li variants={reveal} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} style={{ perspective: 1100 }} className={"min-w-0 " + (p.featured ? "md:col-span-2" : p.wideMd ? "md:col-span-2 lg:col-span-1" : "")}>
      <motion.article ref={ref} onPointerMove={onMove} onPointerLeave={reset}
        whileHover={calm ? undefined : { y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="spot glass flex h-full flex-col overflow-hidden">
        <div className={"grid-bg relative overflow-hidden border-b border-white/10 bg-black/30 " + (p.featured ? "h-52 sm:h-60" : "h-44")}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(70% 90% at 50% 120%, rgba(112,0,255,.35), transparent 70%)" }} />
          <div className="relative h-full p-3"><Preview kind={p.kind} /></div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <h3 className={"font-display font-bold " + (p.featured ? "text-2xl" : "text-xl")}>{p.title}</h3>
            <p className="mt-2 text-sm" style={{ color: "var(--fg-soft)" }}>{p.text}</p>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="Tecnologías">
            {p.tags.map((t) => <li key={t} className="font-mono rounded-full border border-neon/25 bg-neon/5 px-2.5 py-1 text-[11px] text-neon">{t}</li>)}
          </ul>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
            {p.links && p.links.demo && <a href={p.links.demo} target="_blank" rel="noopener noreferrer" aria-label={"Ver demo de " + p.title} className="btn btn-neon btn-sm">Demo <ExternalLink size={15} aria-hidden="true" /></a>}
            {p.links && p.links.code && <a href={p.links.code} target="_blank" rel="noopener noreferrer" aria-label={"Ver código de " + p.title} className="btn btn-ghost btn-sm">Código <Code2 size={15} aria-hidden="true" /></a>}
            {!(p.links && (p.links.demo || p.links.code)) && (
              <a href="#contacto" onClick={navClick("contacto")} aria-label={"Pedir detalles de " + p.title} className="btn btn-ghost btn-sm">Pedir detalles <ArrowUpRight size={15} aria-hidden="true" /></a>
            )}
            {p.meta && <span className="font-mono ml-auto text-[11px] uppercase tracking-widest" style={{ color: "var(--fg-mute)" }}>{p.meta}</span>}
          </div>
        </div>
      </motion.article>
    </motion.li>
  );
}

export function Projects() {
  return (
    <section id="proyectos" aria-labelledby="proyectos-title" className="gutter py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHead id="proyectos-title" eyebrow="// proyectos" title="Lo que he construido"
          text="Proyectos en equipo y personales, de la base de datos a la interfaz." />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
        </ul>
      </div>
    </section>
  );
}
