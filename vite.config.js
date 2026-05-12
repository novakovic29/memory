import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  css: {
    devSourcemap: true
  },
  build: {
    cssCodeSplit: false
  }
});