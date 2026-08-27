// llms.txt lint: the MCP server's content database is hand-written prose parsed by two
// regexes, so it fails silently - a heading that stops matching HEADING_RE does not error,
// it folds that component's whole block into the previous entry and drops the component to
// "SUPPORTING MODULES". This is the guard for that, plus for examples that outlive the API
// they demonstrate (a renamed prop still typechecks nowhere but is copy-pasted everywhere).
//
// Method:
//   1. Parse llms.txt through scripts/lib/llms-format.mjs - the one parser src/mcp/server.ts
//      also runs on, so the lint and the server can never disagree about what an entry is.
//   2. Every public subpath in package.json exports must have an entry, unless listed in
//      SUPPORTING - modules deliberately documented by their types alone.
//   3. Every JSX attribute in an entry's examples must resolve to a prop the built types
//      declare for that subpath (following the chunk imports tsup splits them across).
//   4. Every entry ends with the count of component-specific props it does NOT name, so a
//      reader who only ever sees this file is told, per component, that it is an index and
//      what calling get_component would add. Run with --write to regenerate those counts.
//   5. No entry exceeds MAX_ENTRY_LINES of prose. This file is an index; per-prop detail
//      belongs in the props JSDoc, which get_component already ships beside the entry.
// Requires dist/ - run pnpm build first.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { componentSpecific, NATIVE_PROP_RE, publicPropsBySubpath } from './lib/dts-props.mjs';
import { entryProse, formatPropCount, parseLlms, PROP_COUNT_RE } from './lib/llms-format.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const LLMS = join(ROOT, 'llms.txt');

const write = process.argv.includes('--write');

/* An entry is an index row, not a manual - purpose, the disambiguating sentence, the value
   vocabularies, one or two examples. Anything longer belongs in the props JSDoc. */
const MAX_ENTRY_LINES = 10;

/* Public subpaths documented by their types alone - no llms.txt entry expected. */
const SUPPORTING = new Set(['toast-store', 'motion-tokens', 'next']);

/* Components rendered inside an example that are not the entry itself; their attributes
   belong to them, not to the documented component. */
const NESTED = ['Icon', 'Avatar', 'Button', 'Toaster', 'div', 'nav', 'menu', 'span', 'input', 'img'];

if (!existsSync(DIST)) {
  console.error('✗ dist/ not found - run "pnpm build" first.');
  process.exit(1);
}

/* 1 - parse llms.txt exactly as the MCP server does */
const raw = readFileSync(LLMS, 'utf8');
const parsed = parseLlms(raw);
const entries = parsed.entries.map((entry) => ({ ...entry, examples: entryProse(entry) }));

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
      if (props.has(prop) || NATIVE_PROP_RE.test(prop)) continue;
      const near = [...props].find((p) => p.toLowerCase().endsWith(prop.toLowerCase()));
      fail(
        `llms.txt:${line} ${entry.title} example uses "${prop}", not a prop of @zyncat/ui/${entry.subpath}${near ? ` - did you mean "${near}"?` : ''}`,
      );
    }
  }
}

/* 5 - the "+N more props" line closing each entry, counted off the built types */
const publicProps = publicPropsBySubpath(entries.map((e) => e.subpath));

const sectionBody = new Map(parsed.sections.map((s) => [s.title, s.body.join('\n')]));

function unnamedProps(entry) {
  const prose = [entry.examples.map((l) => l.text).join('\n'), sectionBody.get(entry.section) ?? ''].join('\n');
  return componentSpecific(publicProps.get(entry.subpath) ?? []).filter(
    (prop) => !new RegExp(`\\b${prop}\\b`).test(prose),
  );
}

const wanted = new Map();
for (const entry of entries) {
  const missing = unnamedProps(entry);
  wanted.set(entry, missing.length ? formatPropCount(missing.length, entry.subpath) : null);
}

if (write) {
  const drop = new Set();
  const append = new Map();
  for (const entry of entries) {
    for (const line of entry.body) if (PROP_COUNT_RE.test(line.text)) drop.add(line.line - 1);
    const marker = wanted.get(entry);
    const prose = entry.examples;
    if (marker && prose.length) append.set(prose[prose.length - 1].line - 1, marker);
  }
  const next = [];
  raw.split('\n').forEach((text, i) => {
    if (!drop.has(i)) next.push(text);
    const marker = append.get(i);
    if (marker) next.push(marker);
  });
  writeFileSync(LLMS, next.join('\n'));
  const marked = [...wanted.values()].filter(Boolean).length;
  console.log(`check-llms --write: prop counts refreshed on ${marked} of ${entries.length} llms.txt entries.`);
  process.exit(0);
}

/* 6 - an entry stays an index row */
for (const entry of entries) {
  const prose = entry.examples.length;
  if (prose > MAX_ENTRY_LINES)
    fail(
      `llms.txt:${entry.line} ${entry.title} runs ${prose} lines, over the ${MAX_ENTRY_LINES}-line cap - ` +
        `move the per-prop detail into the props JSDoc, which get_component ships next to this entry.`,
    );
}

for (const entry of entries) {
  const marker = wanted.get(entry);
  const present = entry.body.filter((line) => PROP_COUNT_RE.test(line.text));
  if (present.length > 1) {
    fail(`${entry.title} has ${present.length} "+N more props" lines - run "pnpm sync:llms".`);
    continue;
  }
  const actual = present[0];
  if (marker && !actual)
    fail(`${entry.title} has no prop count - it should end with "${marker.trim()}". Run "pnpm sync:llms".`);
  else if (!marker && actual)
    fail(`llms.txt:${actual.line} ${entry.title} names every public prop, so its prop-count line is wrong.`);
  else if (marker && actual.text !== marker)
    fail(`llms.txt:${actual.line} ${entry.title} claims "${actual.text.trim()}", expected "${marker.trim()}".`);
  else if (marker && actual.line !== entry.body[entry.body.length - 1].line)
    fail(`llms.txt:${actual.line} ${entry.title} "+N more props" must be the entry's last line.`);
}

if (violations) {
  console.error(`\n${violations} llms.txt problem(s).`);
  process.exit(1);
}
const marked = [...wanted.values()].filter(Boolean).length;
console.log(
  `check-llms: ${entries.length} entries clean, ${subpaths.length} public subpaths covered, ${marked} prop counts current.`,
);
