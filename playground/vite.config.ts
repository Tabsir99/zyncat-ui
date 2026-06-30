import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// The playground consumes the library exactly as a real app would - through the
// package name. Aliased to ../src so edits to the DS are live (HMR), and react/
// motion are deduped so there is ONE copy across the playground and ../src.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'premium-ds/styles.css', replacement: r('../src/styles.css') },
      { find: 'premium-ds', replacement: r('../src/index.ts') },
    ],
    dedupe: ['react', 'react-dom', 'motion', '@phosphor-icons/react'],
  },
  server: { fs: { allow: [r('..')] }, port: 5179 },
});
