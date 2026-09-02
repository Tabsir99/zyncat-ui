import { defineConfig, type Options } from 'tsup';

import { publicEntries } from './scripts/lib/entries.mjs';

// One entry per public module - one dist JS file each; declarations are emitted
// separately by `tsc -p tsconfig.build.json --emitDeclarationOnly` into dist/types
// (the bundled-dts pass cost ~23s of every build for zero consumer benefit). Subpaths
// (`@zyncat/ui/button`) are the ONLY public API - there is no barrel entry, so
// one import can never pull modules (or CSS) the app didn't ask for.
// splitting:true hoists shared internals (overlay/*, select/core,
// field-shell, ...) into shared chunks instead of duplicating them per entry.
const library: Options = {
  entry: publicEntries(),
  format: ['esm'],
  dts: false,
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

// The MCP server is a node executable, not a library module: node platform, shebang for
// the package bin, no d.ts (no importable API), and clean:false so it never races the
// library build's dist wipe. The init CLI is its own package - packages/zyncat-ui builds
// it and mirrors the bundle into this dist for the `zyncat-ui` bin.
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
