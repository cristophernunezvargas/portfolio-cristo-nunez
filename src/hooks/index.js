import { useState, useEffect, useCallback } from "react";
import { useMotionValue } from "framer-motion";

export function useSystemReduce() {
  const get = () => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; } };
  const [r, setR] = useState(get);
  useEffect(() => {
    let mq; try { mq = window.matchMedia("(prefers-reduced-motion: reduce)"); } catch { return; }
    const on = () => setR(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", on); else mq.addListener(on);
    return () => { if (mq.removeEventListener) mq.removeEventListener("change", on); else mq.removeListener(on); };
  }, []);
  return r;
}

// Progreso medido desde la posición real del elemento, con un solo cálculo por fotograma
export function useScrollMV(ref, compute) {
  const mv = useMotionValue(0);
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const el = ref.current; if (!el) return;
      mv.set(compute(el.getBoundingClientRect(), window.innerHeight, el));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    const t = setTimeout(run, 1200);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return mv;
}

export function useSpotlight() {
  return useCallback((e) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - r.left + "px");
    el.style.setProperty("--my", e.clientY - r.top + "px");
  }, []);
}
