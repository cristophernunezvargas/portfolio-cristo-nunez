import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronDown, Download, GraduationCap } from "lucide-react";
import { PROFILE, CREDENTIALS } from "../data/content";
import { fadeUp, LETTER_FULL, LETTER_CALM } from "../lib/motion";
import { useFx } from "../lib/fx";
import { navClick } from "../lib/nav";
import { Magnetic, Scramble } from "./ui";

/* ---------- Hero: el nombre delante del núcleo ---------- */
export function Hero() {
  const { calm, ready } = useFx();
  const [glitch, setGlitch] = useState(false);
  const timer = useRef(0);
  const { scrollY } = useScroll();
  const hy = useTransform(scrollY, [0, 520], [0, -140]);
  const ho = useTransform(scrollY, [0, 400], [1, 0]);
  const hs = useTransform(scrollY, [0, 520], [1, 0.9]);
  const fire = useCallback(() => {
    if (calm) return;
    setGlitch(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setGlitch(false), 760);
  }, [calm]);
  useEffect(() => { if (!ready) return; const t = setTimeout(fire, 1500); return () => clearTimeout(t); }, [ready, fire]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const letterV = calm ? LETTER_CALM : LETTER_FULL;
  const word = (text, start, cls) => (
    <span className={"inline-block whitespace-nowrap " + (cls || "")} aria-hidden="true">
      {text.split("").map((ch, i) => (
        <motion.span key={i} className="inline-block" variants={letterV} custom={start + i} initial="hidden" animate={ready ? "show" : "hidden"}>{ch}</motion.span>
      ))}
    </span>
  );
  const fullName = PROFILE.first + " " + PROFILE.last;
  const scrollStyle = calm ? {} : { y: hy, opacity: ho, scale: hs };
  const stage = ready ? "show" : "hidden";

  return (
    <section id="inicio" aria-label="Presentación" className="hero-glow relative flex min-h-[100svh] items-center justify-center">
      <motion.div style={scrollStyle} className="gutter mx-auto w-full max-w-6xl py-28 text-center">
        <motion.p variants={fadeUp} custom={0.1} initial="hidden" animate={stage}
          className="font-mono mb-6 inline-flex flex-col items-center gap-2 text-center text-xs uppercase tracking-[0.2em] sm:flex-row sm:gap-3" style={{ color: "var(--fg-soft)" }}>
          <GraduationCap size={16} className="shrink-0 text-neon" aria-hidden="true" />
          {PROFILE.degree}
        </motion.p>

        <h1 aria-label={fullName} data-text={fullName} onMouseEnter={fire}
          className={"glitch name-shadow font-display font-bold uppercase leading-[0.95] tracking-tight hero-name " + (glitch ? "on" : "")}>
          {word(PROFILE.first, 0)}{" "}{word(PROFILE.last, PROFILE.first.length + 1, "grad-text")}
        </h1>

        <Scramble text={PROFILE.role} start={ready} delay={900} className="font-display mt-7 text-xl font-medium tracking-wide sm:text-2xl" style={{ color: "var(--neon)" }} />
        <motion.p variants={fadeUp} custom={1.3} initial="hidden" animate={stage}
          className="mx-auto mt-4 max-w-xl text-base sm:text-lg" style={{ color: "var(--fg-soft)" }}>
          {PROFILE.blurb}
        </motion.p>

        <motion.div variants={fadeUp} custom={1.5} initial="hidden" animate={stage} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Magnetic><a href="#proyectos" onClick={navClick("proyectos")} className="btn btn-neon">Ver proyectos <ArrowUpRight size={18} aria-hidden="true" /></a></Magnetic>
          <Magnetic><a href={PROFILE.cv} download className="btn btn-ghost">Descargar CV <Download size={18} aria-hidden="true" /></a></Magnetic>
        </motion.div>

        <motion.ul variants={fadeUp} custom={1.7} initial="hidden" animate={stage} aria-label="Credenciales"
          className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {CREDENTIALS.map(({ label, full, Icon }) => (
            <li key={label} title={full} className="font-mono inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[11px] uppercase tracking-widest" style={{ color: "var(--fg-soft)" }}>
              <Icon size={14} className="shrink-0 text-neon/80" aria-hidden="true" />
              {label}<span className="sr-only">: {full}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <div aria-hidden="true" className="font-mono bob pointer-events-none absolute inset-x-0 flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest" style={{ color: "var(--fg-mute)", bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}>
        Scroll <ChevronDown size={14} />
      </div>
    </section>
  );
}
