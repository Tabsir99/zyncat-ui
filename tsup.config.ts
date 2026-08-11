import { defineConfig, type Options } from 'tsup';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// PascalCase filename → kebab-case entry name (Button → button, TextField → text-field).
function toKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

// Exceptions where the auto-derived kebab name doesn't match the desired public entry name.
const NAME_OVERRIDES: Record<string, string> = { DateTimeField: 'datetime-field' };

// Scan primitives/, composites/, compound/ for PascalCase .tsx files → entry map.
function discoverComponentEntries(): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const tier of ['primitives', 'composites', 'compound']) {
    const tierDir = join('src/components', tier);
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
        entries[NAME_OVERRIDES[stem] ?? toKebab(stem)] = join(compDir, file);
      }
    }
  }
  return entries;
}

// Non-component public entries that don't follow the PascalCase .tsx convention.
const EXPLICIT_ENTRIES: Record<string, string> = {
  'toast-store': 'src/components/composites/toast/toast-store.ts',
  'motion-tokens': 'src/tokens/motion-tokens.ts',
  'motion-devtools': 'src/components/dev/MotionDevtools.tsx',
  glide: 'src/motion/glide.tsx',
};

// One entry per public module - one dist file + .d.ts each. Subpaths
// (`@zyncat/ui/button`) are the ONLY public API - there is no barrel entry, so
// one import can never pull modules (or CSS) the app didn't ask for.
// splitting:true hoists shared internals (overlay/*, select/core,
// field-shell, ...) into shared chunks instead of duplicating them per entry.
const library: Options = {
  entry: { ...discoverComponentEntries(), ...EXPLICIT_ENTRIES },
  format: ['esm'],

  // tsup injects a (now-deprecated) baseUrl into the dts compiler; silence it here
  // so tsconfig.json stays clean for editors pinned to an older TypeScript.
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  splitting: true,
  treeshake: true,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  // Bundle the ~16 curated Phosphor glyphs the components import (static, tree-shaken).
  // react/react-dom stay external - stateful singletons the app must own one of.
  external: ['react', 'react-dom', /\.css$/],
  metafile: true,

  // Silence tsup/rollup logs: the d.ts pass emits a benign MODULE_LEVEL_DIRECTIVE
  // warning for every `'use client'` source and there's no finer filter. onSuccess
  // prints a short summary instead. Drop this to see full build logs when debugging.
  silent: true,

  // esbuild strips the per-file `'use client'` when bundling and tsup's banner never
  // reaches split chunks. Re-assert it on every output that is a client boundary -
  // a chunk holding a client source, or an entry/chunk that imports one - while pure
  // data/util modules (motion-tokens, ...) stay server-importable. Prepend same-line so
  // source-map line numbers don't shift.
  async onSuccess() {
    const { readdir, readFile, writeFile, rm, copyFile } = await import('node:fs/promises');
    const isClientSrc = async (src: string) => {
      try {
        return /^\s*['"]use client['"]/.test((await readFile(src, 'utf8')).slice(0, 48));
      } catch {
        return false;
      }
    };
    const metaName = (await readdir('dist')).find((f) => f.startsWith('metafile-') && f.endsWith('.json'));
    if (!metaName) return;
    const meta = JSON.parse(await readFile(`dist/${metaName}`, 'utf8')) as {
      outputs: Record<string, { inputs: Record<string, unknown>; imports?: { path: string }[] }>;
    };
    const outputs = Object.entries(meta.outputs).filter(([o]) => o.endsWith('.js'));

    const client = new Set<string>();
    for (const [out, info] of outputs) {
      const hits = await Promise.all(Object.keys(info.inputs).map(isClientSrc));
      if (hits.some(Boolean)) client.add(out);
    }
    for (let changed = true; changed;) {
      changed = false;
      for (const [out, info] of outputs) {
        if (client.has(out)) continue;
        if ((info.imports || []).some((i) => client.has(i.path))) {
          client.add(out);
          changed = true;
        }
      }
    }
    for (const out of client) {
      const code = await readFile(out, 'utf8');
      if (!/^['"]use client['"]/.test(code)) await writeFile(out, `'use client';${code}`);
    }
    // CSS imports keep their source-relative specifiers, but dist ships CSS flat -
    // re-point any cross-directory '../x/y.css' (or './x/y.css') at the sibling copy.
    for (const [out] of outputs) {
      const code = await readFile(out, 'utf8');
      const flat = code.replace(/(['"])\.{1,2}\/(?:[\w.-]+\/)+([\w-]+\.css)\1/g, '$1./$2$1');
      if (flat !== code) await writeFile(out, flat);
    }
    // Ship each component stylesheet flat into dist so the (external) `./x.css`
    // side-effect imports in the emitted chunks resolve to a sibling file - which is
    // what lets a consumer's bundler code-split/lazy-load CSS per component. glass.css
    // is a cross-cutting utility served by the base manifest (styles.css), so skip it.
    const cssDirs = ['src/components', 'src/motion'];
    const cssFiles: { src: string; name: string }[] = [];
    for (const dir of cssDirs) {
      const found = (await readdir(dir, { recursive: true })).filter(
        (f) => f.endsWith('.css') && !f.endsWith('glass.css'),
      );
      cssFiles.push(...found.map((f) => ({ src: `${dir}/${f}`, name: f.split('/').pop()! })));
    }
    await Promise.all(cssFiles.map((f) => copyFile(f.src, `dist/${f.name}`)));

    await rm(`dist/${metaName}`);
    console.log(`tsup: ${outputs.length} JS (${client.size} client) + ${cssFiles.length} component CSS`);
  },
};

// The MCP server is a node CLI, not a library module: node platform, shebang for the
// package bin, no d.ts (it has no importable API), and clean:false so it never races
// the library build's dist wipe.
const mcpServer: Options = {
  entry: { mcp: 'src/mcp/server.ts' },
  format: ['esm'],
  platform: 'node',
  target: 'node18',
  dts: false,
  sourcemap: false,
  clean: false,
  silent: true,
  banner: { js: '#!/usr/bin/env node' },
};

export default defineConfig([library, mcpServer]);
