import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En desarrollo, Vite sirve la interfaz (5173) y reenvía /api al servidor de Express (3000).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:3000" },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
