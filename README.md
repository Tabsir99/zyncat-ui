# premium-ui

A premium React design system — modern CSS + a small, closed token vocabulary, applied
consistently. Restraint, calm motion, no Tailwind, no CSS-in-JS, no UI libraries.

**React 19 · TypeScript · ships compiled ESM + types.** Import the whole library or a single
component; link one stylesheet.

## Install

```bash
pnpm add premium-ui
# peers (you likely already have them):
pnpm add react react-dom motion
```

| Peer                  | Range | Used for                                                             |
| --------------------- | ----- | -------------------------------------------------------------------- |
| `react` / `react-dom` | `^19` | components; `createRoot`/`createPortal` for imperative toast/tooltip |
| `motion`              | `^12` | enter/exit + layout animation (`motion/react`)                       |

Icons are **bundled** (a small curated Phosphor set) — there is no icon peer to install.

## Use it

No bundler config and no `transpilePackages` — the package ships built ESM with the `'use client'`
directives intact, so Next.js App Router boundaries just work.

```tsx
import { Button, toast } from 'premium-ui';
import 'premium-ui/styles.css'; // link once, at the app root
```

Link `styles.css` exactly once — it's the full token + component manifest
(fonts → primitives → semantics → components).

### Import a single component

Every component is also a subpath export, so you can pull just one:

```tsx
import { Button } from 'premium-ui/button';
import { DateField } from 'premium-ui/date-field';
```

The barrel is side-effect-free and tree-shakes, so `import { Button } from 'premium-ui'` is
equally lean in a bundler — subpaths help in non-bundled or explicit setups.

## Components

| Group               | Components                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| Primitives          | Button · Collapse · Badge · StatusBadge · CountBadge                                                  |
| Forms               | TextField · NumberField · OtpField · Textarea · Checkbox · Toggle · RadioGroup · Select · MultiSelect |
| Data                | Avatar · AvatarGroup · Tag · ToggleTag · Table · Pagination                                           |
| Date, time & tabs   | DateField · DateTimeField · DateRangeField · TimeField · Tabs                                         |
| Overlays & feedback | Alert · Toast · Tooltip · Dialog · Overlay · Sheet                                                    |

Each is a named export from the barrel and a subpath (`premium-ui/<kebab-name>`). Props are
documented inline in the types; see [`llms.txt`](./llms.txt) for per-component examples.

## For AI coding agents

Once installed, an agent doesn't need to read the component source — the contract is the shipped
types:

- **`node_modules/premium-ui/dist/*.d.ts`** — every component's props carry inline TSDoc. This is
  the machine-readable source of truth (e.g. `dist/button.d.ts` fully describes `ButtonProps`).
- **`llms.txt`** (package root) — a compact, per-component index: purpose · import · a minimal
  example. Cheaper to scan than every `.d.ts`.
- This README.

## Copy-paste instead

The tarball also ships `src/`, so you can lift a component straight from
`node_modules/premium-ui/src/components/<name>/` into your project. Components aren't fully
self-contained — they share `src/tokens/`, the `motion-tokens` bridge, the internal `icon/`, and a
few `*-core` helpers — so copy those alongside. (A shadcn-style registry/CLI could automate this
later.)

## Icons

Components render their own glyphs from a small curated Phosphor set, **bundled in** — no icon peer
to install. premium-ui does **not** export an `Icon` component, so where a prop takes an icon
(`iconLeft`, `leadingIcon`, a `Tag`'s `icon`, …) pass your own node — any `ReactNode` (e.g. an
`@phosphor-icons/react` element, if you choose to use it).

## What's inside

```
src/                source (also shipped, for copy-paste)
├─ index.ts         public barrel
├─ styles.css       @import manifest (link once)
├─ tokens/          CSS custom properties + motion-tokens.ts (JS↔CSS motion bridge)
└─ components/      <domain>/Name.tsx + name.css
dist/               compiled ESM + .d.ts — what you import
```

## Notes

- **Fonts.** `src/tokens/fonts.css` pulls Geist + Geist Mono from Google Fonts via a remote
  `@import`. Self-host the families to drop the render-blocking network hop.
- **Styling is token-driven.** Re-skin by overriding the CSS custom properties in your own
  stylesheet loaded after `premium-ui/styles.css` — never fork the source.

## Develop

```bash
pnpm install
pnpm build       # tsup → dist/ (ESM + .d.ts)
pnpm typecheck   # tsc --noEmit
pnpm format      # prettier --write
```
