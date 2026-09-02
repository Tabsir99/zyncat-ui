import { existsSync } from 'node:fs';
import { defineConfig } from 'tsup';

const LIBRARY_ROOT = new URL('../../', import.meta.url);

async function mirrorIntoLibraryDist() {
  const { copyFile, mkdir, readFile } = await import('node:fs/promises');
  const manifestPath = new URL('package.json', LIBRARY_ROOT);
  if (!existsSync(manifestPath)) return;
  const { name } = JSON.parse(await readFile(manifestPath, 'utf8')) as { name?: string };
  if (name !== '@zyncat/ui') return;
  await mkdir(new URL('dist/', LIBRARY_ROOT), { recursive: true });
  await copyFile('dist/cli.js', new URL('dist/cli.js', LIBRARY_ROOT));
}

export default defineConfig({
  entry: { cli: 'src/cli.ts' },
  format: ['esm'],
  platform: 'node',
  target: 'node18',
  dts: false,
  sourcemap: false,
  splitting: false,
  clean: true,
  silent: true,
  noExternal: [/^@clack\//, 'picocolors'],
  banner: { js: '#!/usr/bin/env node' },
  onSuccess: mirrorIntoLibraryDist,
});
