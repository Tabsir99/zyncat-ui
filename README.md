# Zyncat UI

A premium React design system - modern CSS + a small, closed token vocabulary, applied
consistently. Restraint, calm motion, no Tailwind, no CSS-in-JS, no UI libraries.

**React 19 - TypeScript - ships compiled ESM + types.** Import the whole library or a single
component; link one base stylesheet - each component loads its own CSS automatically.

## Install

```bash
pnpm add @zyncat/ui
# peers (you likely already have them):
pnpm add react react-dom
```

| Peer                  | Range | Used for                                                             |
| --------------------- | ----- | -------------------------------------------------------------------- |
| `react` / `react-dom` | `^19` | components; `createRoot`/`createPortal` for imperative toast/tooltip |

Enter/exit, layout and gesture animation are built in (a small WAAPI engine) - no animation library to install.

Icons are **bundled** (a small curated Phosphor set) - there is no icon peer to install.

## Use it

No bundler config and no `transpilePackages` - the package ships built ESM with the `'use client'`
directives intact, so Next.js App Router boundaries just work.

```tsx
import { Button, toast } from '@zyncat/ui';
import '@zyncat/ui/styles.css'; // base layer - link once, at the app root
```

`styles.css` is the **base layer only** - fonts, design tokens (the `:root` custom
properties) and the shared `glass` utility. Link it exactly once at the app root.

You never import per-component CSS: every component imports its own stylesheet, so your
bundler code-splits and lazy-loads it with the component. Import `@zyncat/ui/dialog` and
only `dialog.css` ships (plus the `overlay`/`icon` styles it reuses, deduped) - not the
other 30 components' CSS.

### Import a single component

Every component is also a subpath export, so you can pull just one:

```tsx
import { Button } from '@zyncat/ui/button';
import { DateField } from '@zyncat/ui/date-field';
```

The barrel is side-effect-free and tree-shakes, so `import { Button } from '@zyncat/ui'` is
equally lean in a bundler - subpaths help in non-bundled or explicit setups. CSS follows the
same module graph: components you don't use drop their stylesheets too.

## Components

| Group               | Components                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Primitives          | Button, Collapse, Badge, StatusBadge, CountBadge                                              |
| Forms               | TextField, NumberField, OtpField, Textarea, Checkbox, Toggle, RadioGroup, Select, MultiSelect |
| Data                | Avatar, AvatarGroup, Tag, ToggleTag, Table, Pagination                                        |
| Date, time & tabs   | DateField, DateTimeField, DateRangeField, TimeField, Tabs                                     |
| Overlays & feedback | Alert, Toast, Tooltip, Dialog, Popover, Sheet                                                 |

Each is a named export from the barrel and a subpath (`@zyncat/ui/<kebab-name>`). Props are
documented inline in the types; see [`llms.txt`](./llms.txt) for per-component examples.

## For AI coding agents

**MCP server (preferred).** The package bundles a zero-dependency MCP server (stdio) so agents
query the API surface instead of grepping `node_modules`: `list_components` (index + conventions),
`get_component` (usage docs + complete prop types, shared type chunks inlined), `search_api`
(which component owns a prop/type/token), `get_tokens` (the token vocabulary with real values).
Register it in the consuming project - for Claude Code, `.mcp.json` at the project root:

```json
{ "mcpServers": { "zyncat-ui": { "command": "node", "args": ["./node_modules/@zyncat/ui/dist/mcp.js"] } } }
```

Any MCP client works (also exposed as the `zyncat-ui-mcp` bin). The server reads the installed
package's `llms.txt`, `dist/*.d.ts` and `src/tokens/*.css` at call time, so answers always match
the installed version.

Without MCP, the same contract is readable directly:

- **`node_modules/@zyncat/ui/dist/*.d.ts`** - every component's props carry inline TSDoc. This is
  the machine-readable source of truth (e.g. `dist/button.d.ts` fully describes `ButtonProps`).
- **`llms.txt`** (package root) - a compact, per-component index: purpose - import - a minimal
  example. Cheaper to scan than every `.d.ts`.
- This README.

## Copy-paste instead

The tarball also ships `src/`, so you can lift a component straight from
`node_modules/@zyncat/ui/src/components/<name>/` into your project. Components aren't fully
self-contained - they share `src/tokens/`, the `motion-tokens` bridge, the internal `icon/`, and a
few `*-core` helpers - so copy those alongside. (A shadcn-style registry/CLI could automate this
later.)

## Icons

Components render their own glyphs from a small curated Phosphor set, **bundled in** - no icon peer
to install. Zyncat UI does **not** export an `Icon` component, so where a prop takes an icon
(`leadingIcon`, a `Tag`'s `icon`, ...) or a component composes icons as children (`Button`), pass
your own node - any `ReactNode` (e.g. an `@phosphor-icons/react` element, if you choose to use it).

## What's inside

```
src/                source (also shipped, for copy-paste)
-- index.ts         public barrel
-- styles.css       base layer: fonts + tokens + glass (link once)
-- tokens/          CSS custom properties + motion-tokens.ts (JS and CSS motion bridge)
-- components/      <domain>/Name.tsx + name.css (each Tsx imports its own CSS -> lazy-loaded)
dist/               compiled ESM + .d.ts - what you import
```

## Notes

- **Fonts.** `src/tokens/fonts.css` pulls Geist + Geist Mono from Google Fonts via a remote
  `@import`. Self-host the families to drop the render-blocking network hop.
- **Styling is token-driven.** Re-skin by overriding the CSS custom properties in your own
  stylesheet loaded after `@zyncat/ui/styles.css` - never fork the source.

## Develop

```bash
pnpm install
pnpm build       # tsup - dist/ (ESM + .d.ts)
pnpm typecheck   # tsc --noEmit
pnpm format      # prettier --write
```
