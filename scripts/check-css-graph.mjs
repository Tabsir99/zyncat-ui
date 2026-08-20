// CSS-dependency lint: every class a module renders must be defined by a stylesheet
// reachable through that module's import graph. This is the guard for the "works in the
// playground, unstyled in a real app" class of bug - the playground loads every stylesheet
// at once, so it can never catch a missing per-component CSS import; each dist subpath
// entry must be style-complete on its own.
//
// Method (regex-level, no parser):
//   1. Map every class defined in src/components/**/*.css to its defining file(s).
//   2. For each tsup entry, walk the transitive TS/TSX import graph, collecting the
//      reachable .css files and source modules.
//   3. In each reachable module, treat every quoted string token that names a known class
//      (or a `prefix-` concat stub matching known classes) as rendered, and demand that
//      one of its defining stylesheets is in the entry's CSS set.
// Classes defined under src/tokens (loaded app-wide via styles.css) are always satisfied.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { ROOT, publicEntries } from './lib/entries.mjs';

const COMPONENTS = join(ROOT, 'src/components');

const walk = (dir, ext) =>
  readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((d) => d.isFile() && ext.some((e) => d.name.endsWith(e)))
    .map((d) => join(d.parentPath, d.name));

const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

/* 1 - class -> defining css files */
const classOwners = new Map();
for (const file of walk(COMPONENTS, ['.css'])) {
  const css = stripComments(readFileSync(file, 'utf8'));
  for (const m of css.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
    const set = classOwners.get(m[1]) ?? new Set();
    set.add(file);
    classOwners.set(m[1], set);
  }
}
/* classes served app-wide by the base manifest (tokens + glass) - always satisfied */
const globalClasses = new Set();
const MANIFEST_IMPORT = /@import\s+(?:url\()?['"]([^'"]+)['"]/g;
for (const m of readFileSync(join(ROOT, 'src/styles.css'), 'utf8').matchAll(MANIFEST_IMPORT)) {
  const f = resolve(join(ROOT, 'src'), m[1]);
  if (!existsSync(f)) continue;
  const css = stripComments(readFileSync(f, 'utf8'));
  for (const mm of css.matchAll(/\.([a-zA-Z][\w-]*)/g)) globalClasses.add(mm[1]);
}

/* strings that double as aria/role/mode enum values while also naming a block class;
   the class's real renderer imports its stylesheet directly (Dialog.tsx, Alert.tsx,
   and Button's size="icon", which builds a btn--icon class and never a bare .icon) */
const AMBIGUOUS = new Set(['dialog', 'alert', 'icon']);

/* 2 - import graph */
const resolveImport = (from, spec) => {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(from), spec);
  for (const cand of [base, base + '.ts', base + '.tsx', join(base, 'index.ts')])
    if (existsSync(cand) && !cand.endsWith('/')) {
      try {
        return readFileSync(cand) && cand;
      } catch {
        /* directory */
      }
    }
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

/* 3 - rendered-class extraction from one module's source */
const blankInterpolations = (literal) => literal.replace(/\$\{[^{}]*\}/g, ' ');

function renderedClasses(src) {
  const found = new Set();
  const literals = [];
  for (const m of src.matchAll(/'([^'\\\n]*)'|"([^"\\\n]*)"/g)) literals.push(m[1] ?? m[2]);
  for (const m of src.matchAll(/`([^`]*)`/g)) literals.push(blankInterpolations(m[1]));
  for (const m of src.matchAll(/class=["']([^"']*)["']/g)) literals.push(m[1]);
  for (const lit of literals) {
    const toks = lit.split(/\s+/).filter(Boolean);
    /* a class-list literal is short and ALL class-shaped - prose, aria copy and warning
       sentences always carry a token that fails this and disqualify the whole literal */
    if (!toks.length || toks.length > 6 || !toks.every((t) => /^[a-z][A-Za-z0-9_-]*$/.test(t))) continue;
    for (const tok of toks) {
      if (AMBIGUOUS.has(tok)) continue;
      if (classOwners.has(tok) && !globalClasses.has(tok)) found.add(tok);
      else if (tok.endsWith('-') && /__|--/.test(tok)) {
        /* concat stub ('tbl__cell--hide-' + bp): class concats are always BEM stubs;
           bare 'word-' prefixes build ids, not classes */
        for (const cls of classOwners.keys()) if (cls.startsWith(tok) && !globalClasses.has(cls)) found.add(cls);
      }
    }
  }
  return found;
}

/* tsup entries = the public subpaths that must each be style-complete */
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

const RENDERERS = [join(ROOT, 'src'), join(ROOT, 'playground/src')];
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
  if (globalClasses.has(cls) || AMBIGUOUS.has(cls) || renderedAnywhere.has(cls)) continue;
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
