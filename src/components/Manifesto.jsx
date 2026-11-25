import { motion } from "framer-motion";
import { MANIFESTO } from "../data/content";
import { reveal } from "../lib/motion";
import { SectionHead } from "./ui";

/* ---------- Principios: cuatro tarjetas estáticas (sin animación ligada al scroll) ---------- */
export function Manifesto() {
  return (
    <section id="manifiesto" aria-labelledby="principios-title" className="gutter pb-8 pt-28 sm:pt-36">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHead id="principios-title" eyebrow="// principios" title="Cómo construyo" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MANIFESTO.map((m, i) => (
            <motion.li key={m.w} custom={i} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
              className="glass min-w-0 rounded-2xl p-6">
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">{m.w}<span className="text-neon">.</span></h3>
              <p className="mt-3" style={{ color: "var(--fg-soft)" }}>{m.d}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
