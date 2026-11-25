# Portafolio de Cristopher Núñez

Portafolio inmersivo con núcleo 3D en WebGL, scroll narrativo y animaciones. Interfaz en **React + Vite + Tailwind**, 3D con **Three.js**, animación con **Framer Motion** y servidor de producción en **Node + Express**.

## Requisitos

- Node.js 20 o superior (probado con 22)

## Uso

```bash
npm install

# Desarrollo: Vite en http://localhost:5173 (con recarga en caliente)
npm run dev

# Producción: compila y sirve con Express en http://localhost:3000
npm run serve
```

Otros comandos:

| Comando | Qué hace |
| --- | --- |
| `npm run build` | Compila la interfaz en `dist/` |
| `npm start` | Sirve `dist/` con Express (`PORT` cambia el puerto) |
| `npm run preview` | Vista previa de la compilación con Vite |
| `npm run lint` | Revisa el código con ESLint |

Si necesitas la API en desarrollo, levanta `npm start` en otra terminal: Vite reenvía `/api` al puerto 3000.

## Dónde editar tu contenido

Todo el texto está en **`src/data/content.js`**:

- `PROFILE`: nombre, titulación, frase de presentación, correo, GitHub y LinkedIn.- `CREDENTIALS`: certificaciones y colegiatura que aparecen como pastillas discretas bajo los botones del inicio.
- `STACK`: tecnologías (nombre, categoría e icono de Lucide).
- `PROJECTS`: tus proyectos. Para mostrar los botones Demo y Código añade `links: { demo: "https://...", code: "https://..." }`. Sin enlaces aparece "Pedir detalles".
- `ALSO`: otras tecnologías con las que has trabajado (lista secundaria bajo el stack).
- `JOURNEY` y `STATS`: tu trayectoria (hitos cronológicos, cada tarjeta es interactiva) y cifras. Las cifras con `text` se muestran tal cual y las demás cuentan al entrar en pantalla.
- `PROFILE.cv`: ruta del CV. El archivo está en `public/CV_Cristopher_Nunez_Vargas.pdf`; para actualizarlo, reemplaza ese PDF y conserva el nombre.
- `MANIFESTO`: las palabras de la sección fija del inicio.

## Estructura

```
server/index.js        Servidor Express: archivos de dist/, /api/health y fallback del SPA
src/
  App.jsx              Composición de la página, modo de efectos y arranque
  data/content.js      Contenido editable
  scene/Scene.jsx      Núcleo 3D (Three.js): líneas suaves, anillos, etiquetas, partículas
  components/          Navbar, Hero, Manifesto, Stack, Projects, Process, Contact, Footer, FxToggle, ui
  hooks/index.js       Progreso de scroll, preferencia de movimiento reducido, foco de luz
  lib/                 Animaciones comunes, contexto de efectos y navegación
  index.css            Estilos globales (Tailwind + capas de atmósfera)
```

## Móvil y responsive

Diseñado desde 320 px de ancho hasta escritorio. Puntos de corte: `xs` 380 px (menú con marca), `sm` 640 px, `md` 768 px y `lg` 1024 px.

- Tamaños fluidos para el nombre (`.hero-name`) y las palabras del manifiesto (`.mani-word`), definidos en `src/index.css`.
- Los estados `hover` solo se aplican en dispositivos con ratón (`hoverOnlyWhenSupported` y `@media (hover: hover)`), así que no se quedan pegados al tocar.
- En pantallas táctiles se quita el grano, se aligera el desenfoque y se limita la resolución del canvas a 1.5x.
- En móvil no se dibujan las etiquetas orbitando el núcleo y el plano de tecnologías se inclina menos.
- La escena ignora los cambios de alto pequeños que provoca la barra del navegador al hacer scroll.
- Para revisar anchos de teléfono sin dispositivo, abre las herramientas de desarrollo del navegador y usa el modo dispositivo.

## Notas

- **Efectos**: el botón de la esquina inferior derecha alterna entre efectos completos, suaves y en pausa, y recuerda la elección. Con "reducir movimiento" activado en el sistema arranca en suaves.
- **Versiones fijas**: `three` (0.128), `framer-motion` (10.18) y `lucide-react` (0.263) están fijadas a propósito. Las líneas suaves del núcleo usan shaders que dependen de la gestión de color de Three r128; actualizar `three` cambia el aspecto.
- **Rendimiento**: el paquete JavaScript pesa unos 825 kB (230 kB comprimido), sobre todo por Three.js. Si quieres reducirlo, el siguiente paso es cargar `Scene` con `React.lazy`.
