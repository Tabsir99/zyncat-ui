import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import prettier from 'prettier';

import { ROOT } from './lib/entries.mjs';

const TOKENS_OUT = 'src/tokens/theme-tokens.generated.ts';
const STYLES_OUT = 'src/tokens/component-styles.generated.ts';
const check = process.argv.includes('--check');

const fail = (message) => {
  console.error(`✗ ${message}`);
  process.exit(1);
};

const GROUP_BY_FILE = {
  'color.css': 'color',
  'semantic.css': 'color',
  'typography.css': 'type',
  'spacing.css': 'space',
  'radius.css': 'radius',
  'elevation.css': 'elevation',
  'motion.css': 'motion',
  'glass.css': 'glass',
  'icons.css': 'icon',
  'layers.css': 'layer',
  'avatar.css': 'avatar',
  'fonts.css': null,
};

const GROUP_ORDER = ['color', 'type', 'space', 'radius', 'elevation', 'motion', 'glass', 'icon', 'layer', 'avatar'];

const KNOB_TIERS = ['expressive', 'compound'];

const DECL_RE = /(--[\w-]+)\s*:\s*([^;]+);[ \t]*(?:\/\*([^]*?)\*\/)?/g;

const oneLine = (text) => text.replace(/\s+/g, ' ').trim();

const camelize = (kebab) =>
  kebab
    .split('-')
    .filter(Boolean)
    .map((part, index) => (index ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join('');

const kebabize = (camel) =>
  camel
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .replace(/([0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

const pascal = (kebab) => {
  const camel = camelize(kebab);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

const matchBraces = (text, openIndex) => {
  let depth = 1;
  for (let i = openIndex + 1; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}' && !--depth) return i;
  }
  return -1;
};

const blockInner = (text, selectorIndex) => {
  const open = text.indexOf('{', selectorIndex);
  const close = matchBraces(text, open);
  if (open === -1 || close === -1) return '';
  return text.slice(open + 1, close);
};

const ROOT_SELECTOR_RE = /(:root(?:\s*,\s*\[data-theme\])?)\s*\{/g;

const tokenBlocks = (css) => {
  const mediaIndex = css.indexOf('@media (prefers-reduced-motion: reduce)');
  const mediaEnd = mediaIndex === -1 ? -1 : matchBraces(css, css.indexOf('{', mediaIndex));
  const blocks = [];
  for (const match of css.matchAll(ROOT_SELECTOR_RE)) {
    if (mediaIndex !== -1 && match.index > mediaIndex && match.index < mediaEnd) continue;
    blocks.push({ inner: blockInner(css, match.index), themed: match[1].includes('[data-theme]') });
  }
  return blocks;
};

const firstRuleInner = (css) => {
  const layerIndex = css.indexOf('@layer zyncat.components');
  if (layerIndex === -1) return '';
  const layerOpen = css.indexOf('{', layerIndex);
  const layerInner = css.slice(layerOpen + 1, matchBraces(css, layerOpen));
  const ruleOpen = layerInner.indexOf('{');
  if (ruleOpen === -1) return '';
  return layerInner.slice(ruleOpen + 1, matchBraces(layerInner, ruleOpen));
};

const importedTokenFiles = () =>
  [...readFileSync(join(ROOT, 'src/styles.css'), 'utf8').matchAll(/@import '\.\/tokens\/([\w-]+\.css)';/g)].map(
    (match) => match[1],
  );

const files = importedTokenFiles();
if (!files.length) fail('src/styles.css imports no token files - the generator has nothing to read.');

const groups = new Map(GROUP_ORDER.map((group) => [group, []]));
const reduced = {};
const byCssName = new Map();

for (const file of files) {
  if (!(file in GROUP_BY_FILE))
    fail(`src/tokens/${file} has no group in GROUP_BY_FILE - add it to scripts/gen-theme.mjs, or map it to null.`);
  const group = GROUP_BY_FILE[file];
  const css = readFileSync(join(ROOT, 'src/tokens', file), 'utf8');

  if (group) {
    for (const block of tokenBlocks(css)) {
      for (const match of block.inner.matchAll(DECL_RE)) {
        const [, cssName, value, comment] = match;
        if (byCssName.has(cssName)) fail(`${cssName} is declared in both ${byCssName.get(cssName).file} and ${file}.`);
        if (block.themed && !value.includes('var('))
          fail(
            `${cssName} in ${file} sits on the theme-root block with a literal value - a literal there resets the consumer's :root decision inside every [data-theme] subtree. Only tokens that derive from another token belong on ":root, [data-theme]".`,
          );
        const key = camelize(cssName.slice(2));
        if (`--${kebabize(key)}` !== cssName)
          fail(`${cssName} does not round-trip through the name derivation (got --${kebabize(key)}).`);
        const token = {
          cssName,
          key,
          value: oneLine(value),
          doc: comment ? oneLine(comment) : '',
          file,
          themed: block.themed,
        };
        byCssName.set(cssName, token);
        groups.get(group).push(token);
      }
    }
  }

  const mediaIndex = css.indexOf('@media (prefers-reduced-motion: reduce)');
  if (mediaIndex === -1) continue;
  const media = blockInner(css, mediaIndex);
  const mediaRootIndex = media.indexOf(':root');
  if (mediaRootIndex === -1) continue;
  for (const match of blockInner(media, mediaRootIndex).matchAll(DECL_RE)) reduced[match[1]] = oneLine(match[2]);
}

for (const cssName of Object.keys(reduced))
  if (!byCssName.has(cssName)) fail(`the reduced-motion block overrides ${cssName}, which no :root block declares.`);

const writtenNames = (dirPath, dirFiles) => {
  const written = new Set();
  for (const file of dirFiles) {
    if (!/\.tsx?$/.test(file)) continue;
    const text = readFileSync(join(dirPath, file), 'utf8');
    for (const match of text.matchAll(/setProperty\(\s*'(--[\w-]+)'/g)) written.add(match[1]);
    for (const match of text.matchAll(/'(--[\w-]+)'\s*:/g)) written.add(match[1]);
    for (const match of text.matchAll(/const (\w+) = '(--[\w-]+)';/g)) {
      const [, identifier, cssName] = match;
      if (new RegExp(`setProperty\\(\\s*${identifier}\\b|\\[${identifier}\\]\\s*:`).test(text)) written.add(cssName);
    }
  }
  return written;
};

const isReplicaDir = (dirPath, dirFiles) =>
  dirFiles.some(
    (file) => file.endsWith('.usage.md') && /^Group: replicas\s*$/m.test(readFileSync(join(dirPath, file), 'utf8')),
  );

const components = [];
for (const tier of KNOB_TIERS) {
  const tierDir = join(ROOT, 'src/components', tier);
  for (const dir of readdirSync(tierDir).sort()) {
    const dirPath = join(tierDir, dir);
    if (!statSync(dirPath).isDirectory()) continue;
    const dirFiles = readdirSync(dirPath).sort();
    if (isReplicaDir(dirPath, dirFiles)) continue;
    const written = writtenNames(dirPath, dirFiles);
    const knobs = [];
    for (const file of dirFiles) {
      if (!file.endsWith('.css')) continue;
      for (const match of firstRuleInner(readFileSync(join(dirPath, file), 'utf8')).matchAll(DECL_RE)) {
        const [, cssName, value, comment] = match;
        if (written.has(cssName)) continue;
        if (!cssName.startsWith(`--${dir}-`))
          fail(
            `${cssName} in ${tier}/${dir}/${file} does not carry the --${dir}- prefix its scoped contract requires.`,
          );
        const key = camelize(cssName.slice(dir.length + 3));
        if (`--${dir}-${kebabize(key)}` !== cssName)
          fail(`${cssName} does not round-trip through the name derivation (got --${dir}-${kebabize(key)}).`);
        knobs.push({ cssName, key, value: oneLine(value), doc: comment ? oneLine(comment) : '' });
      }
    }
    if (knobs.length) components.push({ dir, key: camelize(dir), label: pascal(dir), knobs });
  }
}

const docFor = (token, origin = '') => {
  const description = token.doc ? ` - ${token.doc.replace(/\.\s*$/, '')}` : '';
  const collapse = reduced[token.cssName] ? ` Collapses to \`${reduced[token.cssName]}\` under reduced motion.` : '';
  const themed = token.themed ? ' Re-derived on every theme root.' : '';
  return `/** \`${token.cssName}\`${origin}${description}. Default: \`${token.value}\`.${collapse}${themed} */`;
};

const members = (tokens, origin) =>
  tokens.flatMap((token) => [docFor(token, origin), `${token.key}?: string | number;`]);

const GENERATED_BY =
  ' * Generated from the token and component CSS by `scripts/gen-theme.mjs` - `pnpm sync` rebuilds it.';

const tokensLines = [];
tokensLines.push('/**');
tokensLines.push(' * The themeable vocabulary, grouped the way the tokens are organised. Each key is one');
tokensLines.push(' * design token in camelCase - `accent` is `--accent`, `radiusMd` is `--radius-md` - and');
tokensLines.push(' * takes any CSS the property accepts, including `var()` references to other tokens.');
tokensLines.push(' *');
tokensLines.push(GENERATED_BY);
tokensLines.push(' */');
for (const group of GROUP_ORDER) {
  tokensLines.push(`export interface ${pascal(group)}Tokens {`);
  tokensLines.push(...members(groups.get(group), ''));
  tokensLines.push('}');
  tokensLines.push('');
}

for (const component of components) {
  tokensLines.push(`/** The scoped properties ${component.label} publishes as its theming contract. */`);
  tokensLines.push(`export interface ${component.label}Tokens {`);
  tokensLines.push(...members(component.knobs, ''));
  tokensLines.push('}');
  tokensLines.push('');
}

tokensLines.push('/** Per-component knobs - retunes every instance of that component. */');
tokensLines.push('export interface ComponentTokens {');
for (const component of components) {
  tokensLines.push(`  /** ${component.label} - its \`--${component.dir}-*\` properties. */`);
  tokensLines.push(`  ${component.key}?: ${component.label}Tokens;`);
}
tokensLines.push('}');
tokensLines.push('');

tokensLines.push('/** One theme: the tokens it repoints, grouped. Every group is optional. */');
tokensLines.push('export interface ThemeTokens {');
for (const group of GROUP_ORDER) {
  tokensLines.push(`  /** ${pascal(group)} tokens. */`);
  tokensLines.push(`  ${group}?: ${pascal(group)}Tokens;`);
}
tokensLines.push('  /** Scoped knobs, per component. */');
tokensLines.push('  components?: ComponentTokens;');
tokensLines.push('  /** Any other custom property, written out in full. */');
tokensLines.push('  custom?: Record<`--${string}`, string | number>;');
tokensLines.push('}');
tokensLines.push('');

tokensLines.push('/**');
tokensLines.push(' * The themes an app ships. `base` lands on `:root`; every other key becomes a');
tokensLines.push(" * `[data-theme='<key>']` block, activated by setting that attribute on any element.");
tokensLines.push(' */');
tokensLines.push('export interface ThemeSet {');
tokensLines.push('  /** The always-applied foundation - light, dark, or whatever the app defaults to. */');
tokensLines.push('  base?: ThemeTokens;');
tokensLines.push('  [name: string]: ThemeTokens | undefined;');
tokensLines.push('}');
tokensLines.push('');

tokensLines.push('export const reducedMotionTokens: Readonly<Record<string, string>> = {');
for (const [cssName, value] of Object.entries(reduced)) tokensLines.push(`  '${cssName}': '${value}',`);
tokensLines.push('};');
tokensLines.push('');

tokensLines.push("declare module 'react' {");
tokensLines.push('  export interface CSSProperties {');
for (const group of GROUP_ORDER)
  for (const token of groups.get(group)) {
    tokensLines.push(`    ${docFor(token)}`);
    tokensLines.push(`    '${token.cssName}'?: string | number;`);
  }
tokensLines.push('  }');
tokensLines.push('}');

const stylesLines = [];
stylesLines.push("import type { CSSProperties } from 'react';");
stylesLines.push('');
for (const [index, component] of components.entries()) {
  const knobs = `its \`--${component.dir}-*\` knobs`;
  if (index) stylesLines.push(`/** Inline styles for ${component.label}, including ${knobs}. */`);
  else {
    stylesLines.push('/**');
    stylesLines.push(` * Inline styles for ${component.label}, including ${knobs}.`);
    stylesLines.push(' *');
    stylesLines.push(' * One interface per component that publishes scoped properties: the design tokens plus');
    stylesLines.push(" * that component's own knobs, and nothing from any other component.");
    stylesLines.push(' *');
    stylesLines.push(GENERATED_BY);
    stylesLines.push(' */');
  }
  stylesLines.push(`export interface ${component.label}Style extends CSSProperties {`);
  for (const knob of component.knobs) {
    stylesLines.push(`  ${docFor(knob)}`);
    stylesLines.push(`  '${knob.cssName}'?: string | number;`);
  }
  stylesLines.push('}');
  stylesLines.push('');
}

const knobCount = components.reduce((total, component) => total + component.knobs.length, 0);
const tokenCount = GROUP_ORDER.reduce((total, group) => total + groups.get(group).length, 0);
const themedCount = [...byCssName.values()].filter((token) => token.themed).length;
const summary =
  `${tokenCount} tokens in ${GROUP_ORDER.length} groups (${themedCount} on every theme root), ` +
  `${knobCount} knobs across ${components.length} components, ` +
  `${Object.keys(reduced).length} reduced-motion overrides`;

const outputs = [
  { rel: TOKENS_OUT, lines: tokensLines },
  { rel: STYLES_OUT, lines: stylesLines },
];

for (const output of outputs) {
  const path = join(ROOT, output.rel);
  const options = await prettier.resolveConfig(path);
  output.text = await prettier.format(output.lines.join('\n') + '\n', { ...options, filepath: path });
  output.path = path;
}

if (check) {
  for (const output of outputs) {
    let current = null;
    try {
      current = readFileSync(output.path, 'utf8');
    } catch {
      fail(`${output.rel} is missing - run "pnpm sync:theme".`);
    }
    if (current !== output.text) fail(`${output.rel} is stale - run "pnpm sync:theme".`);
  }
  console.log(`gen-theme --check: ${summary} in sync.`);
} else {
  for (const output of outputs) writeFileSync(output.path, output.text);
  console.log(`gen-theme: ${outputs.length} files written - ${summary}.`);
}
