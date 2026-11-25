// Navegación por secciones: clic normal con scroll suave; Ctrl/Cmd+clic conserva el comportamiento del navegador
export let userMoved = false;
export function markUserMoved() { userMoved = true; }
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const calm = document.documentElement.hasAttribute("data-calm");
  el.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
}
export function navClick(id) {
  return (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    userMoved = true;
    scrollToSection(id);
  };
}
