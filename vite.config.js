import vue from '@vitejs/plugin-vue';
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  plugins: [vue()],
  build: {
    outDir: "../dist",
    emptyOutDir: true
  }
});
