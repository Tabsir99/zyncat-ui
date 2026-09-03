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

const DECISIONS_FILE = 'decisions.css';

const THEME_TREE = [
  {
    key: 'color',
    doc: 'The hues, and the neutral roles a light or dark theme sets directly.',
    scalars: ['--accent', '--neutral', '--success', '--warning', '--danger'],
    groups: [
      { key: 'bg', file: 'semantic.css', doc: 'Surfaces - the canvas, cards, fills and the overlay scrim.' },
      { key: 'text', file: 'semantic.css', doc: 'Ink, from strong to disabled, and the faces on a fill.' },
      { key: 'border', file: 'semantic.css', doc: 'Hairlines, from subtle to strong.' },
    ],
  },
  {
    key: 'type',
    doc: 'The faces.',
    scalars: [],
    groups: [
      { key: 'font', file: DECISIONS_FILE, doc: 'The body face and the code face - every type bundle follows.' },
    ],
  },
  { key: 'shape', doc: 'Roundness.', scalars: ['--radius'], groups: [] },
  {
    key: 'motion',
    doc: 'How surfaces move.',
    scalars: [],
    groups: [
      { key: 'duration', file: 'motion.css', doc: 'The time bands.' },
      { key: 'ease', file: 'motion.css', doc: 'The brand curves.' },
      { key: 'distance', file: 'motion.css', doc: 'How far a surface travels on the way in or out.' },
      { key: 'scale', file: 'motion.css', doc: 'What a surface scales from on the way in, and to on the way out.' },
    ],
  },
];

const KNOB_TIERS = ['expressive', 'compound'];

const DECL_RE = /(?:\/\*((?:(?!\*\/)[^])*?)\*\/[ \t]*\n[ \t]*)?(--[\w-]+)\s*:\s*([^;]+);[ \t]*(?:\/\*([^]*?)\*\/)?/g;

const declOf = (match) => {
  const [, above, cssName, value, trailing] = match;
  return { cssName, value, comment: trailing ?? above };
};

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
if (!files.includes(DECISIONS_FILE)) fail(`src/styles.css does not import ${DECISIONS_FILE} - the top of every theme.`);
for (const category of THEME_TREE)
  for (const group of category.groups)
    if (!files.includes(group.file))
      fail(
        `src/styles.css does not import ${group.file}, the source of \`${category.key}.${group.key}\` in the theme tree.`,
      );

const tokens = [];
const reduced = {};
const byCssName = new Map();

for (const file of files) {
  const css = readFileSync(join(ROOT, 'src/tokens', file), 'utf8');

  for (const block of tokenBlocks(css)) {
    for (const match of block.inner.matchAll(DECL_RE)) {
      const { cssName, value, comment } = declOf(match);
      if (byCssName.has(cssName)) fail(`${cssName} is declared in both ${byCssName.get(cssName).file} and ${file}.`);
      if (block.themed && !value.includes('var('))
        fail(
          `${cssName} in ${file} sits on the theme-root block with a literal value - a literal there resets the consumer's :root decision inside every [data-theme] subtree. Only tokens that derive from another token belong on ":root, [data-theme]".`,
        );
      if (file === DECISIONS_FILE && block.themed)
        fail(
          `${cssName} is a decision and sits on the theme-root block - decisions are set, never derived, so they live on :root alone.`,
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
      tokens.push(token);
    }
  }

  const mediaIndex = css.indexOf('@media (prefers-reduced-motion: reduce)');
  if (mediaIndex === -1) continue;
  const media = blockInner(css, mediaIndex);
  const mediaRootIndex = media.indexOf(':root');
  if (mediaRootIndex === -1) continue;
  for (const match of blockInner(media, mediaRootIndex).matchAll(DECL_RE)) {
    const { cssName, value } = declOf(match);
    reduced[cssName] = oneLine(value);
  }
}

for (const cssName of Object.keys(reduced))
  if (!byCssName.has(cssName)) fail(`the reduced-motion block overrides ${cssName}, which no :root block declares.`);

const decisions = tokens.filter((token) => token.file === DECISIONS_FILE);
if (!decisions.length) fail(`${DECISIONS_FILE} declares no tokens.`);

const placed = new Set();
const categories = THEME_TREE.map((category) => {
  const scalars = category.scalars.map((cssName) => {
    const token = byCssName.get(cssName);
    if (!token) fail(`the theme tree names ${cssName} under \`${category.key}\`, which no token file declares.`);
    if (token.file !== DECISIONS_FILE)
      fail(
        `${cssName} sits directly under \`${category.key}\` in the theme tree but is not a decision - only ${DECISIONS_FILE} tokens go there.`,
      );
    placed.add(cssName);
    return token;
  });
  const groups = category.groups.map((group) => {
    const prefix = `--${group.key}-`;
    const members = tokens
      .filter((token) => token.file === group.file && !token.themed && token.cssName.startsWith(prefix))
      .map((token) => ({ ...token, key: camelize(token.cssName.slice(prefix.length)) }));
    if (!members.length)
      fail(`\`${category.key}.${group.key}\` in the theme tree matches no :root-only token in ${group.file}.`);
    for (const member of members) {
      if (`${prefix}${kebabize(member.key)}` !== member.cssName)
        fail(`${member.cssName} does not round-trip through \`${category.key}.${group.key}.${member.key}\`.`);
      placed.add(member.cssName);
    }
    return { ...group, label: `${pascal(category.key)}${pascal(group.key)}Tokens`, members };
  });
  return { ...category, label: `${pascal(category.key)}Tokens`, scalars, groups };
});

for (const token of decisions)
  if (!placed.has(token.cssName)) fail(`${token.cssName} is a decision with no place in the theme tree.`);

const roleFiles = new Set(THEME_TREE.flatMap((category) => category.groups.map((group) => group.file)));
roleFiles.delete(DECISIONS_FILE);
for (const token of tokens)
  if (roleFiles.has(token.file) && !token.themed && !placed.has(token.cssName))
    fail(
      `${token.cssName} sits on the :root block of ${token.file}, the block a theme sets, but has no place in the theme tree - derive it on the theme-root block, or give its prefix a group in the tree.`,
    );

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

const PRIVATE_PREFIX = '--_';

const groupKnobs = (dir, knobs) => {
  const byHead = new Map();
  for (const knob of knobs) {
    const head = knob.rest.split('-')[0];
    if (!byHead.has(head)) byHead.set(head, []);
    byHead.get(head).push(knob);
  }
  const entries = [];
  for (const [head, members] of byHead) {
    const collides = members.some((knob) => knob.rest === head);
    if (members.length < 2 || collides) {
      for (const knob of members) {
        knob.key = camelize(knob.rest);
        if (`--${dir}-${kebabize(knob.key)}` !== knob.cssName)
          fail(`${knob.cssName} does not round-trip through the name derivation (got --${dir}-${kebabize(knob.key)}).`);
        entries.push({ key: knob.key, knob });
      }
      continue;
    }
    for (const knob of members) {
      knob.key = camelize(knob.rest.slice(head.length + 1));
      if (`--${dir}-${head}-${kebabize(knob.key)}` !== knob.cssName)
        fail(
          `${knob.cssName} does not round-trip through the name derivation (got --${dir}-${head}-${kebabize(knob.key)}).`,
        );
    }
    const series = members.every((knob) => /^\d+$/.test(knob.key));
    if (series) for (const knob of members) if (!knob.doc) knob.doc = members[0].doc;
    entries.push({ key: camelize(head), head, label: `${pascal(dir)}${pascal(head)}Tokens`, members, series });
  }
  return entries;
};

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
        const { cssName, value, comment } = declOf(match);
        if (cssName.startsWith(PRIVATE_PREFIX)) continue;
        if (!cssName.startsWith(`--${dir}-`))
          fail(
            `${cssName} in ${tier}/${dir}/${file} does not carry the --${dir}- prefix its scoped contract requires.`,
          );
        if (written.has(cssName))
          fail(
            `${cssName} in ${tier}/${dir} is written by the component's own JS - per-frame state is private, name it ${PRIVATE_PREFIX}${dir}-....`,
          );
        knobs.push({
          cssName,
          rest: cssName.slice(dir.length + 3),
          value: oneLine(value),
          doc: comment ? oneLine(comment) : '',
          file: `${tier}/${dir}/${file}`,
        });
      }
    }
    if (!knobs.length) continue;
    const entries = groupKnobs(dir, knobs);
    for (const knob of knobs)
      if (!knob.doc)
        fail(
          `${knob.cssName} in ${knob.file} is a public knob without a doc line - say what it does in a comment above the declaration, or make it private (${PRIVATE_PREFIX}${dir}-...).`,
        );
    components.push({ dir, key: camelize(dir), label: pascal(dir), knobs, entries });
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
tokensLines.push(' * The themeable vocabulary. A theme is four categories - `color`, `type`, `shape`, `motion` -');
tokensLines.push(' * each holding the decisions and the roles a theme sets, grouped by what they are; then the');
tokensLines.push(' * scoped knobs under `components`. Every other token derives from those or is a scale a page');
tokensLines.push(' * reads, and goes by its CSS name under `custom`. A path is the CSS name: `color.bg.app` is');
tokensLines.push(' * `--bg-app`, `type.font.body` is `--font-body`, `shape.radius` is `--radius`. Values take any');
tokensLines.push(' * CSS the property accepts, including `var()` references.');
tokensLines.push(' *');
tokensLines.push(GENERATED_BY);
tokensLines.push(' */');
for (const category of categories) {
  for (const group of category.groups) {
    tokensLines.push(`/** ${group.doc} */`);
    tokensLines.push(`export interface ${group.label} {`);
    tokensLines.push(...members(group.members, ''));
    tokensLines.push('}');
    tokensLines.push('');
  }
  tokensLines.push(`/** ${category.doc} */`);
  tokensLines.push(`export interface ${category.label} {`);
  tokensLines.push(...members(category.scalars, ''));
  for (const group of category.groups) {
    tokensLines.push(`  /** ${group.doc} */`);
    tokensLines.push(`  ${group.key}?: ${group.label};`);
  }
  tokensLines.push('}');
  tokensLines.push('');
}

const groupDoc = (component, entry) =>
  entry.series
    ? `\`${entry.members[0].cssName}\` to \`${entry.members.at(-1).cssName}\` - ${entry.members[0].doc.replace(/\.\s*$/, '')}.`
    : `The \`--${component.dir}-${entry.head}-*\` knobs.`;

for (const component of components) {
  for (const entry of component.entries) {
    if (!entry.members) continue;
    tokensLines.push(`/** ${groupDoc(component, entry)} */`);
    tokensLines.push(`export interface ${entry.label} {`);
    tokensLines.push(...members(entry.members, ''));
    tokensLines.push('}');
    tokensLines.push('');
  }
  tokensLines.push(`/** The scoped properties ${component.label} publishes as its theming contract. */`);
  tokensLines.push(`export interface ${component.label}Tokens {`);
  for (const entry of component.entries) {
    if (entry.members) {
      tokensLines.push(`  /** ${groupDoc(component, entry)} */`);
      tokensLines.push(`  ${entry.key}?: ${entry.label};`);
    } else {
      tokensLines.push(...members([entry.knob], ''));
    }
  }
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

tokensLines.push('/**');
tokensLines.push(' * Every design token by its CSS name, with what it does and its default. The type behind');
tokensLines.push(' * `custom` in a theme and behind the `style` prop of every component.');
tokensLines.push(' */');
tokensLines.push('export interface TokenProperties {');
for (const token of tokens) {
  tokensLines.push(`  ${docFor(token)}`);
  tokensLines.push(`  '${token.cssName}'?: string | number;`);
}
tokensLines.push('}');
tokensLines.push('');

tokensLines.push('/** The CSS name of every design token. */');
tokensLines.push('export type TokenName = keyof TokenProperties;');
tokensLines.push('');

tokensLines.push('/**');
tokensLines.push(' * One theme: the tokens it repoints, by category. Set a decision and every token that derives');
tokensLines.push(' * from it follows; set a role to break it away. Everything is optional.');
tokensLines.push(' */');
tokensLines.push('export interface ThemeTokens {');
for (const category of categories) {
  tokensLines.push(`  /** ${category.doc} */`);
  tokensLines.push(`  ${category.key}?: ${category.label};`);
}
tokensLines.push('  /** Scoped knobs, per component. */');
tokensLines.push('  components?: ComponentTokens;');
tokensLines.push(
  '  /** Any token by its CSS name - the ones the categories leave out - or a custom property of your own. */',
);
tokensLines.push('  custom?: TokenProperties & Record<`--${string}`, string | number>;');
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
tokensLines.push('  export interface CSSProperties extends TokenProperties {}');
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
const roleCount = placed.size - decisions.length;
const plumbingCount = tokens.length - decisions.length - roleCount;
const themedCount = tokens.filter((token) => token.themed).length;
const summary =
  `${decisions.length} decisions and ${roleCount} roles in ${categories.length} categories, ` +
  `${plumbingCount} plumbing tokens by name (${themedCount} on every theme root), ` +
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
