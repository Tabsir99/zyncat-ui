import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function toKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

const NAME_OVERRIDES = {
  DateTimeField: 'datetime-field',
};

const entries = {
  'toast-store': 'components/composites/toast/toast-store.ts',
  'motion-tokens': 'tokens/motion-tokens.ts',
  'motion-devtools': 'components/dev/MotionDevtools.tsx',
  collapse: 'motion/Collapse.tsx',
  glide: 'motion/glide.tsx',
};

const baseDir = join(process.cwd(), 'src/components');
for (const tier of ['primitives', 'composites', 'compound']) {
  const tierDir = join(baseDir, tier);
  let dirs;
  try { dirs = readdirSync(tierDir); } catch { continue; }
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

const tsconfigPath = join(process.cwd(), 'playground/tsconfig.json');
const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));

const newPaths = {
  'premium-ds/styles.css': ['../src/styles.css']
};

for (const [name, path] of Object.entries(entries)) {
  newPaths[`premium-ds/${name}`] = [`../src/${path}`];
}

tsconfig.compilerOptions.paths = newPaths;

writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\\n');
console.log('Playground tsconfig.json updated dynamically.');
