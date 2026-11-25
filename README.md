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
- `MANIFESTO`: los cuatro principios, que se muestran como tarjetas estáticas.

## Estructura

```
server/index.js        Servidor Express: archivos de dist/, /api/health y fallback del SPA
src/
  App.jsx              Composición de la página, modo de efectos y arranque
  data/content.js      Contenido editable
  scene/Scene.jsx      Escena 3D (Three.js): anillos, etiquetas, partículas, brillo y cámara
  scene/die.js         Dado de 42 caras con símbolos (el núcleo)
  components/          Navbar, Hero, Manifesto, Stack, Projects, Journey, Contact, Footer, FxToggle, ui
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
- El núcleo es un dado de 42 caras (`src/scene/die.js`): 12 pentágonos y 30 hexágonos de cristal, cada uno con un símbolo. Son solo dos mallas y un atlas de 59 símbolos (23 dibujos, 10 dígitos y 26 letras). Diez de los dibujos son los de la rueda de Bill, uno por personaje: pino, estrella fugaz, media luna, mano de seis dedos, signo de interrogación, bolsa de hielo, lentes, estrella con ojo, llama y corazón cosido. Con los efectos completos, un par de caras cambia de símbolo al azar cada ~1 s (el 4 pesa cinco veces más, como en el dado de la serie) y un clic o toque "tira" el dado: todas las caras se mezclan. Para cambiar los símbolos edita `SYMBOLS` y `KINDS` en ese archivo. El texto del inicio lleva un halo oscuro para leerse encima.
- En teléfono la escena se dibuja hasta a 2x con antialiasing activo.
- La escena limita el total de píxeles que dibuja y baja la calidad en dos niveles si los fotogramas tardan (ver `Scene.jsx`).
- La escena ignora los cambios de alto pequeños que provoca la barra del navegador al hacer scroll.
- Para revisar anchos de teléfono sin dispositivo, abre las herramientas de desarrollo del navegador y usa el modo dispositivo.

## Notas

- **Efectos**: el botón de la esquina inferior derecha alterna entre efectos completos, suaves y en pausa, y recuerda la elección. Con "reducir movimiento" activado en el sistema arranca en suaves.
- **Versiones fijas**: `three` (0.128), `framer-motion` (10.18) y `lucide-react` (0.263) están fijadas a propósito. Las líneas suaves del núcleo usan shaders que dependen de la gestión de color de Three r128; actualizar `three` cambia el aspecto.
- **Rendimiento**: el paquete JavaScript pesa unos 825 kB (230 kB comprimido), sobre todo por Three.js. Si quieres reducirlo, el siguiente paso es cargar `Scene` con `React.lazy`.
