import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { publicEntries, ROOT } from './lib/entries.mjs';

const COMPONENTS = join(ROOT, 'src/components');

function walk(dir, ext) {
  const results = [];
  function step(current) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (
        entry.name === '.next' ||
        entry.name === 'node_modules' ||
        entry.name === 'out' ||
        entry.name === 'dist' ||
        entry.name === 'temp' ||
        entry.name === '.git'
      ) {
        continue;
      }
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        step(full);
      } else if (entry.isFile() && ext.some((e) => entry.name.endsWith(e))) {
        results.push(full);
      }
    }
  }
  step(dir);
  return results;
}

const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const classOwners = new Map();
for (const file of walk(COMPONENTS, ['.css'])) {
  const css = stripComments(readFileSync(file, 'utf8'));
  for (const m of css.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
    const set = classOwners.get(m[1]) ?? new Set();
    set.add(file);
    classOwners.set(m[1], set);
  }
}
const globalClasses = new Set();
const MANIFEST_IMPORT = /@import\s+(?:url\()?['"]([^'"]+)['"]/g;
for (const m of readFileSync(join(ROOT, 'src/styles.css'), 'utf8').matchAll(MANIFEST_IMPORT)) {
  const f = resolve(join(ROOT, 'src'), m[1]);
  if (!existsSync(f)) continue;
  const css = stripComments(readFileSync(f, 'utf8'));
  for (const mm of css.matchAll(/\.([a-zA-Z][\w-]*)/g)) globalClasses.add(mm[1]);
}

const resolveImport = (from, spec) => {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(from), spec);
  for (const cand of [base, base + '.ts', base + '.tsx', join(base, 'index.ts')])
    if (existsSync(cand) && statSync(cand).isFile()) return cand;
  return null;
};

const moduleCache = new Map();
function inspect(file) {
  if (moduleCache.has(file)) return moduleCache.get(file);
  const src = stripComments(readFileSync(file, 'utf8'));
  const imports = [];
  for (const m of src.matchAll(/(?:import|export)[^'"]*?['"]([^'"]+)['"]/g)) imports.push(m[1]);
  const info = { imports, src };
  moduleCache.set(file, info);
  return info;
}

const blankInterpolations = (literal) => literal.replace(/\$\{[^{}]*\}/g, ' ');
const isClassList = (toks) => toks.length > 0 && toks.length <= 6 && toks.every((t) => /^[a-z][A-Za-z0-9_-]*$/.test(t));
const isBemStub = (tok) => tok.endsWith('-') && /__|--/.test(tok);

function renderedClasses(src) {
  const found = new Set();
  const literals = [];
  for (const m of src.matchAll(/'([^'\\\n]*)'|"([^"\\\n]*)"/g)) literals.push(m[1] ?? m[2]);
  for (const m of src.matchAll(/`([^`]*)`/g)) literals.push(blankInterpolations(m[1]));
  for (const m of src.matchAll(/class=["']([^"']*)["']/g)) literals.push(m[1]);
  for (const lit of literals) {
    const toks = lit.split(/\s+/).filter(Boolean);
    if (!isClassList(toks)) continue;
    for (const tok of toks) {
      if (classOwners.has(tok) && !globalClasses.has(tok)) found.add(tok);
      else if (isBemStub(tok)) {
        for (const cls of classOwners.keys()) if (cls.startsWith(tok) && !globalClasses.has(cls)) found.add(cls);
      }
    }
  }
  return found;
}

const entries = Object.entries(publicEntries()).map(([name, source]) => ({ name, file: join(ROOT, source) }));

let violations = 0;
for (const entry of entries) {
  const modules = new Set();
  const cssSet = new Set();
  const queue = [entry.file];
  while (queue.length) {
    const file = queue.pop();
    if (modules.has(file)) continue;
    modules.add(file);
    for (const spec of inspect(file).imports) {
      if (spec.endsWith('.css')) {
        cssSet.add(resolve(dirname(file), spec));
        continue;
      }
      const target = resolveImport(file, spec);
      if (target) queue.push(target);
    }
  }
  for (const mod of modules) {
    for (const cls of renderedClasses(inspect(mod).src)) {
      const owners = classOwners.get(cls);
      if (![...owners].some((o) => cssSet.has(o))) {
        violations++;
        const owner = [...owners].map((o) => o.replace(ROOT + '/', '')).join(' | ');
        console.error(`✗ ${entry.name}: ${mod.replace(ROOT + '/', '')} renders .${cls} but never imports ${owner}`);
      }
    }
  }
}

const RENDERERS = [join(ROOT, 'src'), join(ROOT, 'apps/docs')];
const renderedAnywhere = new Set();
for (const dir of RENDERERS)
  for (const file of walk(dir, ['.ts', '.tsx']))
    for (const cls of renderedClasses(inspect(file).src)) renderedAnywhere.add(cls);

const definedAt = (file, cls) => {
  const at = readFileSync(file, 'utf8')
    .split('\n')
    .findIndex((line) => new RegExp('\\.' + cls + '(?![\\w-])').test(line));
  return file.replace(ROOT + '/', '') + (at < 0 ? '' : ':' + (at + 1));
};

let dead = 0;
for (const [cls, owners] of classOwners) {
  if (globalClasses.has(cls) || renderedAnywhere.has(cls)) continue;
  dead++;
  console.error(
    `✗ .${cls} is defined but no module renders it - ${[...owners].map((o) => definedAt(o, cls)).join(' | ')}`,
  );
}

if (violations || dead) {
  if (violations) console.error(`\n${violations} unreachable class rendering(s).`);
  if (dead) console.error(`${dead} dead class definition(s).`);
  process.exit(1);
}
console.log(`check-css-graph: ${entries.length} entries clean, ${classOwners.size} classes all rendered.`);
