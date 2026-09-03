import { reducedMotionTokens, type ThemeSet, type ThemeTokens } from './theme-tokens.generated';

export type * from './theme-tokens.generated';

export interface ZyncatThemeProps {
  /**
   * The app's themes. `base` lands on `:root`; every other key becomes a
   * `[data-theme='<key>']` block, activated by setting that attribute on `<html>`
   * or any subtree root.
   */
  theme?: ThemeSet;
}

type TokenGroup = Record<string, string | number | undefined>;

const BASE = 'base';

const kebabize = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .replace(/([0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

const pushDeclarations = (into: [string, string][], group: TokenGroup, prefix: string) => {
  for (const [key, value] of Object.entries(group ?? {}))
    if (value != null) into.push([`--${prefix}${kebabize(key)}`, String(value)]);
};

const resolveDeclarations = (tokens?: ThemeTokens): [string, string][] => {
  const declarations: [string, string][] = [];
  for (const [key, values] of Object.entries(tokens ?? {})) {
    if (values == null) continue;
    if (key === 'custom') {
      for (const [property, value] of Object.entries(values as TokenGroup))
        if (value != null) declarations.push([property, String(value)]);
    } else if (key === 'components') {
      for (const [component, knobs] of Object.entries(values as Record<string, TokenGroup>))
        if (knobs) pushDeclarations(declarations, knobs, `${kebabize(component)}-`);
    } else if (typeof values === 'object') {
      pushDeclarations(declarations, values as TokenGroup, '');
    } else {
      declarations.push([`--${kebabize(key)}`, String(values)]);
    }
  }
  return declarations;
};

const cssBlock = (selector: string, declarations: [string, string][], indent = ''): string =>
  `${indent}${selector} {\n${declarations.map(([name, value]) => `${indent}  ${name}: ${value};`).join('\n')}\n${indent}}`;

const renderThemeCss = (theme?: ThemeSet): string => {
  const blocks = Object.entries(theme ?? {})
    .map(([name, tokens]) => ({ name, declarations: resolveDeclarations(tokens) }))
    .filter((block) => block.declarations.length)
    .sort((a, b) => Number(b.name === BASE) - Number(a.name === BASE));

  const collapsed: [string, string][] = [];
  const seen = new Set<string>();
  for (const [cssName] of blocks.flatMap((block) => block.declarations)) {
    const collapseValue = reducedMotionTokens[cssName];
    if (collapseValue && !seen.has(cssName)) {
      seen.add(cssName);
      collapsed.push([cssName, collapseValue]);
    }
  }

  const selectorFor = (name: string) => (name === BASE ? ':root' : `[data-theme='${name}']`);
  const parts = blocks.map((block) => cssBlock(selectorFor(block.name), block.declarations));
  if (collapsed.length) {
    const scopes = blocks.map((block) => selectorFor(block.name)).join(',\n  ');
    parts.push(`@media (prefers-reduced-motion: reduce) {\n${cssBlock(scopes, collapsed, '  ')}\n}`);
  }
  return parts.join('\n');
};

export function defineTheme(tokens: ThemeTokens): ThemeTokens {
  return tokens;
}

export function ZyncatTheme({ theme }: ZyncatThemeProps) {
  const css = renderThemeCss(theme);
  if (!css) return null;
  return <style data-zyncat-theme="">{css}</style>;
}
