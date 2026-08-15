# The design system

## What this library is for

A premium React 19 design system built on modern CSS and a **small, closed token
vocabulary**, applied consistently. No Tailwind, no CSS-in-JS, no component
library underneath, no animation dependency.

The closed vocabulary is the whole point. Every colour, space, radius, duration,
easing curve, travel distance and rest scale comes from a named token, and the
set of names is deliberately short enough to hold in your head. A surface built
from those names looks like it belongs without anyone coordinating; a surface
built from ad-hoc values does not, no matter how carefully the values were
chosen.

Restraint is a feature. When in doubt, the answer is fewer variants, fewer
props, and the token that is already there.

## Tokens

Tokens live in `src/tokens/*.css` as CSS custom properties on `:root`, and are
served to consumers verbatim through the MCP `get_tokens` tool. The `.css` file
is the source of truth and the documentation — a token's comment there is what
a consumer reads.

| File                                   | Vocabulary                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------ |
| `color.css`, `semantic.css`            | The neutral ramp, brand hues, status hues, and the semantic names that map onto them |
| `spacing.css`                          | One 4px base and a short scale; every gap snaps to a step                            |
| `typography.css`, `fonts.css`          | Type scale and families                                                              |
| `radius.css`, `elevation.css`          | Corner radii, shadow steps                                                           |
| `motion.css`                           | Durations, easing curves, travel distances, rest scales                              |
| `layers.css`                           | `z-index` bands                                                                      |
| `glass.css`, `avatar.css`, `icons.css` | The shared glass utility, avatar sizing, icon sizing                                 |

Anything in TypeScript that needs a token reads it back off the DOM
(`UIMotion` for motion, `tokenPx()` for a one-off length) so that a theme
override at `:root` retunes both the CSS and the JS together. Never duplicate a
token value as a TypeScript literal.

### Use an existing token, or add one?

Use an existing token. That is the answer almost every time — pick the nearest
step and let the design snap to the spine.

Add a token only when **all** of these hold:

1. The value is genuinely a new _kind_ of thing, not a new value of an existing
   kind. `--distance-*` was worth adding because no scale described travel;
   `--space-3-5` would not be, because the spacing spine already describes gaps.
2. More than one component needs it, or will. A single component's constant
   belongs in that component's module as a named constant, not in `:root`.
3. A theme would plausibly want to retune it. Tokens are the theming surface; a
   value nobody would ever override is not a token, it is a constant.
4. You can write the one-line comment that says when to pick it over its
   neighbours. If you cannot describe the choice, the scale has too many steps.

When you do add one: declare it in the right `src/tokens/*.css` file with that
comment, mirror it into the TypeScript reader if code needs it, and give it a
browser test that proves a `:root` override actually reaches the reader.

### Naming

Follow the existing pattern rather than inventing one. CSS spells the concept
out and TypeScript abbreviates it: `--duration-fast` is `dur.fast`,
`--distance-sm` is `dist.sm`. Scales are named either by magnitude (`fast`,
`base`, `slow`; `sm`, `md`, `lg`) or by the thing they apply to (`panel`,
`floating`, `chip`) — pick whichever describes how an author actually chooses,
and do not mix the two within one scale.

## Compose, or build new?

**Compose first.** A new component is a permanent maintenance surface: an entry
in the exports map, its own stylesheet, an `llms.txt` entry, a test file per
relevant axis, and a prop contract you cannot quietly change later.

Compose when the thing you want is an existing component with different content,
different props, or a wrapper that arranges two of them. Most "new component"
requests are this.

Build new when:

- It has its **own semantics** — a role, an aria relationship, a keyboard
  contract — that no existing component expresses. A Dropdown is not a Select
  with different children; it commits actions rather than a value.
- It has **its own state machine**. If wrapping the existing component means
  reaching past its props into its internals, the composition is fake.
- Two or more places already hand-roll it. Duplication that already exists is
  the strongest evidence.

Do **not** build new merely because a prop is missing. Add the prop — as long as
it is a real axis of the component and not a one-off escape hatch.

### Which tier

| Tier      | Directory                    | What lives there                                                                                                                                     |
| --------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primitive | `src/components/primitives/` | One control or one visual atom, no internal layout policy. Button, Badge, Collapse.                                                                  |
| Composite | `src/components/composites/` | Several primitives plus behaviour — overlays, fields with state, anything with a keyboard contract. Modal, Select, Table, Toast.                     |
| Compound  | `src/components/compound/`   | A whole assembled pattern built out of composites. tsup scans this tier, but nothing lives there yet — creating the directory is enough to claim it. |
| Internal  | `src/components/internal/`   | Shared machinery, never exported. Overlay layering, focus, positioning, icons, `cx`.                                                                 |

If you are unsure between primitive and composite, ask whether it owns any
behaviour that outlives a single event handler. If it does, it is a composite.

## Behaviour that already exists

Before hand-rolling any of these, use the existing one. Each was written once
and is covered by the test suite; a second copy is a second set of bugs.

| Need                                                                        | Use                                           |
| --------------------------------------------------------------------------- | --------------------------------------------- |
| Controlled / uncontrolled state with a change callback                      | `useControllable`                             |
| Rendering into an overlay root, stacking, top-of-stack checks               | `OverlayPortal`, `useOverlayEntry`, `ovIsTop` |
| Click-outside dismissal that respects stacking                              | `useOutsidePress`                             |
| Cloning a trigger element with the aria wiring                              | `ovCloneTrigger`                              |
| Anchoring a floating panel to a trigger or a virtual point                  | `useAnchorPosition`                           |
| Returning focus where it came from                                          | `useReturnFocus`                              |
| Seeding focus into a panel, cycling Tab inside it, pulling stray focus back | `useFocusTrap`                                |
| Scrim, scroll lock, `inert` on everything outside, and the panel shell      | `ModalShell`                                  |
| Reading a token as a number                                                 | `tokenPx`                                     |
| Detecting whether a scroller is at its top / bottom edge                    | `useScrollEdges`                              |
| Conditional class names                                                     | `cx`                                          |
| Listbox keyboard navigation, typeahead, active-descendant                   | `useListbox`                                  |

`useListbox` is currently typed to `SelectOption` / `SelectGroup`. If you need
listbox navigation for a differently shaped option, **generalise it** — do not
fork it. Forking it is how you get two keyboard contracts that drift.

There is no extracted scroll-into-view helper. The arithmetic lives inline in
`use-listbox.ts`; if a second component needs it, that is the moment to lift it
out rather than to copy it.

## Conventions that apply to every surface

- Sentence case. No emoji, no exclamation marks in UI copy.
- One primary `Button` per view.
- Numbers, times, IDs and status read mono and tabular.
- Status hues (info / success / warning / danger) are for genuine status only.
  Visual hierarchy comes from the neutral ramp.
- Every component imports its own stylesheet. There is no barrel entry and no
  global CSS bundle — see `authoring.md`.
