import { useContext, createContext } from "react";

// Efectos: "full" (completos), "calm" (suaves, movimiento lento) o "paused" (sin movimiento propio)
export const FxContext = createContext({ fx: "full", calm: false, ready: false });
export const useFx = () => useContext(FxContext);
