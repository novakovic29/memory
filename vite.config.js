import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    open: true,
    browser: 'chrome',
  },
  css: {
    devSourcemap: true
  },
  build: {
    cssCodeSplit: false
  }
});