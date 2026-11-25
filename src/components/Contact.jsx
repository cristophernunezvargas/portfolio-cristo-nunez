import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Copy, Check, Download, MapPin } from "lucide-react";
import { PROFILE } from "../data/content";
import { reveal } from "../lib/motion";
import { Magnetic, Words } from "./ui";

/* ---------- Contacto ---------- */
export function Contact() {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);
  const emailRef = useRef(null);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const flash = (msg) => {
    setToast(msg);
    timers.current.push(setTimeout(() => setToast(null), 2600));
  };
  const copy = async () => {
    window.dispatchEvent(new Event("portfolio:burst"));
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      flash("Correo copiado al portapapeles");
      timers.current.push(setTimeout(() => setCopied(false), 2200));
    } catch {
      const el = emailRef.current;
      if (el) { const r = document.createRange(); r.selectNodeContents(el); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
      flash("Correo seleccionado. Pulsa Ctrl+C para copiarlo");
    }
  };
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="gutter pb-10 pt-24 sm:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          className="glass relative overflow-hidden rounded-3xl px-5 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 80% at 50% 0%, rgba(0,240,255,.12), transparent 70%), radial-gradient(50% 60% at 50% 120%, rgba(112,0,255,.28), transparent 70%)" }} />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-neon">// contacto</p>
            <h2 id="contacto-title" className="font-display mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              <Words text="¿Construimos algo" /><Words text="juntos?" wordClass="grad-text" />
            </h2>
            <p className="mx-auto mt-4 max-w-md" style={{ color: "var(--fg-soft)" }}>Si tienes una oportunidad o un proyecto en mente, escríbeme.</p>
            <p className="font-mono mt-3 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-widest" style={{ color: "var(--fg-mute)" }}>
              <MapPin size={13} className="shrink-0 text-neon/80" aria-hidden="true" />{PROFILE.location} · {PROFILE.availability}
            </p>

            <div className="mx-auto mt-8 flex max-w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <span ref={emailRef} translate="no" className="font-mono min-w-0 break-all rounded-full border border-white/10 bg-black/40 px-5 py-3 text-xs xs:text-sm sm:text-base">{PROFILE.email}</span>
              <Magnetic>
                <button type="button" onClick={copy} className="btn btn-neon w-full" aria-label="Copiar correo electrónico">
                  {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                  {copied ? "Copiado" : "Copiar correo"}
                </button>
              </Magnetic>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><Github size={17} aria-hidden="true" /> GitHub</a>
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><Linkedin size={17} aria-hidden="true" /> LinkedIn</a>
              <a href={PROFILE.cv} download className="btn btn-ghost btn-sm"><Download size={17} aria-hidden="true" /> Descargar CV</a>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 z-[60] flex justify-center gutter" style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}>
        <AnimatePresence>
          {toast && (
            <motion.div key="toast" role="status" aria-live="polite"
              initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="pointer-events-auto flex max-w-full items-center gap-3 rounded-full border border-neon/40 bg-[#0b0b12]/90 px-5 py-3 text-sm shadow-[0_0_30px_rgba(0,240,255,0.25)] backdrop-blur-md">
              <Check size={16} className="shrink-0 text-neon" aria-hidden="true" /> <span>{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
