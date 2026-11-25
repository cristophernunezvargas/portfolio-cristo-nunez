import js from "@eslint/js";
import react from "eslint-plugin-react";
import globals from "globals";

export default [
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react },
    settings: { react: { version: "18.3" } },
    rules: {
      "react/jsx-uses-vars": "error",
      "react/jsx-no-undef": "error",
      "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
];
