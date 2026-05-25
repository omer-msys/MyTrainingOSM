import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base path so the build works at any URL prefix
// (e.g. GitHub Pages project sites, S3 subfolders, internal portals).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
