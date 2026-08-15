# Adding a component

Read `design-system.md` first and confirm you should be building a new component
at all. If you are, this is the complete checklist. Every step has a check that
fails loudly when you skip it — except step 2, which fails silently, so do not
skip step 2.

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
`tsup.config.ts` rather than renaming the file away from the component name.

Put helper modules for the component in the same directory — hooks, a store,
subcomponents. Only PascalCase `.tsx` files become entries, so a
`use-thing.ts` next to `Thing.tsx` stays internal.

Start the file with `'use client'` if it uses state, effects, refs or events.

## 2. Add the exports map entry

This one is manual, and it is the step that fails silently — tsup will happily
build a `dist/thing.js` that nobody can import.

In `package.json`:

```json
"./thing": {
  "source": "./src/components/composites/thing/Thing.tsx",
  "types": "./dist/thing.d.ts",
  "import": "./dist/thing.js"
}
```

Subpaths are the **only** public API. There is no barrel entry, deliberately: it
guarantees one import can never pull in modules or CSS the app did not ask for.

`vitest.config.ts` builds its test aliases from this exports map, so a component
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

## 4. Add the `llms.txt` entry

Consumers and coding agents read `llms.txt`, and the bundled MCP server parses
it with two regexes. The heading format is load-bearing:

```
Thing - @zyncat/ui/thing
  One or two sentences on what it is and when to pick it over the neighbour it
  is most often confused with. Then the prop vocabulary as prose.
  <Thing prop="value">...</Thing>
```

`pnpm check:llms` verifies that every public subpath has an entry (unless it is
in that script's `SUPPORTING` list, for modules documented by their types
alone), and that **every JSX attribute in your example resolves to a real prop**
on the built types. It needs `dist/`, so run `pnpm build` first.

That second check is why examples here do not rot: a renamed prop breaks the
build, not just the docs.

## 5. Write the tests

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

Anything with layout, animation or measurement is a **browser** test. jsdom has
no layout engine and no Web Animations API, so a unit test passes straight
through the interesting failures.

Browser runs are serialised machine-wide by a lock file. Run them through the
script, never `vitest` directly:

```bash
node scripts/test.mjs thing        # one file while iterating
node scripts/test.mjs              # the whole suite, at the end
```

## 6. Add it to the playground

`playground/` is how you look at the thing. Add a page or a section to the
existing content so the component is exercised in a real app rather than only in
tests.

## 7. Run the checks

```bash
pnpm typecheck
pnpm exec prettier --write src tests
pnpm check:css
pnpm build && pnpm check:llms     # check:llms needs dist/
node scripts/test.mjs
```

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
