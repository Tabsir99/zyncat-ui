# Testing Zyncat UI

## The rule

**Test only what a developer using the package can observe.**

A good test fails when the component misbehaves for a real user, and keeps
passing when we rewrite the implementation. If a test would break because we
renamed a state variable, restructured a DOM node, or changed how many times
something renders, it is testing the wrong thing — delete it.

Internal incorrectness with no observable consequence is not a defect and gets
no test. Observable misbehaviour is a defect even when the internals look fine.

### Out of scope, permanently

- DOM snapshots.
- Render or commit counts.
- Internal state shape, internal helper call counts, private module exports.
- Class names, unless the class is part of the documented API.
- Anything asserted by reading `src/` rather than by using the component.

### In scope

What is on screen. What is focusable and in what order. What a consumer's `ref`
can see and when. What keyboard and pointer input does. Which callbacks fire,
with which arguments, how many times. What survives unmount, remount and rapid
toggling. What one component does to the rest of the page while it is open.

### The engine

`src/engine` is not a published subpath, so "what a consumer observes" does not
reach it directly. It is tested anyway, against the same rule one level down:
every component here is a consumer of `animate`, `Playback` and `resolveTiming`,
and those are an interface, not an implementation.

Engine tests assert only what that interface promises — the values
`resolveTiming` returns, whether `Playback.finished` settles, which properties an
element still has animating. They never reach for the ownership map, the spring
cache or `compile()`. A test that would break because the ownership map became an
array is testing the wrong thing, exactly as it would be for a component.

These two files are the one documented exception to importing the way a consumer
does: they import from `../src/engine`, because no consumer subpath exists to
import instead.

Two rules keep them honest. Every assertion must name a mutation it catches —
write the test, then break the engine that way and watch it fail. And a
plausible-sounding risk is not a reason for a test: measure first, and if the
failure mode turns out to be unreachable, do not write it.

## Why this document exists

Two bugs shipped in v0.10.0 that no internal test would have caught, because
from inside the library both were invisible:

1. `Presence` mounted entering children one commit late, so a consumer effect
   keyed on an `open` prop ran while refs inside the overlay were still `null`.
2. `OverlayPortal` committed its whole subtree inside a detached node, so
   consumer callback refs fired on an element with no layout and no resolved
   custom properties.

Our own components dodged both — motion tokens are read off `:root`, and the
portal host is usually attached before content mounts. They only appear from
the outside. **Every test in this suite is written from the consumer's seat.**

## Test axes

Every component group is covered against these seven axes. Not every axis
applies to every component; the ones that apply are not optional.

### 1. Prop contract

Each documented prop does what the docs say. Controlled, uncontrolled and
`defaultX` modes each work, and the controlled mode never self-updates without
the consumer changing the prop. Callbacks fire with the right value, once per
real change, and not on mount.

### 2. Observation contract

The class that produced both v0.10.0 bugs. For anything portalled, animated or
measured: when a consumer's callback ref, layout effect, or `[open]`-keyed
effect first runs, is the element in the document, does it have layout, do CSS
custom properties resolve on it? Use `Probe` and `useOpenProbe` from the
harness.

### 3. Interaction contract

Real keyboard and pointer input, not synthetic prop calls. Tab order, arrow-key
navigation, Enter/Space/Escape/Home/End, typeahead, click-outside, hover intent
and its delays. Where focus lands on open and where it returns on close.

### 4. Accessibility contract

Roles, accessible names, and the aria wiring between trigger and surface
(`aria-expanded`, `aria-controls`, `aria-haspopup`, `aria-activedescendant`,
`aria-selected`, `aria-invalid`). Focus containment while a modal surface is
open, and `inert` on everything outside it.

### 5. Lifecycle contract

Mount, unmount, remount. Rapid toggling and interrupted animations. Cleanup:
after unmount there must be no lingering document listeners, no stuck
`overflow: hidden` on the scroll scope, no orphaned `[data-overlay-root]`, no
element left `inert`, no running timers. Every component must survive
`StrictMode` (the harness renders under it by default).

### 6. Composition contract

Where design systems actually break. A `Select` inside a `Modal`. A `Modal`
opened from another `Modal` — Escape must close only the top one. A `Tooltip`
inside a `Popover`. A `Table` with a `Popover` in a cell. Two of the same
component open at once. Scroll lock must nest and unwind in the right order.

### 7. Environment contract

Server rendering must not throw for any subpath. `prefers-reduced-motion` must
take the reduced path. `container`-scoped overlays must scope their scrim,
scroll lock and inert to that container and leave the rest of the page live.

## Layout

```
tests/
  harness.tsx                     shared fixtures — read this before writing
  setup.browser.ts                styles, act environment, per-test cleanup
  <group>-<topic>.browser.test.tsx  real Chromium
  <group>-<topic>.unit.test.ts      pure logic, node, no DOM
```

Browser tests import components exactly as a consumer does — `@zyncat/ui/modal`,
not a relative `src/` path. `vitest.config.ts` builds those aliases from the
`exports` map in `package.json`, so an import that works in a test is an import
that works for a user.

Unit tests are for genuinely pure logic only: date arithmetic, spring maths,
token parsing, store reducers. If it touches the DOM it is a browser test —
jsdom has no layout engine and no Web Animations API, so it would silently pass
through exactly the bugs we care about.

## Harness

From `tests/harness.tsx`:

| Export                        | Use                                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `renderApp(ui)`               | RTL `render` wrapped in `StrictMode`. Use this, not bare `render`.                                                        |
| `ledger()`                    | Creates the record that `Probe` / `useOpenProbe` write into.                                                              |
| `Probe`                       | Drop inside a surface. Records connectedness, layout and token resolution at callback-ref, layout-effect and effect time. |
| `useOpenProbe(open, ref, on)` | In the component owning the open state. Records what an `[open]`-keyed effect can see.                                    |
| `firstSighting(on, phase)`    | First record for a phase.                                                                                                 |
| `settle()`                    | Waits for every running animation, then flushes React. Use before asserting post-animation state.                         |
| `finishAnimations()`          | Jumps animations to their end instead of waiting.                                                                         |
| `overlayRoots()`              | Live `[data-overlay-root]` hosts, for leak assertions.                                                                    |

`tests/overlay-surface.browser.test.tsx` is the reference implementation.

## Running

```bash
pnpm test                                  # everything
pnpm test:unit                             # node project only, fast, parallel
pnpm test:browser                          # browser project only
pnpm test tests/foo.browser.test.tsx       # one file
pnpm test tests/foo.browser.test.tsx -t "escape"   # one test
pnpm test:watch                            # watch, unit project only
```

**Browser runs are serialized machine-wide** by an exclusive `flock` on
`/tmp/zyncat-ui-browser-test.lock`, held by `scripts/test.mjs`. Concurrent
invocations queue instead of launching several Chromium instances at once. This
is deliberate — the dev machine cannot host more than one comfortably. Never
bypass it by calling `vitest` directly for browser tests.

Run a single file while iterating. The full browser suite is for the end.

## Ownership

| Group           | Surface                                                                    | File prefix       |
| --------------- | -------------------------------------------------------------------------- | ----------------- |
| Overlay         | Modal, Dialog, Sheet, Popover, presence, stacking, scroll lock, inert      | `overlay-`        |
| Select          | Select, MultiSelect, listbox, typeahead                                    | `select-`         |
| Dropdown        | Dropdown, the menu keyboard contract, submenus                             | `dropdown-`       |
| Date            | DateField, DateTimeField, DateRangeField, TimeField, calendar, range panel | `date-`           |
| Emoji picker    | EmojiPickerPanel, the emoji grid, word search, the category rail, recents  | `emoji-picker-`   |
| Table           | Table, Pagination                                                          | `table-`          |
| Toast           | Toast, toast store, queueing, stacking, timers                             | `toast-`          |
| Motion surfaces | Tabs, Collapse, Alert, Tooltip                                             | `motion-surface-` |
| Motion tokens   | `UIMotion` reads of duration, ease, distance and scale; theme retuning     | `motion-tokens`   |
| Forms           | TextField, NumberField, OtpField, Textarea, Checkbox, Toggle, RadioGroup   | `form-`           |
| Engine          | `animate`, the `Playback` contract, timing resolution, FLIP                | `engine-`         |
| Package surface | The exports map: every subpath resolves, and its dist targets exist        | `package-`        |
