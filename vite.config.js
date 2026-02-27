import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.', // project root
  base: '/', // ✅ Custom domain root (www.adventurous.systems)
  publicDir: 'public', // static assets (images, favicon)
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'what-we-do': resolve(__dirname, 'what-we-do.html'),
        'our-work': resolve(__dirname, 'our-work.html'),
        about: resolve(__dirname, 'about.html'),
        blog: resolve(__dirname, 'blog.html'),
        contact: resolve(__dirname, 'contact.html'),
        assessment: resolve(__dirname, 'assessment.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
