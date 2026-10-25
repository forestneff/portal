import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePluginCmsSync } from './plugins/vite-plugin-cms-sync';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    vitePluginCmsSync()
  ],
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
