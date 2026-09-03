import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export const PACKAGE_MANAGERS: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];

export interface PackageJson {
  name?: string;
  version?: string;
  packageManager?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export function readJson(path: string): PackageJson | null {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

const OWN_NAMES = new Set(['@zyncat/ui', 'zyncat-ui']);

export function findOwnRoot(): { root: string; version: string } {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (;;) {
    const pkg = readJson(join(dir, 'package.json'));
    if (pkg?.name && OWN_NAMES.has(pkg.name)) return { root: dir, version: pkg.version ?? '0.0.0' };
    const parent = dirname(dir);
    if (parent === dir) throw new Error('zyncat-ui package root not found');
    dir = parent;
  }
}

const LOCKFILES: [string, PackageManager][] = [
  ['pnpm-lock.yaml', 'pnpm'],
  ['yarn.lock', 'yarn'],
  ['bun.lock', 'bun'],
  ['bun.lockb', 'bun'],
  ['package-lock.json', 'npm'],
];

function lockfilePm(start: string): PackageManager | null {
  for (let dir = start; ; dir = dirname(dir)) {
    for (const [file, pm] of LOCKFILES) if (existsSync(join(dir, file))) return pm;
    if (existsSync(join(dir, '.git')) || dirname(dir) === dir) return null;
  }
}

function userAgentPm(): PackageManager | null {
  const agent = process.env.npm_config_user_agent ?? '';
  const name = agent.split('/')[0];
  return PACKAGE_MANAGERS.includes(name as PackageManager) ? (name as PackageManager) : null;
}

export function detectPm(cwd: string, targetPkg: PackageJson | null): PackageManager | null {
  const fromLockfile = lockfilePm(cwd);
  if (fromLockfile) return fromLockfile;
  const fromField = targetPkg?.packageManager?.split('@')[0];
  if (PACKAGE_MANAGERS.includes(fromField as PackageManager)) return fromField as PackageManager;
  return userAgentPm();
}

export function pmVersion(pm: PackageManager): string | null {
  const result = spawnSync(pm, ['--version'], { encoding: 'utf8', shell: process.platform === 'win32', timeout: 5000 });
  const version = result.stdout?.trim().split('\n').at(-1);
  return result.status === 0 && version ? version : null;
}

export function majorOf(range: string | undefined): number | null {
  const match = range?.match(/\d+/);
  return match ? Number(match[0]) : null;
}

const release = (version: string): number[] => (version.match(/\d+\.\d+\.\d+/)?.[0] ?? '0.0.0').split('.').map(Number);

export function isOlder(version: string, than: string): boolean {
  const [a, b] = [release(version), release(than)];
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] < b[i];
  return false;
}

export function installedVersion(cwd: string, name: string): string | null {
  return readJson(join(cwd, 'node_modules', name, 'package.json'))?.version ?? null;
}

const ENTRY_CANDIDATES = [
  'app/layout.tsx',
  'app/layout.jsx',
  'src/app/layout.tsx',
  'src/app/layout.jsx',
  'src/main.tsx',
  'src/main.jsx',
  'src/index.tsx',
  'src/index.jsx',
  'app/root.tsx',
  'src/root.tsx',
];

export function findAppEntry(cwd: string): string | null {
  for (const candidate of ENTRY_CANDIDATES) if (existsSync(join(cwd, candidate))) return candidate;
  return null;
}

export const TAILWIND_IMPORT = /^\s*@import\s+(['"])tailwindcss(?:\/[\w./-]+)?\1[^;]*;/m;

const STYLESHEET_SKIP_DIRS = new Set(['node_modules', 'dist', 'build', 'out', 'coverage', 'public']);
const STYLESHEET_SEARCH_DEPTH = 4;

export function tailwindMajor(cwd: string, pkg: PackageJson | null): number | null {
  const range = pkg?.dependencies?.tailwindcss ?? pkg?.devDependencies?.tailwindcss;
  if (!range) return null;
  return majorOf(installedVersion(cwd, 'tailwindcss') ?? undefined) ?? majorOf(range);
}

export function findTailwindEntry(cwd: string): string | null {
  const found: string[] = [];
  const walk = (dir: string, depth: number) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (depth < STYLESHEET_SEARCH_DEPTH && !STYLESHEET_SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.'))
          walk(join(dir, entry.name), depth + 1);
        continue;
      }
      if (!entry.name.endsWith('.css')) continue;
      const path = join(dir, entry.name);
      if (TAILWIND_IMPORT.test(readFileSync(path, 'utf8'))) found.push(relative(cwd, path).split(sep).join('/'));
    }
  };
  walk(cwd, 0);
  found.sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
  return found[0] ?? null;
}
