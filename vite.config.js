import vue from '@vitejs/plugin-vue2';
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  publicDir: false,
  plugins: [vue()],
  build: {
    outDir: "../dist",
    emptyOutDir: true
  }
});
