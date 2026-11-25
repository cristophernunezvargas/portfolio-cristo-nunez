import { useState, useEffect, useRef } from "react";
import { MotionConfig } from "framer-motion";
import { FxContext } from "./lib/fx";
import { useSystemReduce } from "./hooks";
import { userMoved, markUserMoved } from "./lib/nav";
import { Scene } from "./scene/Scene";
import { Cursor, Divider } from "./components/ui";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Manifesto } from "./components/Manifesto";
import { Stack } from "./components/Stack";
import { Projects } from "./components/Projects";
import { Journey } from "./components/Journey";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { FxToggle } from "./components/FxToggle";

export function App() {
  const sysReduce = useSystemReduce();
  const [override, setOverride] = useState(() => {
    try { const v = window.localStorage.getItem("portfolio-fx"); return v === "full" || v === "calm" || v === "paused" ? v : null; } catch { return null; }
  });
  const fx = override || (sysReduce ? "calm" : "full");
  const calm = fx !== "full";
  const [ready, setReady] = useState(false);
  const fxRef = useRef(fx);
  fxRef.current = fx;

  useEffect(() => {
    const d = document.documentElement;
    d.setAttribute("data-fx", fx);
    if (calm) d.setAttribute("data-calm", ""); else d.removeAttribute("data-calm");
  }, [fx]);

  // Arranque: espera fuentes y dos fotogramas; entonces retira la carga y lanza la entrada del núcleo
  useEffect(() => {
    let alive = true;
    const fonts = document.fonts && document.fonts.load
      ? Promise.all([document.fonts.load('700 48px "Space Grotesk"'), document.fonts.load('400 16px "Inter"'), document.fonts.load('500 12px "JetBrains Mono"')]).catch(() => null)
      : Promise.resolve();
    Promise.race([fonts, new Promise((r) => setTimeout(r, 1800))]).then(() => {
      if (!alive) return;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!alive) return;
        setReady(true);
        window.dispatchEvent(new Event("portfolio:ready"));
        const b = document.getElementById("boot"); if (b) b.classList.add("done");
      }));
    });
    return () => { alive = false; };
  }, []);

  // Siempre arranca en el hero: sin restaurar el scroll previo ni saltar a un #hash guardado.
  // Deja de intervenir en cuanto la persona mueve la página.
  useEffect(() => {
    const mark = () => { markUserMoved(); };
    const top = () => {
      if (userMoved) return;
      try { if (window.location.hash) window.history.replaceState(null, "", window.location.href.split("#")[0]); } catch {}
      if (window.scrollY > 0) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };
    window.addEventListener("wheel", mark, { passive: true });
    window.addEventListener("touchstart", mark, { passive: true });
    window.addEventListener("pointerdown", mark, { passive: true });
    window.addEventListener("keydown", mark);
    window.addEventListener("load", top);
    window.addEventListener("hashchange", top);
    top();
    const ts = [300, 900, 1800, 3200].map((ms) => setTimeout(top, ms));
    return () => {
      ts.forEach(clearTimeout);
      window.removeEventListener("wheel", mark); window.removeEventListener("touchstart", mark);
      window.removeEventListener("pointerdown", mark); window.removeEventListener("keydown", mark);
      window.removeEventListener("load", top); window.removeEventListener("hashchange", top);
    };
  }, []);

  const cycle = () => {
    const next = fx === "full" ? "calm" : fx === "calm" ? "paused" : "full";
    setOverride(next);
    try { window.localStorage.setItem("portfolio-fx", next); } catch {}
  };
  const skip = (e) => { e.preventDefault(); const m = document.getElementById("contenido"); if (m) m.focus(); };

  return (
    <MotionConfig reducedMotion={calm ? "always" : "never"}>
      <FxContext.Provider value={{ fx, calm, ready }}>
        <a href="#contenido" className="skip-link" onClick={skip}>Saltar al contenido</a>
        <Scene fxRef={fxRef} />
        <div className="fallback-orb" aria-hidden="true" />
        <Cursor enabled={!calm} />
        <Navbar />
        <div aria-hidden="true" className="gutter pointer-events-none fixed left-0 z-[8] hidden lg:block" style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}>
          <span id="hud" className="hud font-mono whitespace-pre text-[11px] uppercase tracking-widest" style={{ color: "var(--fg-mute)" }}>INICIO      x  0.00  y  0.00  rot 000°</span>
        </div>
        <main id="contenido" tabIndex={-1} className="relative z-10">
          <Hero />
          <Manifesto />
          <Stack />
          <Divider />
          <Projects />
          <Divider />
          <Journey />
          <Divider />
          <Contact />
        </main>
        <Footer />
        <FxToggle fx={fx} onCycle={cycle} />
      </FxContext.Provider>
    </MotionConfig>
  );
}
