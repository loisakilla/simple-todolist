
import { defineConfig } from "vite";
// @ts-ignore
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    globals: true,
    css: true
  },
});
