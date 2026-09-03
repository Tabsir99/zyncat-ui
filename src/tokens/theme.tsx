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

type TokenTree = { [key: string]: string | number | TokenTree | undefined };

const BASE = 'base';

const kebabize = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .replace(/([0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

const resolveDeclarations = (tokens?: ThemeTokens): [string, string][] => {
  const declarations: [string, string][] = [];
  const walk = (value: TokenTree[string], path: string[]) => {
    if (value == null) return;
    if (typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) walk(child, [...path, kebabize(key)]);
    } else {
      declarations.push([`--${path.join('-')}`, String(value)]);
    }
  };
  for (const [category, value] of Object.entries(tokens ?? {})) {
    if (value == null) continue;
    if (category === 'custom') {
      for (const [property, custom] of Object.entries(value as TokenTree))
        if (custom != null) declarations.push([property, String(custom)]);
    } else {
      walk(value as TokenTree, []);
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
