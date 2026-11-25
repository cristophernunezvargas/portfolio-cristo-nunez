import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { EASE, reveal } from "../lib/motion";
import { useFx } from "../lib/fx";

/* ---------- Interacción ---------- */
// Cursor propio: luz suave, anillo y punto (solo ratón y efectos completos)
export function Cursor({ enabled }) {
  const x = useMotionValue(-1000), y = useMotionValue(-1000);
  const dx = useSpring(x, { stiffness: 700, damping: 45, mass: 0.2 }), dy = useSpring(y, { stiffness: 700, damping: 45, mass: 0.2 });
  const rx = useSpring(x, { stiffness: 170, damping: 20, mass: 0.5 }), ry = useSpring(y, { stiffness: 170, damping: 20, mass: 0.5 });
  const gx = useSpring(x, { stiffness: 60, damping: 18, mass: 0.8 }), gy = useSpring(y, { stiffness: 60, damping: 18, mass: 0.8 });
  const [on, setOn] = useState(false), [hot, setHot] = useState(false);
  useEffect(() => {
    if (!enabled || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const mv = (e) => {
      x.set(e.clientX); y.set(e.clientY); setOn(true);
      const t = e.target;
      setHot(!!(t && t.closest && t.closest("a, button")));
    };
    const out = (e) => { if (!e.relatedTarget) setOn(false); };
    window.addEventListener("pointermove", mv, { passive: true });
    document.addEventListener("pointerout", out);
    return () => { window.removeEventListener("pointermove", mv); document.removeEventListener("pointerout", out); };
  }, [enabled]);
  if (!enabled) return null;
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[5]">
        <motion.div style={{ x: gx, y: gy, marginLeft: -300, marginTop: -300, willChange: "transform", background: "radial-gradient(closest-side, rgba(112,0,255,0.16), rgba(0,240,255,0.04) 60%, transparent)" }}
          animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 0.4 }} className="h-[600px] w-[600px] rounded-full" />
      </div>
      <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100]">
        <motion.div style={{ x: rx, y: ry, marginLeft: -20, marginTop: -20 }} animate={{ scale: hot ? 1.7 : 1, opacity: on ? 1 : 0 }} transition={{ duration: 0.2 }}
          className="h-10 w-10 rounded-full border border-neon/60">
          <div className="h-full w-full rounded-full" style={{ background: hot ? "rgba(0,240,255,.12)" : "transparent" }} />
        </motion.div>
        <motion.div style={{ x: dx, y: dy, marginLeft: -3, marginTop: -3 }} animate={{ opacity: on ? 1 : 0 }} className="h-1.5 w-1.5 rounded-full bg-neon" />
      </div>
    </>
  );
}

// El botón se acerca al cursor
export function Magnetic({ children, strength = 0.3 }) {
  const { calm } = useFx();
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 }), sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const move = (e) => {
    if (calm || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x.set(0); y.set(0); };
  return <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ x: sx, y: sy }} className="inline-block">{children}</motion.div>;
}

// Texto que se "descifra" letra a letra
export function Scramble({ text, start, delay = 0, className, style }) {
  const ref = useRef(null);
  const { calm } = useFx();
  useEffect(() => {
    const el = ref.current; if (!el || !start) return;
    if (calm) { el.style.visibility = "visible"; el.textContent = text; return; }
    const chars = "01<>/{}[]#$%&*+=-_";
    let frame = 0, iv = 0;
    const t = setTimeout(() => {
      el.style.visibility = "visible";
      iv = setInterval(() => {
        frame++;
        const done = Math.floor(frame / 1.5);
        let out = "";
        for (let i = 0; i < text.length; i++) out += i < done || text[i] === " " ? text[i] : chars[Math.floor(Math.random() * chars.length)];
        el.textContent = out;
        if (done > text.length) { clearInterval(iv); el.textContent = text; }
      }, 34);
    }, delay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text, calm, start]);
  return <p className={className} style={style}><span className="sr-only">{text}</span><span ref={ref} aria-hidden="true" style={{ visibility: "hidden" }}>{text}</span></p>;
}

// Cifra que cuenta hasta su valor al entrar en pantalla
export function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const { calm } = useFx();
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (calm) { el.textContent = to + suffix; return; }
    el.textContent = "0" + suffix;
    let raf = 0, started = false;
    const finish = setTimeout(() => { if (!started) { started = true; el.textContent = to + suffix; } }, 8000);
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting || started) return;
      started = true; io.disconnect(); clearTimeout(finish);
      const t0 = performance.now(), dur = 1400;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))) + suffix;
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(finish); cancelAnimationFrame(raf); };
  }, [to, suffix, calm]);
  return <span ref={ref} className="tabular-nums">{to}{suffix}</span>;
}

// Título que sube palabra por palabra dentro de una máscara
export function Words({ text, className, style, wordClass }) {
  return (
    <span className={className} style={style}>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: "0.14em", marginBottom: "-0.14em" }}>
          <motion.span className={"inline-block " + (wordClass || "")} variants={{ hidden: { y: "115%" }, show: { y: 0, transition: { duration: 0.75, delay: i * 0.08, ease: EASE } } }}>{w}&nbsp;</motion.span>
        </span>
      ))}
    </span>
  );
}

export function SectionHead({ id, eyebrow, title, text }) {
  return (
    <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mb-12 max-w-2xl">
      <p className="font-mono flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-neon">
        <span aria-hidden="true" className="h-px w-8 bg-neon/60" />{eyebrow}
      </p>
      <h2 id={id} className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl"><Words text={title} /></h2>
      {text && <p className="mt-4 text-base sm:text-lg" style={{ color: "var(--fg-soft)" }}>{text}</p>}
    </motion.div>
  );
}

export function Divider() {
  return (
    <div className="gutter" aria-hidden="true">
      <motion.div initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }} viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 1.1, ease: EASE }} className="divider mx-auto h-px w-full max-w-6xl origin-center" />
    </div>
  );
}
