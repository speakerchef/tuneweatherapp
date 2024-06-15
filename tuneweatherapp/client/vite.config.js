import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cp from "vite-plugin-cp";

export default defineConfig({
  plugins: [
    react(),
    cp({
      targets: [{ src: "public/netlify.yaml", dest: "dist" }],
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: 'dist'
  }
});
