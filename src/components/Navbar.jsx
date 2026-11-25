import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { PROFILE, NAV, SECTION_IDS, SECTION_TO_NAV } from "../data/content";
import { EASE } from "../lib/motion";
import { useFx } from "../lib/fx";
import { navClick } from "../lib/nav";

/* ---------- Navbar ---------- */
export function Navbar() {
  const { ready } = useFx();
  const [section, setSection] = useState("inicio");
  const active = SECTION_TO_NAV[section] || "inicio";
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setSection(en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    SECTION_IDS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }} animate={ready ? { y: 0, opacity: 1 } : { y: -40, opacity: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
      className="fixed inset-x-0 z-50 flex justify-center pointer-events-none gutter"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)" }}>
      <nav aria-label="Principal" className="glass pointer-events-auto relative flex max-w-full items-center gap-1 overflow-hidden rounded-full py-1.5 pl-1.5 pr-1.5 shadow xs:pl-4-[0_8px_40px_rgba(0,0,0,0.5)]">
        <a href="#inicio" onClick={navClick("inicio")} className="font-mono mr-1 hidden text-sm font-medium tracking-tight text-white xs:inline sm:mr-3" aria-label="Ir al inicio">
          {PROFILE.initials}<span className="blink text-neon">_</span>
        </a>
        <ul className="flex items-center gap-0.5">
          {NAV.map(({ id, label }) => (
            <li key={id}>
              <a href={"#" + id} onClick={navClick(id)} aria-current={active === id ? "true" : undefined}
                className={"relative block rounded-full px-2 py-2.5 text-xs font-medium transition-colors xs:px-2.5 xs:text-[13px] sm:px-4 sm:text-sm " + (active === id ? "text-white" : "text-white/60 hover:text-white")}>
                {active === id && <motion.span layoutId="navpill" className="absolute inset-0 rounded-full bg-white/10" style={{ boxShadow: "inset 0 0 0 1px rgba(0,240,255,.35)" }} transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative">{label}</span>
              </a>
            </li>
          ))}
        </ul>
        <motion.span aria-hidden="true" style={{ scaleX: progress }} className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-neon to-volt" />
      </nav>
    </motion.header>
  );
}
