import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    devSourcemap: true
  },
  build: {
    cssCodeSplit: false
  }
});