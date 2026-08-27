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
scripts/         the generators and the lints
  lib/entries.mjs  the one scanner deriving the public entry list from the tree
apps/docs/       the Next.js docs site
.claude/agents/  zyncat-docs (owns consumer prose)
```

## Delegate the satellite work

Adding a component touches far more than `src/`. Most of it is now either
generated or owned by an agent, so it does not need to cost you context:

| Work                                                  | Who                         |
| ----------------------------------------------------- | --------------------------- |
| The component, its CSS, its prop JSDoc, its demo page | you                         |
| `llms.txt`, the registry row, the canonical example   | the **`zyncat-docs`** agent |
| exports map, docs paths, prop tables, repo docs       | `pnpm sync`                 |

Never hand-write a prop table: the JSDoc on the public props interface is the
single source, and `pnpm docs:props` reads it back out of `dist/*.d.ts` into the
docs site. It fails on any public prop with no JSDoc.

## Commands

```bash
pnpm sync                    # regenerate every manifest and generated doc
pnpm verify                  # the whole gate, in order
```

While iterating, the pieces of `verify` run alone: `typecheck`, `check:css`,
`check:authoring`, `check:exports`, `check:tsconfig`, `check:docs`,
`check:props`, and `build && check:llms` (that one needs `dist/`).
