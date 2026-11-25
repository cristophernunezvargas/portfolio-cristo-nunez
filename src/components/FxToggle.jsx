import { Sparkles, Wind, Pause } from "lucide-react";

// Control de efectos: completos, suaves o en pausa
export function FxToggle({ fx, onCycle }) {
  const label = fx === "full" ? "Efectos completos" : fx === "calm" ? "Efectos suaves" : "Efectos en pausa";
  const Icon = fx === "full" ? Sparkles : fx === "calm" ? Wind : Pause;
  return (
    <button type="button" onClick={onCycle} aria-label={label + ". Pulsa para cambiar."} title={label}
      className="glass fixed z-40 flex h-11 items-center gap-2 rounded-full px-3.5 text-white/80 transition-colors hover:border-neon/60 hover:text-neon"
      style={{ right: "max(16px, env(safe-area-inset-right, 0px))", bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}>
      <Icon size={16} aria-hidden="true" />
      <span className="font-mono hidden text-[11px] uppercase tracking-widest sm:inline">{label}</span>
    </button>
  );
}
