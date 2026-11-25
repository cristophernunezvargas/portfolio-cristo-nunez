import express from "express";
import compression from "compression";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "..", "dist");
const port = Number(process.env.PORT) || 3000;

if (!fs.existsSync(path.join(dist, "index.html"))) {
  console.error("No existe la carpeta dist. Compila primero con: npm run build");
  process.exit(1);
}

const app = express();
app.disable("x-powered-by");
app.use(compression());
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: Math.round(process.uptime()) });
});
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Archivos compilados: los de /assets llevan hash en el nombre, así que se cachean un año
app.use("/assets", express.static(path.join(dist, "assets"), { immutable: true, maxAge: "1y" }));
// index.html nunca se cachea, para que una nueva versión se vea al recargar
app.use(express.static(dist, {
  maxAge: "1h",
  setHeaders: (res, filePath) => {
    if (filePath.endsWith("index.html")) res.setHeader("Cache-Control", "no-cache");
  },
}));

// Cualquier otra ruta devuelve la aplicación
app.get("/{*splat}", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(dist, "index.html"));
});

app.listen(port, () => {
  console.log(`Portafolio disponible en http://localhost:${port}`);
});
