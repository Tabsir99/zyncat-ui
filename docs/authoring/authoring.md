# Adding a component

Read `design-system.md` first and confirm you should be building a new component
at all. If you are, this is the complete checklist. Every step has a check that
fails loudly when you skip it, and `pnpm verify` runs all of them.

Two of the steps are owned by agents rather than by you: **`zyncat-tester`**
takes step 6, **`zyncat-docs`** takes step 5 and the prose half of step 7. Hand
those off. What is left — the component, its CSS, its prop JSDoc and its demo
page — is the design work, and it is the only part worth your context.

## 1. Place the file

```
src/components/<tier>/<component>/<Component>.tsx
```

`<tier>` is `primitives`, `composites` or `compound` — the three tiers tsup
scans. The component directory is kebab-case, the file is **PascalCase**.

tsup discovers the entry automatically: it scans those three tiers for
PascalCase `.tsx` files and derives the public entry name by kebab-casing the
filename. `TextField.tsx` becomes `@zyncat/ui/text-field`. Nothing to register.

If the derived name is wrong, add an override to `NAME_OVERRIDES` in
`scripts/lib/entries.mjs` rather than renaming the file away from the component
name. That module is the single scanner every consumer of the entry list reads.

Put helper modules for the component in the same directory — hooks, a store,
subcomponents. Only PascalCase `.tsx` files become entries, so a
`use-thing.ts` next to `Thing.tsx` stays internal.

Start the file with `'use client'` if it uses state, effects, refs or events.

## 2. Sync the manifests

```bash
pnpm sync
```

`scripts/lib/entries.mjs` is the one scanner that derives the public entry list
from the file tree; tsup, the playground's Vite aliases and these two syncs all
read it, so there is nothing to register by hand:

| Written                                      | By                   | Why it matters                                            |
| -------------------------------------------- | -------------------- | --------------------------------------------------------- |
| `package.json` `exports`                     | `pnpm sync:exports`  | Subpaths are the only public API — no entry, no import    |
| `playground/tsconfig.json` `paths`           | `pnpm sync:tsconfig` | The playground resolves `@zyncat/ui/thing` to your source |
| `props.generated.ts` in the playground       | `pnpm docs:props`    | The docs prop table, read out of `dist/*.d.ts`            |
| `docs/import-graph.md`, `component-sizes.md` | `pnpm docs:gen`      | Repo shape                                                |

`pnpm verify` runs the check half of each, so a manifest you forgot to sync
fails the build instead of failing silently.

Subpaths are the **only** public API. There is no barrel entry, deliberately: it
guarantees one import can never pull in modules or CSS the app did not ask for.
`vitest.config.ts` builds its test aliases from the exports map, so a component
without an entry cannot be imported the way a consumer imports it — which is how
every browser test in this repo imports things.

## 3. Give it its own stylesheet

```
src/components/<tier>/<component>/<component>.css
```

Import it at the top of the `.tsx`, above everything else:

```tsx
'use client';

import './thing.css';
```

**Every class you render must be defined by a stylesheet reachable through that
module's own import graph.** `pnpm check:css` enforces this. The failure it
guards is "works in the playground, unstyled in a real app": the playground
loads every stylesheet at once, so it can never catch a missing import, but each
dist subpath must be style-complete on its own.

Classes defined under `src/tokens` are always satisfied — those ship in
`styles.css`, which consumers link once at the app root.

Use tokens, not literals. If the component animates a property from JS, do not
put that property in a CSS `transition` — see `motion.md`.

## 4. Document the props where they live

The consumer's editor tooltip, the docs site's prop table and the MCP's answer
all come from **one** place: the JSDoc on the public props interface. Write it
there, with an `@default` tag on every prop that has a default:

```tsx
export interface ThingProps {
  /** Preferred side of the trigger; flips when cramped. @default 'bottom' */
  side?: 'top' | 'bottom';
}
```

`pnpm docs:props` reads it back out of `dist/*.d.ts` into the playground's prop
table, and **fails the build on any public prop with no JSDoc** — a blank cell
in the docs is not an option. It also emits a table for each named shape a prop
references — `DropdownItem`, `TableColumn`, `SelectOption` — so a row type
documents itself.

Never hand-write a prop table. `playground/src/content/*.ts` carries only the
`example` string.

## 5. Add the `llms.txt` entry

Consumers and coding agents read `llms.txt`, and the bundled MCP server parses it
with `scripts/lib/llms-format.mjs` — the same parser the lint runs, so the two
can never disagree. The heading format is load-bearing:

```
Thing - @zyncat/ui/thing
  One or two sentences on what it is and when to pick it over the neighbour it
  is most often confused with. Then the prop vocabulary as prose.
  <Thing prop="value">...</Thing>
  +4 more props - get_component('thing')
```

An entry is an **index row, capped at ten lines of prose** — the disambiguating
sentence, the value vocabularies, one or two examples. Per-prop detail belongs in
the props JSDoc, which `get_component` already returns beside the entry.

The `+N more props` footer is generated by `pnpm sync:llms`, never hand-written.
It counts the component-specific props the entry does not name, so a reader who
only ever sees this file is told what `get_component` would add.

`pnpm check:llms` verifies that every public subpath has an entry (unless it is
in that script's `SUPPORTING` list, for modules documented by their types
alone), that no entry exceeds the cap, that each footer matches the built types,
and that **every JSX attribute in your example resolves to a real prop**. It
needs `dist/`, so run `pnpm build` first.

That last check is why examples here do not rot: a renamed prop breaks the
build, not just the docs.

## 6. Write the tests

Hand this to the **`zyncat-tester`** agent, which owns the suite. What follows
is what it works from, and what you need to know to read its report.

`TESTING.md` is the contract — read it. In short:

```
tests/<group>-<topic>.browser.test.tsx    real Chromium
tests/<group>-<topic>.unit.test.ts        pure logic only, no DOM
```

Browser tests import the component **exactly as a consumer does** —
`@zyncat/ui/thing`, never a relative `src/` path. That is what makes a passing
test evidence that the package actually works.

There is a wrinkle worth knowing: `vitest` resolves that subpath to your
**source** through an alias it builds from the exports map, but `tsc` resolves
it to the **built** `dist/*.d.ts`. So a test that uses an API you just added
typechecks against the last build and fails with "property does not exist" until
you `pnpm build`. The test itself passes the whole time. Rebuild, do not reach
for a relative import.

Cover the component against the seven axes in `TESTING.md`. Not every axis
applies to every component; the ones that apply are not optional. For anything
portalled, animated or measured, the observation contract (axis 2) is the one
that catches the bugs this suite exists for.

The file prefix you choose must have a row in the Ownership table at the bottom
of `TESTING.md`; `pnpm check:authoring` fails on a prefix with no row, and on a
row with no files.

Anything with layout, animation or measurement is a **browser** test. jsdom has
no layout engine and no Web Animations API, so a unit test passes straight
through the interesting failures.

Browser runs are serialised machine-wide by a lock file. Run them through the
script, never `vitest` directly:

```bash
node scripts/test.mjs thing        # one file while iterating
node scripts/test.mjs              # the whole suite, at the end
```

## 7. Add it to the playground

`playground/` is how you look at the thing, and it is also the public docs site.
Two separate jobs:

- **The demo page**, one file per group in `playground/src/pages/`, is yours. It is the
  design work — the component exercised in a real app, in the states worth
  looking at. Nothing generates this and nothing should.
- **The registry row, the blurb and the canonical example** go to the
  **`zyncat-docs`** agent, together with the `llms.txt` entry from step 5.

## 8. Run the checks

```bash
pnpm exec prettier --write .
pnpm sync                        # regenerate every manifest and doc
pnpm verify                      # the whole gate, ending in the full suite
```

`pnpm verify` is `check:exports`, `check:tsconfig`, `typecheck`, `format:check`,
`check:css`, `check:authoring`, `check:docs`, `build`, `check:llms`,
`check:props` and the test suite, in that order — the build sits in the middle
because the three checks after it read `dist/`. Run the individual scripts while
iterating; run `verify` before you hand the work over.

## Conventions the linters do not catch

- **No comments in source.** Not `//`, not `/* */`, not JSDoc on internals.
  Express it in the name, or put it in a `docs/` file. The exceptions are prop
  JSDoc on the public props interface, which becomes the consumer's editor
  tooltip, and the token `.css` files, which are shipped documentation.
- **No `setTimeout` / `requestAnimationFrame` / `transitionend` to sequence
  motion.** Use `Playback.finished`. See `motion.md`.
- **`pnpm`, never `npm`.**
- **Named constants, not magic numbers.** A threshold, a distance or a ratio
  gets a `const` with a name at module scope.
- **Reuse the internal machinery** rather than hand-rolling overlays, focus
  return, positioning or controlled state. `design-system.md` has the table.

## Repo map

```
src/
  engine/        the WAAPI engine: animate, set, flip, measure, startDrag
  motion/        the React layer: Presence, Motion, useMotion, presets, glide, flip
  tokens/        *.css token vocabulary + the TypeScript readers
  components/
    primitives/  one control or one visual atom
    composites/  several primitives plus behaviour
    compound/    whole assembled patterns (scanned by tsup, not yet populated)
    internal/    shared machinery, never exported
    dev/         MotionDevtools
  mcp/           the bundled MCP server that serves llms.txt and the tokens
docs/authoring/  this guidance
scripts/         test runner and the three lints
playground/      a real Vite app for looking at things
```
