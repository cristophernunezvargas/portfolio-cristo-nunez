import { ArrowUp } from "lucide-react";
import { PROFILE } from "../data/content";
import { scrollToSection, markUserMoved } from "../lib/nav";

export function Footer() {
  return (
    <footer className="gutter relative z-10 pb-24">
      <div className="font-mono mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[11px] uppercase tracking-widest sm:flex-row" style={{ color: "var(--fg-mute)" }}>
        <span>© 2026 {PROFILE.first} {PROFILE.last}</span>
        <span>React · Three.js · Framer&nbsp;Motion</span>
        <button type="button" onClick={() => { markUserMoved(); scrollToSection("inicio"); }}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 uppercase tracking-widest transition-colors hover:text-neon">
          <ArrowUp size={14} aria-hidden="true" /> Volver arriba
        </button>
      </div>
    </footer>
  );
}
