import { Sparkles, Wind, Pause, X } from "lucide-react";

// Control de efectos: completos, suaves o en pausa.
// Si el sistema pide menos movimiento y la persona aún no eligió, se ofrece activar los efectos completos.
export function FxToggle({ fx, onCycle, hint, onFull, onDismiss }) {
  const label = fx === "full" ? "Efectos completos" : fx === "calm" ? "Efectos suaves" : "Efectos en pausa";
  const Icon = fx === "full" ? Sparkles : fx === "calm" ? Wind : Pause;
  const right = "max(16px, env(safe-area-inset-right, 0px))";
  return (
    <>
      {hint && (
        <div role="status" className="glass fixed z-40 w-[min(320px,calc(100vw-32px))] rounded-2xl p-4 text-sm"
          style={{ right, bottom: "calc(env(safe-area-inset-bottom, 0px) + 72px)" }}>
          <button type="button" onClick={onDismiss} aria-label="Cerrar aviso y mantener efectos suaves"
            className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:text-white">
            <X size={16} aria-hidden="true" />
          </button>
          <p className="pr-7" style={{ color: "var(--fg-soft)" }}>Tu sistema reduce el movimiento, así que estás viendo la versión suave.</p>
          <button type="button" onClick={onFull} className="btn btn-neon btn-sm mt-3 w-full">Activar efectos completos</button>
        </div>
      )}
      <button type="button" onClick={onCycle} aria-label={label + ". Pulsa para cambiar."} title={label}
        className="glass fixed z-40 flex h-11 items-center gap-2 rounded-full px-3.5 text-white/80 transition-colors hover:border-neon/60 hover:text-neon"
        style={{ right, bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}>
        <Icon size={16} aria-hidden="true" />
        <span className="font-mono hidden text-[11px] uppercase tracking-widest sm:inline">{label}</span>
      </button>
    </>
  );
}
