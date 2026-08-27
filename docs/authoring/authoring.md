# Adding a component

- Read design-system.md first. Confirm build-new over compose. Pick the tier and contract.
- Follow this checklist top to bottom. `pnpm verify` runs every check.

## 1. Place the file

```
src/components/<tier>/<component>/<Component>.tsx
```

- Directory kebab-case. File PascalCase.
- Scanned tiers today: `primitives`, `composites`, `compound`. `expressive` joins in phase 4.
- tsup derives the entry: `TextField.tsx` becomes `@zyncat/ui/text-field`. Nothing to register.
- Wrong derived name: add to `NAME_OVERRIDES` in `scripts/lib/entries.mjs`. Never rename the file.
- Helpers live in the same directory. Only PascalCase `.tsx` files become entries.
- Start with `'use client'` if it uses state, effects, refs or events.

## 2. Sync the manifests

- Run `pnpm sync`. Every generator reads `scripts/lib/entries.mjs`.
- `pnpm sync:exports` writes `package.json` `exports`. Subpaths are the only public API.
- `pnpm sync:tsconfig` writes `apps/docs/tsconfig.json` `paths`.
- `pnpm docs:props` writes `apps/docs/content/props.generated.ts` from `dist/*.d.ts`.
- `pnpm docs:gen` writes `docs/import-graph.md` and `component-sizes.md`.
- No barrel entry. One import never pulls in code or CSS the app did not ask for.

## 3. Give it its own stylesheet

```
src/components/<tier>/<component>/<component>.css
```

- Import it at the top of the `.tsx`, above everything else.
- Every rendered class must resolve through the module's own import graph (`pnpm check:css`).
- Classes under `src/tokens` are always satisfied. They ship in `styles.css`.
- System contract: tokens, not literals.
- Expressive contract: name every value.
- A named value is a module constant or a `--<component>-<name>` property on the root class.
- Nothing on `:root`.
- No `font-family` stacks. Type reads `--font-sans` / `--font-mono` and the `--size-*` scale.
- A property animated from JS never appears in a CSS `transition` (motion.md).
- Start the stylesheet with the layer order statement and wrap its rules in the components layer.
- Hoist `@property` registrations above the layer block.
- Never `@import` with `layer()`. Bundler css-loaders rewrite it into a dead `@media`.
- Custom-property prefixes are registered in `scripts/check-contracts.mjs`.

## 4. Document the props where they live

- JSDoc on the public props interface feeds the tooltip, the docs table and the MCP.
- Put `@default` on every defaulted prop.

```tsx
/** Preferred side of the trigger; flips when cramped. @default 'bottom' */
side?: 'top' | 'bottom';
```

- `pnpm docs:props` fails on any public prop with no JSDoc.
- Referenced shapes (`DropdownItem`, `TableColumn`, `SelectOption`) document themselves.
- Never hand-write a prop table. `apps/docs/content/*.ts` carries only the `example` string.

## 5. Add the `llms.txt` entry

- Consumers and agents read `llms.txt`. The MCP parses it with `scripts/lib/llms-format.mjs`.
- The heading format is load-bearing:

```
Thing - @zyncat/ui/thing
  What it is, when to pick it over its neighbour. Prop vocabulary as prose.
  <Thing prop="value">...</Thing>
  +4 more props - get_component('thing')
```

- An entry is an index row, capped at ten lines. Per-prop detail lives in the props JSDoc.
- The `+N more props` footer comes from `pnpm sync:llms`. Never hand-write it.
- `pnpm check:llms` verifies coverage, the cap, footers and example props. Run `pnpm build` first.

## 6. Add it to the docs application

- The demo page in `apps/docs/components/pages/` is yours. Exercise the real states.
- For an expressive component the demo is the polish proof.
- Show every state, interruption mid-flight, and reduced motion.
- Registry row, blurb and canonical example live in `apps/docs/content/`.

## 7. Run the checks

- `pnpm format`, then `pnpm sync`, then `pnpm verify`.
- `pnpm verify` runs everything in parallel lanes; `check:llms` and `check:props` wait on the build.
- `check:contracts` enforces the mechanical contract rules and ratchets legacy debt via `scripts/contracts-baseline.json`.

## Conventions the linters do not catch

- No comments in source. Exceptions: public-props JSDoc and the token `.css` files.
- Sequence motion with `Playback.finished` only.
- `pnpm`, never `npm`.
- Named constants, not magic numbers.
- Reuse the internal machinery. design-system.md has the list.
- The repo map lives in `CLAUDE.md`.
