import { useRef } from "react";
import { motion, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { MANIFESTO } from "../data/content";
import { clamp } from "../lib/motion";
import { useFx } from "../lib/fx";
import { useScrollMV } from "../hooks";

/* ---------- Manifiesto: texto fijo que cambia con el scroll ---------- */
export function ManifestoWord({ i, p, item }) {
  // Cada palabra sale por completo antes de que entre la siguiente
  const N = MANIFESTO.length;
  const s = i / N, e = (i + 1) / N;
  const first = i === 0, last = i === N - 1;
  const rng = [s + 0.012, s + 0.04, e - 0.04, e - 0.012];
  const rngO = [s + 0.012, s + 0.026, e - 0.026, e - 0.012];
  // La transición es un barrido con máscara más un desplazamiento hacia arriba: el texto nunca se desenfoca
  const opacity = useTransform(p, rngO, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(p, rng, [first ? 0 : 56, 0, 0, last ? 0 : -56]);
  // 66 % es justo donde termina el bloque de texto, centrado en la caja: el barrido se ve en todo el tramo
  const cutTop = useTransform(p, rng, [first ? 0 : 66, 0, 0, 0]);
  const cutBottom = useTransform(p, rng, [0, 0, 0, last ? 0 : 66]);
  const clip = useMotionTemplate`inset(${cutTop}% 0% ${cutBottom}% 0%)`;
  return (
    <motion.div style={{ opacity, y, clipPath: clip, willChange: "opacity, transform, clip-path" }} className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
      <h2 className="mani-word font-display font-bold uppercase leading-none tracking-tight">
        {item.w}<span className="text-neon">.</span>
      </h2>
      <p className="mx-auto mt-6 max-w-md text-base sm:text-lg" style={{ color: "var(--fg-soft)" }}>{item.d}</p>
    </motion.div>
  );
}

export function Manifesto() {
  const { calm } = useFx();
  const ref = useRef(null);
  const prog = useScrollMV(ref, (r, vh, el) => {
    const stick = el.firstElementChild ? el.firstElementChild.offsetHeight : vh;
    const range = r.height - stick;
    return range > 0 ? clamp(-r.top / range, 0, 1) : 0;
  });
  const bar = useSpring(prog, { stiffness: 140, damping: 26 });
  if (calm) {
    return (
      <section id="manifiesto" aria-label="Principios" className="gutter py-24">
        <ul className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {MANIFESTO.map((m) => (
            <li key={m.w} className="glass min-w-0 rounded-2xl p-6">
              <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">{m.w}<span className="text-neon">.</span></h2>
              <p className="mt-3" style={{ color: "var(--fg-soft)" }}>{m.d}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  }
  return (
    <section id="manifiesto" aria-label="Principios" ref={ref} className="mani-track relative">
      <div className="gutter sticky top-0 flex items-center justify-center overflow-hidden" style={{ height: "100svh" }}>
        <p aria-hidden="true" className="mani-label font-mono absolute left-0 right-0 top-24 text-center text-xs uppercase tracking-[0.2em] text-neon">// principios</p>
        <div className="relative mx-auto h-[60svh] w-full max-w-6xl">
          {MANIFESTO.map((m, i) => <ManifestoWord key={m.w} i={i} p={prog} item={m} />)}
        </div>
        <div aria-hidden="true" className="absolute left-1/2 h-[2px] w-40 -translate-x-1/2 overflow-hidden rounded-full bg-white/10" style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 40px)" }}>
          <motion.div style={{ scaleX: bar }} className="h-full w-full origin-left bg-gradient-to-r from-neon to-volt" />
        </div>
      </div>
    </section>
  );
}
