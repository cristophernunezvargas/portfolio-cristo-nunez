/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // Los estados hover solo se aplican en dispositivos con ratón (evita que se queden pegados al tocar)
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      screens: { xs: "380px" },
      colors: { ink: "#050508", neon: "#00f0ff", volt: "#7000ff" },
      fontFamily: {
        display: ["Space Grotesk", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
