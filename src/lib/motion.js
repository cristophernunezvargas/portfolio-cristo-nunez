/* ---------- Utilidades ---------- */
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const smooth = (t) => t * t * (3 - 2 * t);
export const EASE = [0.22, 1, 0.36, 1];
export const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.07, ease: EASE } }),
};
export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: d, ease: EASE } }),
};
// Variantes de las letras del nombre: constantes, para que un re-render no reinicie la animación
export const LETTER_FULL = {
  hidden: { opacity: 0, y: 60, scale: 1.2 },
  show: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, delay: 0.3 + i * 0.06, ease: EASE } }),
};
export const LETTER_CALM = {
  hidden: { opacity: 0 },
  show: (i) => ({ opacity: 1, transition: { duration: 0.5, delay: 0.1 + i * 0.02 } }),
};
