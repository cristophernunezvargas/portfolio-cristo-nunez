import {
  Award, BadgeCheck, Atom, Braces, Server, Database, Palette, Zap, Layers, Table, Workflow,
  Wind, FileCode, ShieldCheck, GitBranch, Container, Cloud, Users, Laptop, GraduationCap,
} from "lucide-react";

/* ---------- Contenido editable ---------- */
export const PROFILE = {
  first: "Cristopher",
  last: "Núñez",
  initials: "CN",
  role: "Junior Full-Stack Developer",
  degree: "Graduado en Ingeniería en Sistemas de la Computación",
  blurb: "Desarrollador full-stack junior con 16 meses de experiencia en producción. Construyo aplicaciones web con React, Node.js y Laravel, trabajo bien en equipo y sigo aprendiendo.",
  location: "San José, Costa Rica",
  availability: "Disponibilidad inmediata",
  email: "crisnuva1427@gmail.com",
  github: "https://github.com/cristophernunezvargas",
  linkedin: "https://www.linkedin.com/in/cristophernunezvargas/",
  // El PDF está en public/. Si lo cambias, conserva el nombre o actualiza esta ruta.
  cv: "/CV_Cristopher_Nunez_Vargas.pdf",
  // Temporal: enlace al portafolio anterior. Bórralo cuando ya no haga falta.
  oldPortfolio: "https://portfoliocristo.netlify.app/",
};
// Credenciales: se muestran de forma discreta bajo los botones del inicio
export const CREDENTIALS = [
  { label: "Python · PCEP", full: "PCEP, Certified Entry-Level Python Programmer (Python Institute)", Icon: Award },
  { label: "Colegiado · CPIC", full: "Colegio Profesional de Ingenieros en Computación", Icon: BadgeCheck },
];
export const NAV = [
  { id: "inicio", label: "Inicio" },
  { id: "stack", label: "Stack" },
  { id: "proyectos", label: "Proyectos" },
  { id: "contacto", label: "Contacto" },
];
export const SECTION_IDS = ["inicio", "manifiesto", "stack", "proyectos", "trayectoria", "contacto"];
export const SECTION_NAMES = ["INICIO", "PRINCIPIOS", "STACK", "PROYECTOS", "TRAYECTORIA", "CONTACTO"];
export const SECTION_TO_NAV = { inicio: "inicio", manifiesto: "inicio", stack: "stack", proyectos: "proyectos", trayectoria: "proyectos", contacto: "contacto" };
export const MANIFESTO = [
  { w: "Diseño", d: "Interfaces claras y ordenadas, pensadas para quien las usa." },
  { w: "Código", d: "Código limpio y legible, que un equipo pueda mantener." },
  { w: "Movimiento", d: "Animación y 3D con propósito, como en esta página." },
  { w: "Rendimiento", d: "Medir y optimizar: en un proyecto real pasé la carga de 10 s a 1 s." },
];
// Tecnologías que uso en mis proyectos (se muestran como tarjetas 3D; 16 llenan la cuadrícula de 4 columnas)
export const STACK = [
  { name: "React", tag: "Frontend", Icon: Atom },
  { name: "Node.js", tag: "Backend", Icon: Server },
  { name: "JavaScript", tag: "Lenguaje", Icon: FileCode },
  { name: "Tailwind", tag: "Estilos", Icon: Wind },
  { name: "Laravel", tag: "Framework PHP", Icon: Layers },
  { name: "Livewire", tag: "UI reactiva", Icon: Zap },
  { name: "MaryUI", tag: "Componentes UI", Icon: Palette },
  { name: "Eloquent", tag: "ORM", Icon: Table },
  { name: "PHP", tag: "Lenguaje", Icon: Braces },
  { name: "PHPUnit", tag: "Pruebas", Icon: ShieldCheck },
  { name: "MySQL", tag: "Base de datos", Icon: Database },
  { name: "PostgreSQL", tag: "Base de datos", Icon: Database },
  { name: "n8n", tag: "Automatización", Icon: Workflow },
  { name: "Docker", tag: "Contenedores", Icon: Container },
  { name: "AWS", tag: "Nube", Icon: Cloud },
  { name: "Git", tag: "Versionado", Icon: GitBranch },
];
// Otras tecnologías con las que he trabajado (se muestran como una lista secundaria)
export const ALSO = ["Java", "Spring Boot", "Oracle", "MongoDB", "Firebase", "FlutterFlow"];
// Enlaces opcionales por proyecto: links: { demo: "https://...", code: "https://..." }
export const PROJECTS = [
  { title: "Gestión de proyectos", kind: "kanban", featured: true, meta: "Equipo de 3 · 1 año",
    text: "Sistema de gestión de proyectos desarrollado durante un año junto a otros dos desarrolladores.",
    tags: ["Laravel", "Livewire", "MaryUI", "Eloquent", "MySQL"] },
  { title: "Costos y rentabilidad de flota", kind: "chart", meta: "En desarrollo",
    text: "Sistema para una empresa de transporte de carga: costo real y rentabilidad por camión, viaje y ruta, mantenimiento y reportes en PDF.",
    tags: ["Laravel", "Livewire", "Tailwind", "MySQL", "PHPUnit"],
    links: { code: "https://github.com/cristophernunezvargas/transport_bussines_ai" } },
  { title: "Finanzas y hábitos", kind: "tracker", meta: "En desarrollo",
    text: "Proyecto personal para llevar el control de tus propias finanzas y hábitos en un solo lugar.",
    tags: ["React", "Node.js", "PostgreSQL"] },
  { title: "Landing de Innova CR", kind: "landing", meta: "SPA",
    text: "Página de presentación para Innova CR, empresa de construcción de Costa Rica, hecha como SPA.",
    tags: ["React", "Node.js"],
    links: { demo: "https://innova.co.cr/" } },
  { title: "Registro de horas", kind: "flow", meta: "En AWS",
    text: "Automatización que registra entradas, salidas y actividades, y envía un reporte semanal de horas y monto por usuario.",
    tags: ["n8n", "Docker", "AWS"] },
  { title: "Punto de venta", kind: "pos", featured: true, meta: "Completado",
    text: "Sistema de punto de venta para comida rápida, con Node.js en el backend y React en el frontend.",
    tags: ["React", "Node.js"] },
  { title: "Frutos del Térraba", kind: "inventory", wideMd: true, meta: "En desarrollo",
    text: "Plataforma web para gestionar pedidos, inventario y reportes en PDF.",
    tags: ["Laravel", "Livewire", "Tailwind", "MySQL", "DOMPDF"] },
];
// Trayectoria: hitos reales en orden cronológico (cada tarjeta es interactiva)
export const JOURNEY = [
  { n: "01", t: "Equipo remoto", d: "16 meses con otros 3 desarrolladores en una plataforma de gestión de proyectos para un cliente real.", tag: "Logro", out: "Carga de 10 s a 1 s", Icon: Users },
  { n: "02", t: "Freelance", d: "Desde noviembre de 2025 desarrollo con Laravel, React y Node.js, y automatizo procesos con n8n, Docker y AWS.", tag: "Foco", out: "Proyectos reales", Icon: Laptop },
  { n: "03", t: "Graduación", d: "Ingeniería de Sistemas de Computación en la Universidad Fidélitas, junio de 2026. Colegiado en el CPIC.", tag: "Mención", out: "Nominado a proyecto más innovador", Icon: GraduationCap },
  { n: "04", t: "Siempre aprendiendo", d: "PCEP de Python, React y Next.js, redes y ciberseguridad con Cisco. AWS Cloud Practitioner en curso.", tag: "Ahora", out: "AWS Cloud Practitioner", Icon: Award },
];
// Cifras tomadas de tu CV; las que llevan "text" se muestran tal cual, sin contador
export const STATS = [
  { to: 16, suffix: " meses", label: "de experiencia en producción" },
  { text: "10 s → 1 s", label: "carga de la interfaz tras optimizarla" },
  { text: "B2", label: "nivel de inglés" },
];
