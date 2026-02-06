import vue from '@vitejs/plugin-vue2';
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  plugins: [vue()],
  build: {
    outDir: "../dist",
    emptyOutDir: true
  }
});
