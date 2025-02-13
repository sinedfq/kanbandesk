import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/js/main.js",
        chunkFileNames: "assets/js/[name].js",
        assetFileNames: ({ name }) => {
          if (name && name.endsWith(".css")) return "assets/css/main.css";
          return "assets/[name].[ext]";
        },
      },
    },
  },
});