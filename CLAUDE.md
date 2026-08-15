# zyncat-ui

A React 19 design system: modern CSS, a small closed token vocabulary, and a
~2.5 kB WAAPI motion engine. No Tailwind, no CSS-in-JS, no UI library, no
animation dependency.

## Read the guidance before writing library code

The substantive rules live in `docs/authoring/` and are served over the bundled
MCP server, which is registered in `.mcp.json`. **Call the tool, do not
reconstruct the rules from source** — most of what matters is not guessable from
reading the implementation, and `pnpm check:authoring` verifies the guidance
against the code, which no summary of it can claim.

| Before you                              | Call                                                           | Or read                           |
| --------------------------------------- | -------------------------------------------------------------- | --------------------------------- |
| write any motion code                   | `motion_guide(topic?)`                                         | `docs/authoring/motion.md`        |
| add a token, or decide compose vs build | `design_rules(topic?)`                                         | `docs/authoring/design-system.md` |
| add a component                         | `authoring_checklist()`                                        | `docs/authoring/authoring.md`     |
| use a component                         | `list_components`, `get_component`, `search_api`, `get_tokens` | `llms.txt`                        |

The first three appear only inside this repo; the four consumer tools ship with
the package.

## Non-negotiables

- **`pnpm`, never `npm`.**
- **No comments in source.** Not `//`, not `/* */`, not JSDoc on internals.
  Express it in the name, or put it in a `docs/` file. Two exceptions: prop
  JSDoc on a public props interface, which becomes the consumer's editor
  tooltip, and `src/tokens/*.css`, which the MCP ships verbatim as the token
  documentation.
- **Never sequence motion with `setTimeout`, `requestAnimationFrame`,
  `transitionend` or `animationend`.** The engine returns a `Playback` whose
  `finished` promise resolves — chain off it. Playback rate is scaled by
  `clock.scale` and durations collapse under reduced motion, so any wall-clock
  assumption is wrong by construction.
- **Never animate from JS a property that CSS also transitions**, or the other
  way round. One writer per property.
- **Never call `vitest` directly for browser tests.** Browser runs are
  serialised machine-wide by an exclusive `flock` on
  `/tmp/zyncat-ui-browser-test.lock` held by `scripts/test.mjs`; the dev machine
  cannot host two Chromium instances comfortably. Go through
  `node scripts/test.mjs`.
- **Tests import components as a consumer does** — `@zyncat/ui/modal`, never a
  relative `src/` path.
- **Do not commit or stage anything** until the change has been reviewed.

## Layout

```
src/
  engine/        the WAAPI engine: animate, set, flip, measure, startDrag
  motion/        the React layer: Presence, Motion, useMotion, presets, glide
  tokens/        *.css token vocabulary + the TypeScript readers
  components/
    primitives/  one control or one visual atom
    composites/  several primitives plus behaviour
    internal/    shared machinery, never exported
    dev/         MotionDevtools
  mcp/           the bundled MCP server
docs/authoring/  the guidance the MCP tools serve
scripts/         the test runner and the lints
tests/           the suite - see TESTING.md for the seven axes
playground/      a real app for looking at things
```

## Commands

```bash
pnpm typecheck
pnpm exec prettier --write src tests
pnpm check:css               # every rendered class is reachable from its module
pnpm check:authoring         # docs/authoring still matches the code
pnpm build && pnpm check:llms   # check:llms needs dist/
node scripts/test.mjs        # add a filename to run one file
```
