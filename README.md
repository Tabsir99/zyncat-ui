# premium-ui

A premium React design system — modern CSS + a small, closed token vocabulary, applied
consistently. Restraint, calm motion, no Tailwind, no CSS-in-JS, no UI libraries.

Shipped as **source** (`.tsx` + `.css`), not a built/published npm package. Consumers transpile
it through their own bundler. Distribute it as a **git dependency** (or submodule).

## Install (git dependency)

```bash
pnpm add github:<your-org>/premium-ui#v0.1.0   # pin to a tag or commit
```

Then install the peers (you almost certainly already have them):

```bash
pnpm add react react-dom motion @phosphor-icons/react
```

| Peer | Range | Used for |
| --- | --- | --- |
| `react` / `react-dom` | `^19` | components; `createRoot`/`createPortal` for imperative toast & tooltip mounts |
| `motion` | `^12` | enter/exit + layout animation (`motion/react`) |
| `@phosphor-icons/react` | `^2.1` | the only icon source — every glyph resolves through `<Icon>` |

## Use it (two steps)

**1. Transpile the source.** Because the package ships `.tsx`/`.css`, the consuming app must
transpile it. In Next.js:

```ts
// next.config.ts
export default {
  transpilePackages: ['premium-ui'],
};
```

Vite needs no config — it transpiles linked source natively. The `'use client'` directives are
preserved in the source, so App Router client boundaries stay correct.

**2. Import the components and link the stylesheet once** (e.g. in your root layout):

```tsx
import { Button, Icon, toast } from 'premium-ui';
import 'premium-ui/styles.css';
```

`styles.css` is the full token + component manifest (fonts → primitives → semantics → components
→ brand). Link it exactly once at the app root.

## What's inside

```
src/
├─ index.ts        public barrel — the only import surface
├─ styles.css      @import manifest (link this once)
├─ tokens/         CSS custom properties + motion-tokens.ts (the JS↔CSS motion bridge)
├─ components/     <domain>/Name.tsx + name.css
└─ brand/          logo marks
```

Self-contained: every import is either relative or one of the four peers above — nothing reaches
outside the package.

## Notes

- **Fonts.** `src/tokens/fonts.css` pulls Geist + Geist Mono from Google Fonts via a remote
  `@import`. It works as-is; self-host the families if you want to drop the render-blocking
  network hop.
- **Icons are an open set.** `<Icon name="…" />` takes any Phosphor kebab name
  (`paper-plane-tilt`) or a semantic alias from `src/components/icon/aliases.ts` (`publish`,
  `schedule`, …). The whole Phosphor set is pulled in (dynamic lookup, not tree-shaken) — that's
  the cost of the open set.
- **Still carries some original branding** — the `brand/` logo marks and the `SchedulyMotion` /
  `SchedulyToast` export names are project-specific. Rename or drop them when you generalize.

## Develop

```bash
pnpm install
pnpm typecheck     # tsc --noEmit
pnpm format        # prettier --write
```
