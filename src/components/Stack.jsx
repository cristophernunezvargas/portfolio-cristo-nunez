import { useRef } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { STACK, ALSO } from "../data/content";
import { clamp, reveal } from "../lib/motion";
import { useFx } from "../lib/fx";
import { useScrollMV } from "../hooks";
import { SectionHead } from "./ui";

/* ---------- Stack ---------- */
// Tarjeta de tecnología en 3D: losas traseras con grosor, cara, icono y textos a distinta profundidad; se inclina con el cursor
export function TechTile({ t, i }) {
  const { calm } = useFx();
  const ref = useRef(null), faceRef = useRef(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 170, damping: 15, mass: 0.5 });
  const sry = useSpring(ry, { stiffness: 170, damping: 15, mass: 0.5 });
  const Icon = t.Icon;
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    if (faceRef.current) { faceRef.current.style.setProperty("--mx", px * r.width + "px"); faceRef.current.style.setProperty("--my", py * r.height + "px"); }
    if (calm || e.pointerType !== "mouse") return;
    ry.set((px - 0.5) * 30);
    rx.set(-(py - 0.5) * 30);
  };
  const reset = () => { rx.set(0); ry.set(0); };
  return (
    <li className="float-y min-w-0" style={{ "--fd": (i % 5) * -1.3 + "s" }}>
      <motion.div variants={reveal} custom={i % 4} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} style={{ perspective: 900 }}>
        <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }} className="tile">
          <div aria-hidden="true" className="tile-slab" style={{ position: "absolute", inset: 0, transform: "translateZ(-26px)" }} />
          <div aria-hidden="true" className="tile-slab tile-slab-mid" style={{ position: "absolute", inset: 0, transform: "translateZ(-13px)" }} />
          <div ref={faceRef} aria-hidden="true" className="tile-face spot" style={{ position: "absolute", inset: 0 }} />
          <div className="relative flex min-w-0 flex-col gap-4 p-4 sm:p-5" style={{ transformStyle: "preserve-3d" }}>
            <span className="tile-icon relative grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-[#0d0d18] text-neon">
              <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
              <span className="tile-ring" aria-hidden="true" />
            </span>
            <div className="tile-text min-w-0">
              <p className="tile-name font-display truncate text-base font-bold sm:text-lg">{t.name}</p>
              <p className="tile-tag font-mono text-[10px] uppercase tracking-wider sm:text-[11px] sm:tracking-widest" style={{ color: "var(--fg-mute)" }}>{t.tag}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </li>
  );
}

export function Stack() {
  const { calm } = useFx();
  const wrapRef = useRef(null);
  // El plano de tecnologías entra inclinado y se endereza a medida que llegas a él
  const p = useScrollMV(wrapRef, (r, vh) => clamp((vh * 0.95 - r.top) / (vh * 0.55), 0, 1));
  const e = useSpring(p, { stiffness: 90, damping: 22 });
  const k = window.innerWidth < 640 ? 0.6 : 1;
  const rotX = useTransform(e, [0, 1], [44 * k, 0]);
  const rotZ = useTransform(e, [0, 1], [-8 * k, 0]);
  const lift = useTransform(e, [0, 1], [70, 0]);
  const zoom = useTransform(e, [0, 1], [0.9, 1]);
  const planeStyle = calm ? {} : { rotateX: rotX, rotateZ: rotZ, y: lift, scale: zoom, transformOrigin: "50% 0%", transformStyle: "preserve-3d" };
  return (
    <section id="stack" aria-labelledby="stack-title" className="gutter py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHead id="stack-title" eyebrow="// stack tecnológico" title="Tecnologías con las que trabajo"
          text="De la base de datos a la interfaz: lo que he usado en proyectos reales." />
        <div ref={wrapRef} style={{ perspective: 1400 }}>
          <motion.ul style={planeStyle} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {STACK.map((t, i) => <TechTile key={t.name} t={t} i={i} />)}
          </motion.ul>
        </div>
        <div className="mt-12">
          <p className="font-mono mb-3 text-[11px] uppercase tracking-widest" style={{ color: "var(--fg-mute)" }}>También he trabajado con</p>
          <ul className="flex flex-wrap gap-2">
            {ALSO.map((name) => (
              <li key={name} className="glass rounded-full px-4 py-2 text-sm" style={{ color: "var(--fg-soft)" }}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
