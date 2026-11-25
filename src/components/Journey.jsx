import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Check } from "lucide-react";
import { JOURNEY, STATS } from "../data/content";
import { clamp, EASE, reveal } from "../lib/motion";
import { useScrollMV, useSpotlight } from "../hooks";
import { CountUp, SectionHead } from "./ui";

/* ---------- Proceso: la línea se dibuja con el scroll ---------- */
export function JourneyStep({ s, i, prog, selected, dim, onSelect }) {
  const onMove = useSpotlight();
  const on = useTransform(prog, [i / 3 - 0.08, i / 3 + 0.02], [0, 1]);
  const [ripples, setRipples] = useState([]);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const Icon = s.Icon;
  // Al tocar: onda desde el punto de toque, la tarjeta se eleva y se resalta, y las demás se atenuan
  const click = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const kb = e.detail === 0;
    const id = Date.now() + Math.random();
    setRipples((rs) => [...rs, { id, x: kb ? r.width / 2 : e.clientX - r.left, y: kb ? r.height / 2 : e.clientY - r.top }]);
    timers.current.push(setTimeout(() => setRipples((rs) => rs.filter((q) => q.id !== id)), 900));
    onSelect(i);
  };
  return (
    <motion.li variants={reveal} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="relative min-w-0 lg:pt-14">
      <span aria-hidden="true" className="absolute left-0 top-[21px] hidden h-3 w-3 rounded-full border border-white/25 bg-ink lg:block">
        <motion.span style={{ opacity: on, scale: on }} className="absolute inset-[-1px] rounded-full bg-neon shadow-[0_0_14px_#00f0ff]" />
        {selected && <span className="absolute -inset-1.5 animate-ping rounded-full border border-neon" />}
      </span>
      <motion.div onClick={click} onMouseMove={onMove}
        animate={selected ? { y: -10, scale: 1.04, opacity: 1 } : dim ? { y: 0, scale: 0.97, opacity: 0.6 } : { y: 0, scale: 1, opacity: 1 }}
        whileTap={{ scale: selected ? 1.01 : 0.96 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className={"spot glass process-card relative flex h-full min-w-0 cursor-pointer select-none flex-col gap-4 p-5 " + (selected ? "is-active" : "")}>
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <AnimatePresence>
            {ripples.map((r) => (
              <motion.span key={r.id} initial={{ scale: 0, opacity: 0.6 }} animate={{ scale: 1, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.85, ease: "easeOut" }}
                className="absolute rounded-full" style={{ left: r.x - 130, top: r.y - 130, width: 260, height: 260, background: "radial-gradient(circle, rgba(0,240,255,.55), rgba(112,0,255,.28) 48%, transparent 70%)" }} />
            ))}
          </AnimatePresence>
        </span>
        <div className="relative flex items-start justify-between gap-3">
          <motion.span animate={selected ? { rotate: 360, scale: 1.15 } : { rotate: 0, scale: 1 }} transition={{ duration: 0.6, ease: EASE }}
            className={"grid h-11 w-11 place-items-center rounded-xl border transition-colors duration-300 " + (selected ? "border-neon bg-neon text-ink shadow-[0_0_26px_#00f0ff]" : "border-white/10 bg-white/5 text-neon")}>
            <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
          </motion.span>
          <motion.span aria-hidden="true" animate={selected ? { scale: 1.25 } : { scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}
            className={"font-display origin-right text-4xl font-bold leading-none " + (selected ? "grad-text" : "outline-text")}>{s.n}</motion.span>
        </div>
        <div className="relative">
          <h3 className="font-display text-xl font-bold">
            <button type="button" aria-pressed={selected} className="cursor-pointer text-left">{s.t}</button>
          </h3>
          <p className="mt-2 text-sm" style={{ color: "var(--fg-soft)" }}>{s.d}</p>
        </div>
        <p className="font-mono relative mt-auto flex items-center gap-2 text-[11px] uppercase tracking-widest" style={{ color: "var(--fg-mute)" }}>
          {selected && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-neon text-ink"><Check size={11} strokeWidth={3} aria-hidden="true" /></motion.span>}
          <span><span className="text-neon">{s.tag}</span> · {s.out}</span>
        </p>
      </motion.div>
    </motion.li>
  );
}

export function Journey() {
  const ref = useRef(null);
  const p = useScrollMV(ref, (r, vh) => clamp((vh * 0.75 - r.top) / Math.max(1, r.height * 0.7), 0, 1));
  const line = useSpring(p, { stiffness: 120, damping: 26 });
  // Al tocar una etapa se resalta, la línea llega hasta ella y el núcleo da un pulso
  const [sel, setSel] = useState(null);
  const selMV = useMotionValue(0);
  const selSpring = useSpring(selMV, { stiffness: 120, damping: 20 });
  const prog = useTransform([line, selSpring], ([a, b]) => Math.max(a, b));
  const onSelect = (i) => {
    const next = sel === i ? null : i;
    setSel(next);
    selMV.set(next === null ? 0 : next / 3);
    if (next !== null) window.dispatchEvent(new Event("portfolio:burst"));
  };
  return (
    <section id="trayectoria" aria-labelledby="trayectoria-title" className="gutter py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHead id="trayectoria-title" eyebrow="// trayectoria" title="Mi trayectoria"
          text="Soy junior, pero ya he trabajado en producción con un cliente real y en equipo." />
        <p className="font-mono -mt-6 mb-8 text-[11px] uppercase tracking-widest" style={{ color: "var(--fg-mute)" }}>Toca un hito para destacarlo</p>
        <div ref={ref} className="relative">
          <div aria-hidden="true" className="absolute left-0 right-0 top-[27px] hidden h-px bg-white/10 lg:block">
            <motion.div style={{ scaleX: prog }} className="h-full origin-left bg-gradient-to-r from-neon to-volt" />
          </div>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((s, i) => <JourneyStep key={s.n} s={s} i={i} prog={prog} selected={sel === i} dim={sel !== null && sel !== i} onSelect={onSelect} />)}
          </ol>
        </div>
        <dl className="mt-10 grid gap-3 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="glass flex flex-col-reverse rounded-2xl px-5 py-6 text-center">
              <dt className="mt-1 text-sm" style={{ color: "var(--fg-soft)" }}>{s.label}</dt>
              <dd className="font-display grad-text text-4xl font-bold sm:text-5xl">{s.text ? s.text : <CountUp to={s.to} suffix={s.suffix} />}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
