import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { dsAliases } from './vite.config';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// The standalone twins (broken.html / fixed.html) can't be served by
// `vite-react-ssg dev` - it routes every html request through the SPA router.
// They exist to demo a MINIMAL module graph, so they're built as their own
// static pages: `pnpm standalone` then serve dist-standalone.
export default defineConfig({
  plugins: [react()],
  resolve: { alias: dsAliases, dedupe: ['react', 'react-dom', 'motion'] },
  build: { outDir: 'dist-standalone', rollupOptions: { input: { broken: r('broken.html'), fixed: r('fixed.html') } } },
});
