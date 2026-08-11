import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

function toKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

const NAME_OVERRIDES: Record<string, string> = { DateTimeField: 'datetime-field' };

function discoverComponentEntries(): Record<string, string> {
  const entries: Record<string, string> = {};
  const baseDir = fileURLToPath(new URL('../src/components', import.meta.url));
  for (const tier of ['primitives', 'composites', 'compound']) {
    const tierDir = join(baseDir, tier);
    let dirs: string[];
    try {
      dirs = readdirSync(tierDir);
    } catch {
      continue;
    }
    for (const comp of dirs) {
      const compDir = join(tierDir, comp);
      if (!statSync(compDir).isDirectory()) continue;
      for (const file of readdirSync(compDir)) {
        if (!file.endsWith('.tsx') || !/^[A-Z]/.test(file)) continue;
        const stem = file.replace('.tsx', '');
        entries[NAME_OVERRIDES[stem] ?? toKebab(stem)] = `components/${tier}/${comp}/${file}`;
      }
    }
  }
  return entries;
}

const EXPLICIT_ENTRIES: Record<string, string> = {
  'toast-store': 'components/composites/toast/toast-store.ts',
  'motion-tokens': 'tokens/motion-tokens.ts',
  'motion-devtools': 'components/dev/MotionDevtools.tsx',
  glide: 'motion/glide.tsx',
};

export const dsAliases = [
  { find: '@zyncat/ui/styles.css', replacement: r('../src/styles.css') },
  ...Object.entries({ ...discoverComponentEntries(), ...EXPLICIT_ENTRIES }).map(([name, path]) => ({
    find: `@zyncat/ui/${name}`,
    replacement: r(`../src/${path}`),
  })),
];

export default defineConfig({
  plugins: [react()],
  resolve: { alias: dsAliases, dedupe: ['react', 'react-dom', 'motion', '@phosphor-icons/react'] },
  server: { fs: { allow: [r('..')] }, port: 5179 },
});
