# The design system

## Goal

- Ship a premium, motion-first React 19 design system.
- Modern CSS, a closed token vocabulary, a small WAAPI engine, zero runtime dependencies.
- Be both: a complete system to build products on, and expressive components with real motion.
- Design every state. Make every motion interruptible.

## The two contracts

- The tier decides which contract binds a component.
- The invariants below bind every tier.

### System contract

- Applies to `src/components/primitives/` and `src/components/composites/`.
- Every value is a named token. No literals.
- No component-local fonts. No filters. No canvas. No per-frame JS.
- Motion comes from the engine presets and duration bands only.
- Prefer fewer variants and fewer props.
- Pick the nearest token step. Never invent a value.

### Expressive contract

- Applies to `src/components/expressive/` and opted-in `src/components/compound/` patterns.
- Open axes: geometry, filters, canvas, variable fonts, particles, simulation, physics.
- Also open: colour ramps and lighting models - gradient stops, specular bands, shading curves.
- Freedom props are allowed: accent, speed, intensity.
- Name every arbitrary value.
- A value used once becomes a named module constant.
- A tunable value becomes a `--<component>-<name>` custom property on the root class.
- Scoped custom properties are the component's public theming contract.
- Default scoped properties from semantic tokens where a semantic exists.
- Never declare anything on `:root`.
- Never leak into another component's stylesheet.
- Ink, surface and accent as roles resolve from semantic tokens: `--text-strong`, `--bg-surface`, `--accent`.
- Ink as material does not. A ramp's stops are a lighting model, not nine ink roles.
- Snapping a material to the nearest token is a system-tier habit and it deletes the component.
- A material is still named: module constants, or scoped properties a theme opts into.
- A freedom prop defaults from a token, never a hex.
- Type reads `--font-sans` / `--font-mono` and the `--size-*` scale.
- No bundled font faces. No local font stacks.
- Run simulations only on the engine `loop` primitive (motion.md).
- A compound component declares its contract in its registry row. Undeclared means system.

### Replica addendum

- A replica reproduces an external platform's surface. Fidelity is the contract.
- Pin platform metrics as named constants, not tokens.
- Consumer theming must not move replica metrics.
- Replicas live in the expressive tier, marked as replicas in their docs.
- A11y, focus, reduced motion and zero dependencies still bind.

### Invariants

- Focus-visible treatment is the system's, everywhere.
- Never trade roles, keyboard contracts or aria for looks.
- Reduced motion collapses transitions and snaps simulations to their settled state.
- Every motion is interruptible. One writer owns a property (motion.md).
- Keep perceived settle inside the `--duration-*` bands.
- Zero runtime dependencies.
- Every component ships its own subpath, stylesheet, props JSDoc and `llms.txt` row.

## Tokens

- Tokens are custom properties on `:root` in `src/tokens/*.css`, served verbatim by `get_tokens`.
- The `.css` file is the source of truth and the documentation.
- A token file starts with the layer order statement and wraps its rules in `@layer zyncat.tokens`.
- Never `@import` with `layer()`. Bundler css-loaders rewrite it into a dead `@media`. Files wrap their own rules.
- `color.css`, `semantic.css`: neutral ramp, brand and status hues, semantic names.
- `spacing.css`: one 4px base, a short scale.
- `typography.css`, `fonts.css`: type scale and families.
- `radius.css`, `elevation.css`: radii and shadows.
- `motion.css`: durations, easings, distances, rest scales.
- `layers.css`: `z-index` bands.
- `glass.css`, `avatar.css`, `icons.css`: glass utility, avatar and icon sizing.
- TypeScript reads tokens off the DOM: `UIMotion`, `tokenPx`.
- Never duplicate a token value as a TypeScript literal.

### Token, or constant?

- Ownership decides. Ask whether a theme is entitled to move this value.
- Repointing `--accent` should move it: it is a role. Use a semantic token, every tier.
- Repointing `--accent` should leave it alone: it is a material or a metric. Use a constant.
- The replica addendum is this rule, scoped. It binds outside replicas too.
- Range check before you snap: compare the range you need to the range the scale covers.
- Outside that range, "nearest" is truncation. It ships a duller version of your component.
- Substitution check after you snap: put the token in and look at it.
- If the swap turns the component into a blander thing, the value was never a role.
- Assertions cannot run this check. Screenshot before the metrics pass, not after.

### Use an existing token, or add one?

- Default to an existing token. Snap to the nearest step.
- Add a token only when all four hold:
  1. It is a new kind of thing, not a new value of an existing kind.
  2. More than one component needs it.
  3. A theme would plausibly retune it.
  4. You can write the one-line "when to pick it" comment.
- A single component's value is a constant or a scoped property, never `:root`.
- Declare new tokens in the right `src/tokens/*.css` file with that comment.
- Mirror into the TypeScript reader if code needs it.

### Naming

- CSS spells the concept out. TypeScript abbreviates it: `--duration-fast` is `dur.fast`.
- Name a scale by magnitude or by target, never both.
- Scoped properties: `--<component>-<name>`, kebab-case, root class only.

## Overrides

- Level 0: all shipped CSS sits in the `zyncat` cascade layers, so plain consumer CSS wins.
- Level 1: retheme by overriding tokens on `:root`. JS follows via the DOM readers.
- Level 2: retune one component through its scoped custom properties.
- Level 3: restyle with `className` and `style` - direct props on primitives and fields, `htmlProps` on an overlay's panel.
- Replicas answer to none of these, by design.

## Compose, or build new?

- Compose first. A new component is permanent public surface.
- Build new only for own semantics, an own state machine, or existing duplication.
- Never build new because a prop is missing. Add the prop if it is a real axis.

### Which tier

- Primitive: one control or visual atom. `src/components/primitives/`.
- Composite: primitives plus behaviour and keyboard contracts. `src/components/composites/`.
- Compound: whole assembled patterns. `src/components/compound/`.
- Expressive: creative components and replicas. `src/components/expressive/`.
- Internal: shared machinery, never exported. `src/components/internal/`.
- Behaviour that outlives one event handler means composite.
- Utility belongs in composites. Delight belongs in expressive.

## Behaviour that already exists

- Controlled state: `useControllable`.
- Overlay root and stacking: `OverlayPortal`, `useOverlayEntry`, `ovIsTop`.
- Click-outside dismissal: `useOutsidePress`.
- Trigger cloning with aria: `ovCloneTrigger`.
- Floating panel anchoring: `useAnchorPosition`.
- Focus return: `useReturnFocus`. Focus trap: `useFocusTrap`.
- Scrim, scroll lock, `inert`, panel shell: `ModalShell`.
- Token as a number: `tokenPx`. Scroller edges: `useScrollEdges`. Class names: `cx`.
- Listbox keyboard navigation: `useListbox`. Generalise it for new shapes, never fork it.
- Scroll-into-view lives inline in `use-listbox.ts`. A second consumer lifts it out.

## Conventions

- Sentence case. No emoji. No exclamation marks in UI copy.
- One primary `Button` per view.
- Numbers, times, IDs and status read mono and tabular.
- Status hues mark genuine status only.
- Every component imports its own stylesheet. No barrel entry.

## Roadmap

- Phase 4: wire `src/components/expressive/` into the tsup scan. Port the motion primitives.
- Phase 5: support widgets into `src/components/compound/`.
- Phase 6: replicas. Phase 7: docs coverage, publish gate.
- Legacy debt (comments, px literals, rAF call sites) is ratcheted by `check:contracts` against `scripts/contracts-baseline.json`.
