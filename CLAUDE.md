# zyncat-ui

- React 19 design system. Modern CSS, a closed token vocabulary, a ~3 kB WAAPI motion engine.
- No Tailwind, no CSS-in-JS, no UI library, no animation dependency.

## Mission

- Premium polish, genuinely good motion, creative components.
- Still a complete system a product is built on. Nothing else ships both.
- System components keep the closed token vocabulary.
- Expressive components get scoped freedom: named constants and `--<component>-<name>` properties.
- Replicas pin platform metrics as constants, immune to theming.
- Invariants bind every tier: focus, reduced motion, interruptibility, a11y, zero dependencies.

## Read the guidance before writing library code

- The rules live in `docs/authoring/`, served by the bundled MCP server (`.mcp.json`).
- Call the tool. Do not reconstruct the rules from source.
- Motion code: `motion_guide(topic?)` or `docs/authoring/motion.md`.
- Tokens, contracts, overrides, tiers: `design_rules(topic?)` or `docs/authoring/design-system.md`.
- Adding a component: `authoring_checklist()` or `docs/authoring/authoring.md`.
- Using components: `list_components`, `get_component`, `search_api`, `get_tokens`, or `llms.txt`.
- `pnpm check:authoring` verifies the guidance against the code.

## Non-negotiables

- `pnpm`, never `npm`.
- No comments in source. Exceptions: public-props JSDoc and `src/tokens/*.css`.
- Never sequence motion with `setTimeout`, `requestAnimationFrame`, `transitionend` or `animationend`.
- Chain the `Playback` `finished` promise instead. Wall-clock assumptions are wrong by construction.
- rAF exists only inside the engine `loop` simulation primitive.
- One writer per property. JS and CSS never animate the same property.
- Values follow the tier's contract. `design_rules('contracts')` has the rules.
- Zero runtime dependencies.
- Do not commit or stage anything until the change has been reviewed.

## Layout

```
src/
  engine/        the WAAPI engine: animate, set, flip, measure, startDrag, loop
  motion/        the React layer: Presence, Motion, useMotion, presets, glide
  tokens/        *.css token vocabulary + the TypeScript readers
  components/
    primitives/  one control or one visual atom            (system contract)
    composites/  several primitives plus behaviour         (system contract)
    compound/    whole assembled patterns                  (contract declared per component)
    expressive/  creative motion components and replicas   (expressive contract; wired in phase 4)
    internal/    shared machinery, never exported
    dev/         MotionDevtools
  mcp/           the bundled MCP server
docs/authoring/  the guidance the MCP tools serve
scripts/         the generators and the lints
  lib/entries.mjs  the one scanner deriving the public entry list from the tree
apps/docs/       the Next.js docs site
.claude/agents/  zyncat-docs (owns consumer prose)
temp/            imported source material (dc.html decks, magicui reference) - never ships
```

## Delegate the satellite work

- You: the component, its CSS, its prop JSDoc, its demo page.
- The `zyncat-docs` agent: `llms.txt`, the registry row, the canonical example.
- `pnpm sync`: exports map, docs paths, prop tables, repo docs.
- Never hand-write a prop table. `pnpm docs:props` generates it from `dist/*.d.ts`.

## Commands

- `pnpm sync`: regenerate every manifest and generated doc.
- `pnpm verify`: the whole gate, in order.
- Pieces run alone: `typecheck`, `check:css`, `check:contracts`, `check:authoring`, `check:exports`, `check:tsconfig`, `check:docs`, `check:props`, `build && check:llms`.
