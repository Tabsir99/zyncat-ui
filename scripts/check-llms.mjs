// llms.txt lint: the MCP server's content database is hand-written prose parsed by two
// regexes, so it fails silently - a heading that stops matching HEADING_RE does not error,
// it folds that component's whole block into the previous entry and drops the component to
// "SUPPORTING MODULES". This is the guard for that, plus for examples that outlive the API
// they demonstrate (a renamed prop still typechecks nowhere but is copy-pasted everywhere).
//
// Method:
//   1. Parse llms.txt with the SAME regexes as src/mcp/server.ts, so the two never disagree.
//   2. Every public subpath in package.json exports must have an entry, unless listed in
//      SUPPORTING - modules deliberately documented by their types alone.
//   3. Every JSX attribute in an entry's examples must resolve to a prop the built types
//      declare for that subpath (following the chunk imports tsup splits them across).
// Requires dist/ - run pnpm build first.

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');

const SECTION_RE = /^=+\s+(.+?)\s*$/;
const HEADING_RE = /^([A-Za-z][\w /]*?) - @zyncat\/ui\/([a-z][a-z0-9-]*)\b.*$/;

/* Public subpaths documented by their types alone - no llms.txt entry expected. */
const SUPPORTING = new Set(['toast-store', 'motion-tokens', 'next']);

/* Components rendered inside an example that are not the entry itself; their attributes
   belong to them, not to the documented component. */
const NESTED = ['Icon', 'Avatar', 'Button', 'Toaster', 'div', 'nav', 'menu', 'span', 'input', 'img'];

/* Attributes every host element accepts, so no props interface needs to declare them.
   Deliberately excludes camelCase ariaLabel - that is a real prop a component must declare
   (native ARIA is hyphenated, which the attribute scan does not match anyway). */
const NATIVE_RE = /^(on[A-Z]\w*|id|className|style|key|ref|role|type|children)$/;

if (!existsSync(DIST)) {
  console.error('✗ dist/ not found - run "pnpm build" first.');
  process.exit(1);
}

/* 1 - parse llms.txt exactly as the MCP server does */
const entries = [];
let current = null;
readFileSync(join(ROOT, 'llms.txt'), 'utf8')
  .split('\n')
  .forEach((line, i) => {
    if (SECTION_RE.test(line)) {
      current = null;
      return;
    }
    const head = line.match(HEADING_RE);
    if (head) {
      current = { title: head[1].trim(), subpath: head[2], line: i + 1, examples: [] };
      entries.push(current);
    } else if (current) {
      current.examples.push({ text: line, line: i + 1 });
    }
  });

/* 2 - props the built types declare for a subpath, following tsup's chunk splits */
function declaredProps(subpath) {
  const props = new Set();
  const seen = new Set();
  const queue = [join(DIST, `${subpath}.d.ts`)];
  while (queue.length) {
    const file = queue.shift();
    if (seen.has(file) || !existsSync(file)) continue;
    seen.add(file);
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/from '(\.\/[\w.-]+)\.js'/g)) queue.push(join(DIST, `${m[1].slice(2)}.d.ts`));
    /* Only component-level shapes: a nested row/option/column type must not satisfy a
       prop the component itself never declared. */
    for (const block of src.matchAll(
      /(?:interface|type)\s+\w*(?:Props|Config)(?:<[^>]*>)?\s*(?:extends[^{]+)?=?\s*\{([\s\S]*?)\n\}/g,
    ))
      for (const key of block[1].matchAll(/^\s+([a-zA-Z][a-zA-Z0-9]*)\??[:(]/gm)) props.add(key[1]);
    /* Inline prop types destructured straight into the signature (GlidePill). */
    for (const fn of src.matchAll(/declare function \w+\(\{[^}]*\}:\s*\{([\s\S]*?)\n\}\)/g))
      for (const key of fn[1].matchAll(/([a-zA-Z][a-zA-Z0-9]*)\??:/g)) props.add(key[1]);
    /* Native props surfaced via Pick - the member list runs past the inner generic's '>'. */
    for (const pick of src.matchAll(/Pick<.*$/gm))
      for (const key of pick[0].matchAll(/'([a-zA-Z][a-zA-Z0-9]*)'/g)) props.add(key[1]);
  }
  return props;
}

let violations = 0;
const fail = (msg) => {
  violations++;
  console.error(`✗ ${msg}`);
};

/* 3 - every public subpath is either documented or knowingly supporting */
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const subpaths = Object.entries(pkg.exports)
  .filter(([, v]) => v && typeof v === 'object' && 'types' in v)
  .map(([k]) => k.replace(/^\.\//, ''));

const documented = new Set(entries.map((e) => e.subpath));
for (const sub of subpaths)
  if (!documented.has(sub) && !SUPPORTING.has(sub))
    fail(`@zyncat/ui/${sub} has no llms.txt entry - add one, or add it to SUPPORTING in this script.`);
for (const entry of entries)
  if (!subpaths.includes(entry.subpath))
    fail(`llms.txt:${entry.line} documents @zyncat/ui/${entry.subpath}, which package.json does not export.`);

const counts = new Map();
for (const entry of entries) counts.set(entry.subpath, (counts.get(entry.subpath) ?? 0) + 1);
for (const [sub, n] of counts)
  if (n > 1) fail(`@zyncat/ui/${sub} has ${n} llms.txt entries - headings must be unique.`);

/* 4 - every attribute in an example is a prop the types actually declare */
for (const entry of entries) {
  const props = declaredProps(entry.subpath);
  if (!props.size) {
    fail(`dist/${entry.subpath}.d.ts declared no props - is the build stale?`);
    continue;
  }
  for (const { text, line } of entry.examples) {
    let stripped = text;
    for (const tag of NESTED) stripped = stripped.replaceAll(new RegExp(`<${tag}\\b[^>]*>`, 'g'), '');
    for (const m of stripped.matchAll(/(?:^|\s)([a-zA-Z][a-zA-Z0-9]*)=[{"]/g)) {
      const prop = m[1];
      if (props.has(prop) || NATIVE_RE.test(prop)) continue;
      const near = [...props].find((p) => p.toLowerCase().endsWith(prop.toLowerCase()));
      fail(
        `llms.txt:${line} ${entry.title} example uses "${prop}", not a prop of @zyncat/ui/${entry.subpath}${near ? ` - did you mean "${near}"?` : ''}`,
      );
    }
  }
}

if (violations) {
  console.error(`\n${violations} llms.txt problem(s).`);
  process.exit(1);
}
console.log(`check-llms: ${entries.length} entries clean, ${subpaths.length} public subpaths covered.`);
