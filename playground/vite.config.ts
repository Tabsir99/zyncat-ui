import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { publicEntries } from '../scripts/lib/entries.mjs';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export const dsAliases = [
  { find: '@zyncat/ui/styles.css', replacement: r('../src/styles.css') },
  ...Object.entries(publicEntries()).map(([name, path]) => ({
    find: `@zyncat/ui/${name}`,
    replacement: r(`../${path}`),
  })),
];

const REACT_SCAN_URL = 'https://unpkg.com/react-scan@0.5.7/dist/auto.global.js';

function reactScanDevOnly(): Plugin {
  return {
    name: 'react-scan-dev-only',
    apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      handler: () => [{ tag: 'script', attrs: { src: REACT_SCAN_URL }, injectTo: 'head-prepend' }],
    },
  };
}

export default defineConfig({
  plugins: [react(), reactScanDevOnly()],
  resolve: { alias: dsAliases, dedupe: ['react', 'react-dom', 'motion', '@phosphor-icons/react'] },
  server: { fs: { allow: [r('..')] }, port: 5179, strictPort: true },
});
