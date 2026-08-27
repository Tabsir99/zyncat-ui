import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DOCS_DIR = join(ROOT, 'docs/authoring');

function walk(dir, exts) {
  if (!existsSync(dir)) return [];
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
      } else if (entry.isFile() && exts.some((e) => entry.name.endsWith(e))) {
        results.push(full);
      }
    }
  }
  step(dir);
  return results;
}

const failures = [];
const fail = (doc, message) => failures.push(`${doc}: ${message}`);

const TOP_LEVEL_DIRS = ['src', 'scripts', 'docs', 'apps', 'dist'];
const ROOT_FILES = [
  'package.json',
  'tsup.config.ts',
  'turbo.json',
  'lefthook.yml',
  'llms.txt',
  'README.md',
  'CLAUDE.md',
  '.mcp.json',
];
const FILE_EXTENSIONS = ['.ts', '.tsx', '.css', '.md', '.json', '.txt', '.mjs'];

const NOT_EXPECTED_TO_RESOLVE = new Set([
  'dist/thing.js',
  'use-thing.ts',
  'Thing.tsx',
  '@zyncat/ui/thing',
  '@zyncat/ui/text-field',
  'Thing',
  '.tsx',
  '.css',
  'src/components/compound/',
  'src/components/expressive/',
]);

const ILLUSTRATIVE_VARS = new Set(['--space-3-5']);

const GLOBALS = new Set([
  'CompositeOperation',
  'FillMode',
  'Promise',
  'HTMLElement',
  'Element',
  'Animation',
  'Chromium',
  'React',
  'TypeScript',
  'Tailwind',
  'setTimeout',
  'requestAnimationFrame',
  'matchMedia',
  'getComputedStyle',
  'parseFloat',
  'transitionend',
  'animationend',
  'querySelector',
  'getBoundingClientRect',
]);

const sourceFiles = [
  ...walk(join(ROOT, 'src'), ['.ts', '.tsx']),
  ...walk(join(ROOT, 'scripts'), ['.mjs']),
  ...[join(ROOT, 'tsup.config.ts')].filter(existsSync),
];

const exportedNames = new Set();
const declaredNames = new Set();
for (const file of sourceFiles) {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(
    /^export\s+(?:declare\s+)?(?:async\s+)?(?:function|const|let|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/gm,
  ))
    exportedNames.add(m[1]);
  for (const m of text.matchAll(/^export\s+(?:type\s+)?\{([^}]*)\}/gm))
    for (const part of m[1].split(',')) {
      const name = part
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)
        .pop();
      if (name) exportedNames.add(name.trim());
    }
  for (const m of text.matchAll(/^(?:const|let|function|class|interface|type)\s+([A-Za-z_$][\w$]*)/gm))
    declaredNames.add(m[1]);
  for (const m of text.matchAll(/^\s{2}(?:\/\*\*.*\*\/\s*)?([a-zA-Z_$][\w$]*)\??\s*[?:]/gm)) declaredNames.add(m[1]);
}
for (const name of exportedNames) declaredNames.add(name);

const declaredCssVars = new Set();
for (const file of walk(join(ROOT, 'src'), ['.css']))
  for (const m of readFileSync(file, 'utf8').matchAll(/^\s*(--[\w-]+)\s*:/gm)) declaredCssVars.add(m[1]);

const basenames = new Set();
for (const dir of TOP_LEVEL_DIRS)
  for (const file of walk(join(ROOT, dir), FILE_EXTENSIONS)) basenames.add(basename(file));
for (const file of ROOT_FILES) if (existsSync(join(ROOT, file))) basenames.add(file);

function resolvesAsPath(token) {
  if (token.includes('*')) {
    const star = token.indexOf('*');
    const base = token.slice(0, star).replace(/\/+$/, '');
    const ext = token.slice(token.lastIndexOf('*') + 1);
    if (!ext.startsWith('.')) return existsSync(join(ROOT, base));
    return walk(join(ROOT, base), [ext]).length > 0;
  }
  const clean = token.replace(/\/+$/, '');
  if (existsSync(join(ROOT, clean))) return true;
  return !clean.includes('/') && basenames.has(clean);
}

function looksLikePath(token) {
  if (token.includes(' ') || token.includes('=')) return false;
  if (TOP_LEVEL_DIRS.some((d) => token === `${d}/` || token.startsWith(`${d}/`))) return true;
  if (ROOT_FILES.includes(token)) return true;
  if (!/^[\w./*-]+$/.test(token)) return false;
  const ext = FILE_EXTENSIONS.find((e) => token.endsWith(e));
  return !!ext && token.length > ext.length;
}

function apiName(token) {
  let name = token.trim();
  if (name.startsWith('<')) name = name.slice(1);
  name = name.split(/[\s(<>{[.,;:'"`=]/)[0];
  if (!name) return null;
  if (/^use[A-Z]\w*$/.test(name)) return name;
  if (/^ov[A-Z]\w*$/.test(name)) return name;
  if (/^[A-Z][a-zA-Z]{2,}$/.test(name)) return name;
  if (/^[a-z]+[A-Z]\w*$/.test(name)) return name;
  return null;
}

const MOTION_TOKENS_SRC = readFileSync(join(ROOT, 'src/tokens/motion-tokens.ts'), 'utf8');
const MOTION_SCALE_SRC = readFileSync(join(ROOT, 'src/tokens/motion-scale.ts'), 'utf8');

const motionTokensBlock = MOTION_TOKENS_SRC.match(/export interface MotionTokens \{([\s\S]*?)\n\}/);
if (!motionTokensBlock) fail('src/tokens/motion-tokens.ts', 'MotionTokens interface not found - the lint cannot run.');
const motionGroups = new Set(
  motionTokensBlock ? [...motionTokensBlock[1].matchAll(/^\s{2}(\w+)\??:/gm)].map((m) => m[1]) : [],
);

const GROUP_TOKEN_TYPE = { dur: 'DurationToken', ease: 'EaseToken', dist: 'DistanceToken', scale: 'ScaleToken' };

function motionGroupMembers(group) {
  if (group === 't') {
    const line = motionTokensBlock?.[1].match(/^\s{2}t:\s*\{([^}]*)\}/m);
    return line ? new Set([...line[1].matchAll(/(\w+):/g)].map((m) => m[1])) : null;
  }
  const typeName = GROUP_TOKEN_TYPE[group];
  if (!typeName) return null;
  const decl = MOTION_SCALE_SRC.match(new RegExp(`export type ${typeName}\\s*=([^;]*);`));
  return decl ? new Set([...decl[1].matchAll(/'([\w-]+)'/g)].map((m) => m[1])) : null;
}

const layerBlock = readFileSync(join(ROOT, 'src/engine/animate.ts'), 'utf8').match(
  /export interface Layer \{([\s\S]*?)\n\}/,
);
const layerKeys = new Set(layerBlock ? [...layerBlock[1].matchAll(/^\s{2}(\w+)\??:/gm)].map((m) => m[1]) : []);
if (!layerKeys.size) fail('src/engine/animate.ts', 'Layer interface not found - the lint cannot run.');

const guides = readdirSync(DOCS_DIR)
  .filter((f) => f.endsWith('.md'))
  .sort();
if (!guides.length) fail('docs/authoring', 'no markdown files found.');

const linted = [
  ...guides.map((f) => ({ label: f, path: join(DOCS_DIR, f), isGuide: true })),
  ...(existsSync(join(ROOT, 'CLAUDE.md'))
    ? [{ label: 'CLAUDE.md', path: join(ROOT, 'CLAUDE.md'), isGuide: false }]
    : []),
];

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const serverSrc = readFileSync(join(ROOT, 'src/mcp/server.ts'), 'utf8');
const GUIDE_TOOL_DOCS = { motion_guide: 'motion.md', design_rules: 'design-system.md' };

for (const { label: file, path: docPath, isGuide } of linted) {
  const text = readFileSync(docPath, 'utf8');
  const fenced = [...text.matchAll(/```(\w*)\n([\s\S]*?)```/g)];
  const prose = text.replace(/```[\s\S]*?```/g, '');

  const sections = [...text.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1]);
  if (isGuide && !sections.length) fail(file, 'no "## " sections - the MCP guide tools cannot select a topic.');

  for (const m of prose.matchAll(/`([^`\n]+)`/g)) {
    const token = m[1].trim();
    if (NOT_EXPECTED_TO_RESOLVE.has(token)) continue;

    if (/^--[\w-]+\*?$/.test(token)) {
      if (ILLUSTRATIVE_VARS.has(token)) continue;
      const declared = token.endsWith('*')
        ? [...declaredCssVars].some((v) => v.startsWith(token.slice(0, -1)))
        : declaredCssVars.has(token);
      if (!declared) fail(file, `custom property ${token} is not declared in any src/**/*.css`);
      continue;
    }

    if (looksLikePath(token)) {
      if (!resolvesAsPath(token)) fail(file, `path \`${token}\` does not exist`);
      continue;
    }

    const name = apiName(token);
    if (name && !GLOBALS.has(name) && !declaredNames.has(name))
      fail(file, `\`${name}\` is named as an API but nothing in the repo declares it`);
  }

  for (const [, lang, body] of fenced) {
    if (lang !== 'ts' && lang !== 'tsx') continue;
    for (const m of body.matchAll(/\b([a-z]+[A-Z]\w*)\s*\(/g))
      if (!GLOBALS.has(m[1]) && !exportedNames.has(m[1]))
        fail(file, `example calls \`${m[1]}()\` but nothing in src/ exports it`);
  }

  for (const m of text.matchAll(/\bUIMotion\.(\w+)(?:\.(\w+))?/g)) {
    const [, group, member] = m;
    if (!motionGroups.has(group)) {
      fail(file, `UIMotion.${group} is not a field of MotionTokens`);
      continue;
    }
    if (!member) continue;
    const members = motionGroupMembers(group);
    if (members && !members.has(member)) fail(file, `UIMotion.${group}.${member} is not a valid ${group} token`);
  }
}

const motionDoc = readFileSync(join(DOCS_DIR, 'motion.md'), 'utf8');
const vocabSection = motionDoc.match(/## The Layer vocabulary\n([\s\S]*?)(?:\n## |\s*$)/);
if (!vocabSection) {
  fail('motion.md', 'the Layer vocabulary section was not found - it is the promise that the list is complete.');
} else {
  const documented = new Set();
  for (const row of vocabSection[1].matchAll(/^- ((?:`\w+`(?:, )?)+) — /gm))
    for (const m of row[1].matchAll(/`(\w+)`/g)) documented.add(m[1]);
  for (const key of layerKeys)
    if (!documented.has(key)) fail('motion.md', `Layer key \`${key}\` exists in the engine but is not documented`);
  for (const key of documented)
    if (!layerKeys.has(key)) fail('motion.md', `Layer key \`${key}\` is documented but no longer exists in the engine`);
}

for (const [tool, doc] of Object.entries(GUIDE_TOOL_DOCS)) {
  const block = serverSrc.match(new RegExp(`name: '${tool}'[\\s\\S]*?e\\.g\\. ([^.]*)\\.`));
  if (!block) {
    fail('src/mcp/server.ts', `${tool} no longer advertises example topics - nothing pins its sections.`);
    continue;
  }
  const titles = [...readFileSync(join(DOCS_DIR, doc), 'utf8').matchAll(/^#{2,3}\s+(.+?)\s*$/gm)].map((m) => m[1]);
  for (const m of block[1].matchAll(/"([^"]+)"/g)) {
    const q = norm(m[1]);
    if (!titles.some((t) => norm(t).includes(q) || q.includes(norm(t))))
      fail('src/mcp/server.ts', `${tool} advertises topic "${m[1]}" but no section of ${doc} matches it`);
  }
}

if (failures.length) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\n${failures.length} stale reference(s) in docs/authoring.`);
  process.exit(1);
}
console.log(`check-authoring: ${linted.length} docs clean, ${layerKeys.size} Layer keys documented.`);
