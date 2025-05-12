import { defineConfig } from "vite";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(dirname(fileURLToPath(import.meta.url)), "src"),
    },
  },
  server: {
    host: true, // needed for Docker
    port: 5173,
    watch: {
      usePolling: true, // needed for Docker
    },
  },
});
