# premium-ds — revamp audit

Recorded 2026-07-07, before any change. Scope: `src/components/` (22 components, 38 TS/TSX files, 7,881 lines TS/TSX + 4,649 CSS). Two tracks: (A) every instance of the "works in the playground, breaks in a real app" hazard class, (B) duplication / complexity with a credible size-reduction plan.

Method: every TSX/TS file read in full; CSS greped for positioning, surface tokens, z-index, and cross-file class usage; claims cross-checked against `package.json`, `tsup.config.ts`, `styles.css`, and `llms.txt`.

**Constraints locked in review (2026-07-07):** per-prop JSDoc is untouchable (the DX/agent-legibility moat — every size number below excludes it); no public API merges — `Select` and `MultiSelect` stay separate exports with separate state models; reduction must be structural, not formatting.

---

## A. Integration hazards

The unifying failure mode: a component works when the whole library is loaded on a plain page (the playground), and breaks when a consumer imports one piece, or mounts it inside a normal-but-unanticipated context (transformed ancestor, tinted surface, motion-less app). None of these show up in our own demos *by construction* — the playground is the one environment that can't catch them.

### A1 · The "motion is optional" claim is structurally false — P0

`package.json` marks `motion` as an optional peer, and the landing page sells it ("motion is optional — skip it and everything still works"). But 14 modules import `motion/react` **statically at module top level**:

`Tag.tsx:7`, `glide.tsx:12`, `Alert.tsx:7`, `Tabs.tsx:44`, `RadioGroup.tsx:7`, `Table.tsx:7`, `Tooltip.tsx:8`, `overlay-core.tsx:7`, `sheet-drag.tsx:6`, `DateRangeField.tsx:7`, `DateField.tsx:8`, `select-core.tsx:6`, `Pagination.tsx:7`, `Toast.tsx:7`. (`motion-tokens.ts:3` is type-only — erased, fine.)

Failure matrix:

| Consumer setup | Result without motion installed |
|---|---|
| `import { Button } from 'premium-ds'` (barrel), Vite/Next dev | **Hard crash** — dev prebundle/resolve walks the whole barrel, `motion/react` unresolvable |
| Barrel import, production build | Works only if the bundler tree-shakes perfectly; fragile across bundlers |
| Subpath `premium-ds/button` etc. | Works — but only for the ~14 components that don't touch motion |
| `premium-ds/select`, `/table`, `/toast`, `/tabs`, any date field… | Crash — these hard-require motion |

Notably `llms.txt:9` is already honest ("Peers: react, react-dom, motion" — no "optional"). The dishonest surfaces are `peerDependenciesMeta` and the landing copy.

**Fix directions (pick one, ship the decision everywhere):**
1. *Recommended:* one internal `motion-adapter.ts` as the **only** file importing `motion/react`; every component imports from it. This creates a single choke point, then document optionality truthfully: "without motion, use subpath imports for the static components; the barrel and the motion components require it." Landing copy updates from "skip it and everything still works" to the real subset.
2. Make motion a hard peer (drop `peerDependenciesMeta`), update the "2 peer deps" proof cell. Simplest and most honest for a *motion-first* library.
3. Real optional support (dynamic capability + CSS fallbacks per component) — large effort, contradicts the positioning, not worth it now.

### A2 · Select/MultiSelect menu: `position: fixed`, not portaled, not top-layer — P0

The bug the landing page hit, in the library itself:

- `select.css:138` — `.select__menu { position: fixed; }` rendered **in place** in the React tree (`select-core.tsx:329-347`), positioned from `getBoundingClientRect()` viewport coords (`select-core.tsx:146-170`).
- Any ancestor with `transform`/`translate` (incl. `translate: 0 0`), `filter`, `backdrop-filter`, `perspective`, `will-change: transform`, or `contain: layout|paint` becomes the containing block → the menu renders offset, off-screen, or stretches the page. Scroll-reveal libraries, Framer `whileInView`, carousels, and animated accordions all create this context routinely.
- Secondary: `z-index: var(--layer-overlay)` (`select.css:141`) resolves inside the *local* stacking context — a parent with `z-index: 0` + transform caps it, so the menu can render under later siblings.
- The comment at `select.css:140` shows this was a conscious deferral: "anchor() needs the top layer, which we don't use".

Meanwhile the library **already ships the cure**: `OverlayPortal` (`overlay-core.tsx:395-411`), whose own comment says "escapes ancestor transforms". Overlay, Dialog, Toast, Tooltip all escape; Select is the one overlay component that doesn't.

**Fix (concretized):** extract the portal + overlay-stack primitives (`OverlayPortal`, `useOverlayEntry`, `useOutsidePress`) out of `overlay-core` into a small css-free `overlay/layer.tsx`; render the select menu through the portal **and register it in the overlay stack**. The stack registration is not optional: Dialog's focus trap recaptures any focus outside its panel unless the target sits in a stack entry above it — a portaled-but-unregistered menu would make Select unusable inside dialogs. Side benefits: Escape now closes menu-then-dialog in the right order (and works with focus on the trigger, which it previously didn't), and the menu's z-index comes from the stack instead of local stacking-context luck. The existing rect math stays (it becomes *correct* once the node is a body child). Add the dev-mode guard from A10.

### A3 · Cross-component CSS coupling breaks per-component lazy CSS — P0

`styles.css` ships tokens + glass only (by design — "per-component CSS lazy-loads with the import", `styles.css:1-7`). tsup exposes 30+ subpath entries precisely so consumers can deep-import. But these modules render class vocabularies whose CSS lives in files they never import:

| Consumer module | Renders | CSS owner (not imported) | Standalone result |
|---|---|---|---|
| `Table.tsx:112-128` | `.cbx*` checkbox machine | `checkbox.css` | selection checkboxes unstyled |
| `Table.tsx:134-155` | `.odo*` odometer (comment admits: "reuses badge.css's .odo vocabulary") | `badge.css` | bulk count broken |
| `Table.tsx:326` | `.btn btn--ghost btn--sm` | `button.css` | Clear button unstyled |
| `Toast.tsx:216` | `.btn btn--secondary btn--sm` | `button.css` | toast action button unstyled |
| `Alert.tsx:105` | `.btn btn--sm` | `button.css` | alert action unstyled |
| `Pagination.tsx:110,126` | `.btn btn--ghost btn--sm` | `button.css` | arrows unstyled |
| `DateField.tsx:279`, `DateRangeField.tsx:443` | `.btn btn--primary btn--sm` | `button.css` | Done button unstyled |
| `field-shell.tsx:51-77` (all four date/time fields) | `.fld*` field chrome | `input.css` (`date-picker.css` has exactly 1 `.fld` rule) | label/message/input chrome gone |
| `MultiSelect.tsx:54-66` | `.cbx*` tick | `checkbox.css` | option checkboxes unstyled |
| `select-core.tsx:393-403` (searchable), `RadioGroup.tsx:188-199`, `ToggleTag.tsx:56-75` | `.collapse*` | `motion/collapse.css` | **functional break**: filtered rows stay visible / error region always open / tick never clips |

The correct pattern already exists in-house: TextField/Textarea import the `Collapse` *component* (which carries its own CSS). Everyone else pasted the DOM and lost the CSS dependency.

**Fix:** for each row either (a) import the owning component/CSS from the consuming module (one line, keeps the lazy model — bundlers dedupe), or (b) extract genuinely shared primitives (see B6/B7) that own their CSS. Add a CI check: grep rendered class prefixes against the module's CSS import graph.

Build note: dist ships CSS **flat**, so a chunk's preserved `import './x.css'` only resolves when the import was same-directory in source. Cross-directory owners (field-shell → `../input/input.css`) need a one-regex path rewrite in tsup's `onSuccess` (`'../*/x.css'` → `'./x.css'` in emitted JS); dev is untouched because Vite resolves the real source paths.

### A4 · `layoutId` FLIP markers: measurement poisoning + no self-heal — P1

Motion `layoutId` FLIPs measure viewport rects at commit time; a mid-flight ancestor transform (scroll reveal, entrance animation, panel scale-in) poisons the measurement and the marker rests off-target until the *next* state change. This is exactly the off-center radio dot from the landing page. Instances:

- `RadioGroup.tsx:135-176` — four layoutId nodes: `hover`, `card-hover`, `card-fill`, `marker`.
- `Tabs.tsx:289-313` — hover pill (`layoutId={base + '-hover'}`); the 30-line header comment (`Tabs.tsx:22-35`) documents fighting layoutId handoff flicker.
- `DateField.tsx:253-260` — selected-day pill (`dtp__pill`); **the popover panel itself scale-animates on entrance** (`Overlay.tsx:58-61`), so a pick during the first ~200ms measures against a scaling ancestor. Self-inflicted instance of the same hazard.
- `DateRangeField.tsx:299-314` — range caps `drp-cap-lo`/`drp-cap-hi`, same exposure.

The library already built the antidote and uses it elsewhere: `useGlide`/`GlidePill` (`motion/glide.tsx`) measures **container-relative** (`glide.tsx:41-50`), which cancels static ancestor translation, and its doc comment (`glide.tsx:3-8`) exists *because* layoutId re-parenting clips. Select and the date grids use it; RadioGroup and Tabs still use raw layoutId for the same visual.

**Fix:** migrate RadioGroup hover/card pills and the Tabs hover pill to `useGlide` (also deletes code — B8). For true selection markers (radio dot, date pill, range caps): either the same treatment, or keep layoutId and clear the inline transform in `onLayoutAnimationComplete` so a poisoned measurement self-heals at rest.

### A5 · Opaque `--bg-subtle` state washes assume a `--bg-surface` backdrop — P1

Hover/pressed fills are opaque near-white grays calibrated against white. On `--bg-app`, `--bg-subtle`, or any tinted card they visually vanish (the landing's "why is hover weaker than the docs" bug). The codebase itself contains the proof this is known: `tabs.css:189` — `background: var(--bg-muted); /* not -subtle: ~ invisible on --bg-app */` — the failure was hit once and patched **only for Tabs**.

Instances (opaque `--bg-subtle` as an interactive state fill):

- `radio-group.css:87` (`.rg__hover`), `radio-group.css:251` (`.rg__card-hover`)
- `checkbox.css:37` (label hover)
- `button.css:106` (secondary hover), `button.css:121` (ghost hover) — plus `--bg-muted` actives
- `tag.css:146` (toggle-tag hover region)
- `table.css:101` (`--row-bg` hover)
- `input.css:62`, `textarea.css:29` (field hover)
- `date-picker.css:91,253,264,303,467` (nav/preset/day hovers)
- `dialog.css:107` (close hover)

**Fix:** introduce a *state-layer* convention: `--wash-hover: color-mix(in oklab, var(--text-body) 5%, transparent)` (+ `--wash-press` ~8%) in `semantic.css`, and point every hover/press fill above at it. Translucent washes carry the same perceived intensity onto any surface — light, tinted, or dark — and this becomes one token instead of eleven hardcoded choices. (Non-interactive fills like `.tbl__bulk`, skeletons, disabled tracks stay opaque on purpose.)

### A6 · Tooltip: private React root, foreign hardcoded id, import-time token read — P1

- `Tooltip.tsx:236-243` — `ensureHost()` creates a `<div>` and **`createRoot()`s a second React tree** that is never unmounted. Consequences: context (and future providers) don't cross; a `react-dom/client` import in library code; a zombie root after the app unmounts; `hostMounted` module global misbehaves across multiple app instances on one page.
- `Tooltip.tsx:190,306` — the bubble id is `"scheduly-tooltip"`, a leftover from the project this was extracted from. Brand leak in every consumer's DOM + `aria-describedby` collides if two premium-ds copies coexist.
- `Tooltip.tsx:42-45` — `TIP_GAP` reads `--space-2` via `getComputedStyle` **at module import**, before `styles.css` may have loaded; the fallback silently wins and never updates.

**Fix:** mount the host from the first `<Tooltip>` via the existing `OverlayPortal` pattern (ref-counted), rename the id to `pds-tooltip`, read the gap lazily through the shared px-reader (A7). The store/warm-window/measuring-twin design is good — keep it.

### A7 · Four divergent CSS-token px readers — P2

Same job, four implementations, three caching policies: `ovReadPx` (`overlay-core.tsx:34-40`, fresh every call), `TIP_GAP` (`Tooltip.tsx:42-45`, frozen at import), `stackGap` (`Toast.tsx:27-35`, lazy-once), `pgnTravel` (`Pagination.tsx:35-44`, lazy-once). Divergent staleness behavior + duplication. → one `readTokenPx(name)` util, lazy, shared.

### A8 · Correctness & API notes (smaller, still record-worthy)

1. **NumberField** (`NumberField.tsx:43,52-53,80`): clamps on every keystroke — with `min={10}`, typing "50" is impossible ("5" → snaps to 10); integer-only `parseInt` silently kills decimal `step`; `min` defaults to `0` (surprising for signed quantities); controlled-only (no `defaultValue`), unlike its siblings.
2. **TextField clear** (`TextField.tsx:108-110`): fabricates `{ target: { value: '' } }` as a `ChangeEvent` — `e.currentTarget`, `preventDefault`, etc. are undefined; consumers doing anything beyond `e.target.value` break.
3. **DateField/DateTimeField vs DateRangeField**: only the range field gets the responsive sheet on narrow viewports (`DateRangeField.tsx:79-92,497-498`); single-date pickers stay popovers on phones. Inconsistent mobile UX; `useResponsiveOverlayMode` is generic and should be shared.
4. **Dead conditionals**: `DateRangeField.tsx:525` — `side={mode === 'sheet' ? 'bottom' : 'bottom'}`; `DateRangeField.tsx:215` — both branches of the `months === 2` ternary identical.
5. **Textarea** (`Textarea.tsx:110-113`): auto-grow re-measures on `window` resize only; container-driven width changes (panel collapse, splitter) don't retrigger. ResizeObserver on the box is the correct signal (Dialog/Table/Tabs already do this).
6. **Tooltip vs Select vs Overlay scroll policy**: tooltip closes on any scroll (`Tooltip.tsx:167-169`), select re-places (`select-core.tsx:163-165`), overlay re-places (`overlay-core.tsx:383`). Tooltip's choice is defensible, but it's undocumented divergence — record as intended or align.
7. **Select/MultiSelect have no field chrome** — no `label`/`helper`/`error` props (only `ariaLabel`/`invalid`), while every other form control has them. Consumers must hand-build the label row. Falls out of B4 for free.
8. **`aria-activedescendant` ids re-index under filtering** (`Select.tsx:210-215`): option ids are position-based (`-opt-{visibleIdx}`), so the same option changes id as the query narrows. Screen readers tolerate it, but option-keyed ids are cleaner.

### A9 · Consistency debt (same revamp, not bugs)

- **Controlled/uncontrolled support is inconsistent**: full support in Select, MultiSelect, Toggle, Checkbox, ToggleTag, Alert, Overlay, date fields; **controlled-only** in RadioGroup (no `defaultValue` — `RadioGroup.tsx:33-36`), NumberField, OtpField, Tabs (by design?). Decide the rule, apply everywhere.
- **Validation-message animation**: TextField/Textarea animate via `Collapse`; NumberField and FieldShell pop (`NumberField.tsx:116-121`, `field-shell.tsx:72-76`); RadioGroup animates via pasted collapse classes. One FieldChrome (B4) unifies.
- **Message prop naming**: inputs use `helper`/`error`/`warning`/`success`; date fields use a single `message` + `invalid`. Two mental models for the same thing.
- **Hover-pill mechanism**: `useGlide` (Select, date grids) vs `layoutId` (Tabs, RadioGroup) — see A4.

### A10 · Library-level guardrails to prevent the whole class (build these during the revamp)

1. **Dev-mode containing-block warning**: when any anchored overlay opens, walk `offsetParent`/computed styles for `transform|translate|filter|perspective|contain` between trigger and viewport; `console.warn` naming the offending element. Cheap, catches A2-class bugs in *consumers'* apps too.
2. **CSS-dependency lint** (script or test): parse each module's rendered class prefixes vs its CSS import graph — kills A3 permanently.
3. **Interaction tests in hostile contexts**: mount Select/Tooltip/DatePicker inside a `translate`d + `overflow: hidden` + `z-index`ed wrapper and assert menu position/visibility. This is the test the playground could never be.
4. **Surface matrix screenshot test**: each interactive component on `--bg-surface`, `--bg-app`, `--bg-subtle`, dark band; hover states must stay visible (A5 regression net).

---

## B. Size & simplification

### Baseline

- 7,881 lines TS/TSX total → 6,769 code-ish (1,112 blank/comment), ~350-400 of the code-ish lines are single-line prop JSDoc (the agent-legibility moat — **do not strip**).
- Top files: `overlay-core.tsx` 566 · `DateRangeField.tsx` 544 · `Table.tsx` 440 · `select-core.tsx` 424 · `Toast.tsx` 394 · `Tabs.tsx` 376 · `DateField.tsx` 369 · `Tooltip.tsx` 367 · `toast-store.ts` 316 · `time-core.tsx` 306.

### Duplication clusters (the real fat, with receipts)

| # | Cluster | Where | Est. saved |
|---|---|---|---|
| B1 | **One overlay engine.** Select's outside-press (`select-core.tsx:131-143`) and Tooltip's flip/clamp + portal plumbing (`Tooltip.tsx:84-114,178-243`) re-implement what `overlay-core` already provides (`useOutsidePress`, `OverlayPortal`, the stack). Select keeps its own placement math (it does trigger-width matching the generic `useAnchorPosition` doesn't); it adopts portal + stack + outside-press. Tooltip adopts more. This *is* the fix for A2 + A6. | select-core, Tooltip | ~160 |
| B2 | **Select + MultiSelect: extract the shared listbox, keep two components.** See "B2, re-examined" below — the original "merge behind a `multiple` prop" idea is rejected. `useListbox` (state plumbing: open/query/refs/ids/glide/nav/commit policy) + `ListboxPanel` (the identical ~90-line menu render) move into select-core; `Select`/`MultiSelect` keep their own props, JSDoc, and state models (`string \| null` vs `string[]`) and shrink to policy shells. Also deletes the `Ms*` import-alias block (`MultiSelect.tsx:6-19`). | select/ | ~200 |
| B3 | **`useControllable` ×7 → 1.** Three exported copies (`overlay-core.tsx:18-31`, `select-core.tsx:43-56`, `field-shell.tsx:12-28`) + four inline hand-rolls (`DateTimeField.tsx:88-90`, `ToggleTag.tsx:94-101`, `Toggle.tsx:41-43,56-59`, `Alert.tsx:69-75`). | 7 files | ~60 |
| B4 | **One `FieldChrome`.** Label/required/optional/helper/error/warning/success + Collapse, currently re-implemented 5×: `TextField.tsx:74-121`, `NumberField.tsx:66-121`, `Textarea.tsx:131-203`, `field-shell.tsx:41-79`, `RadioGroup.tsx:93-107,188-199`. Unifies A9 message behavior and gives Select a `label` for free (A8-7). | 5 files | ~140 |
| B5 | **Date cluster restructure.** `DtpPanel` and `DrpPanel` duplicate month header/nav, DOW row, 42-cell render, grid keyboard handling, roving focus, footer (`DateField.tsx:51-285` vs `DateRangeField.tsx:107-449`). Extract `CalendarMonth` + `useCalendarFocus`; kill the `dtf`/`drp`/`DTF_`/`DRP_` alias renames of the same `date-utils` imports (`DateField.tsx:14-28`, `DateRangeField.tsx:13-28`); share `useResponsiveOverlayMode`; DateTimeField adopts B3. Four field props interfaces share a `DateFieldBaseProps` (docs live once). | date-picker/ | ~370 |
| B6 | **Checkbox glyph ×3 → 1.** `Checkbox.tsx:77-82` (canonical), `Table.tsx:106-130` ("the Checkbox primitive's exact DOM minus label"), `MultiSelect.tsx:54-66`. Export an internal `CheckGlyph` that owns `checkbox.css` — also fixes two A3 rows. | 3 files | ~50 |
| B7 | **Odometer ×2 → 1.** `CountBadge.tsx:8-18` vs `Table.tsx:133-155` (identical strip DOM). Shared `Odometer` owning the `.odo` CSS — fixes another A3 row. | 2 files | ~30 |
| B8 | **Hover pills → `useGlide`.** RadioGroup rows/cards (`RadioGroup.tsx:135-160`) and Tabs hover (`Tabs.tsx:289-313`) reimplement, via layoutId + workaround choreography, what `useGlide` does declaratively. Fixes A4 for the hover class. | 2 files | ~50 |
| B9 | **Trigger cloning ×2 → 1.** `ovCloneTrigger` (`overlay-core.tsx:49-83`) vs Tooltip's clone + `chain` (`Tooltip.tsx:245-248,350-364`) — one `mergeTriggerProps(child, handlers, aria)`. | 2 files | ~30 |
| B10 | **Scroll-edge data-attrs ×3 → 1.** `Dialog.tsx:42-62` (`data-scroll-top/bottom`), `Table.tsx:247-269` (`data-scrolled/x-back/x-more`), `Tabs.tsx:173-180` (`data-fade`) — one `useScrollEdges(ref, axes)` hook. | 3 files | ~45 |
| B11 | **Fossils & noise.** Manual prop-splitters for a dead "buildless pages" constraint (`Tag.tsx:41-57`, `ToggleTag.tsx:34-52` — object rest is fine everywhere React 19 runs); React-hook rename destructures (`overlay-core.tsx:11-16`, `select-core.tsx:12-17`, `sheet-drag.tsx:10`, `Dialog.tsx:10`); alias constants `drpMotion`/`dtfMotion`/`tabsMotion`/`coreSM`/`ovSM`/`sdSM`/`TabsSM` (module scope already isolates — import `motion` plainly); in-body `const { useState } = React` (`Select.tsx:71`, `MultiSelect.tsx:84`); dead conditionals (A8-4). | ~12 files | ~110 |
| B12 | **Token px reader ×4 → 1** (A7). | 4 files | ~25 |
| B13 | **Near-duplicate props interfaces.** Checkbox/Toggle props are ~90% shared; TextField/Textarea message props identical — shared base interfaces keep every JSDoc line but write it once. | inputs | ~60 |

### B2, re-examined (review pushback, 2026-07-07)

Three challenges were raised against the original B2; all three land, and the plan changed accordingly.

**1. "Doesn't a merge pollute state? They have inherently different state."** Yes. A `multiple`-prop merge forces one component to hold `string | null | string[]`, which means `Array.isArray` branches on every state read, discriminated-union gymnastics in the public types, and a commit path that does two unrelated things behind a flag. Rejected. The chosen cut keeps state where it belongs: each public component owns its own `useControllable` (single: `string | null`; multi: `string[]`), its own commit policy (commit-and-close vs toggle-and-stay), and its own trigger-text derivation. Only the *stateless* parts are shared, parameterized by two pure functions (`isSelected`, `onCommit`) and one flag (`closeOnCommit`). No shared code ever inspects the shape of the value.

**2. "How is there 85% similarity?"** Measured over the two component bodies (JSDoc interfaces excluded — those must stay per-component): `Select.tsx:80-144` ≡ `MultiSelect.tsx:93-159` (state plumbing, refs/ids, show/hide, query reset, `useSelectMenu` call, glide effect — differing only in the commit function) and `Select.tsx:174-262` ≡ `MultiSelect.tsx:191-280` (the entire menu render: search field, list, group loop, the 35-line option row, empty/loading), differing in exactly: one `aria-multiselectable` attr, one `data-multiple` attr, the check-slot content, and the id prefix. That's ~150 of ~175 non-JSDoc lines each.

**3. "Why does select-core exist then, and why is it 424 lines on top of everything?"** Because it cut the abstraction at the wrong layer. Its 424 lines are: ~55 option-model utils (`normalize`/`matches`/`useControllable`), ~140 `useSelectMenu` (keyboard machine + placement + outside-press — of which ~40 re-implements overlay-core, see B1), ~155 *leaf* components (trigger, menu shell, search field, empty/loading/filter rows), ~75 types/variants/imports. It extracted the pieces that vary least between the twins while leaving the assembly — the part that actually repeats — duplicated in both consumers. The fix is to move the assembly in (`useListbox` + `ListboxPanel`, ~+120 in core) while deleting the overlay re-implementation and the `useControllable` copy (~−55): core lands ~≤500 and the twins drop to ~110-130 each. Cluster: 972 → ~775 lines, DOM and behavior identical.

**Sum of receipts: ~1,330 code lines.** Comment tightening (the 30-40-line essay headers in `Tabs.tsx:3-40`, `Tooltip`, `overlay-core`, `TimeField.tsx:3-20` compress to the same information at CLAUDE.md density — content-preserving, not reformatting): **~250-300 more.**

### The honest verdict on "−50%"

**RETRACTED (see the estimate post-mortem below): the ceiling below was derived with the same flawed method as the cluster estimates.** Original claim kept for the record: ~20-24% (≈1,600-1,900 lines) under the locked constraints (identical UX, identical visuals, identical public API, separate Select/MultiSelect state, every JSDoc line kept).

### Estimate post-mortem (2026-07-07, after applying B2 + B4 + B5)

Measured results against the table above: B2 claimed ~430 → delivered −59. B4+B5 claimed ~510 → delivered −46. **Realization ≈ 0.1× of estimate.** Three systematic errors: (1) estimates counted whole look-alike blocks, including their non-shared interiors (the range band/caps, the selection pill, bespoke controls); (2) extraction overhead — interfaces, imports, docs on every shared piece — was never priced; (3) deliberate divergence was counted as duplication (the two calendar panels differ for documented mechanical reasons; a merge would be a config-blob, not a saving). And after B2 exposed the method, B4/B5 were still quoted at face value instead of re-measured — the process failure that matters most.

**Corrected ceiling under the locked constraints: ~5-7% total (≈400-550 lines), of which ~85 is applied.** Remaining honest sources: comment tightening ~200-250 (real deletable lines, content-preserving), Tooltip layer adoption (A6/B1) ~80-120, B8-B13 measured ~80-120 combined. Treat every unapplied per-cluster number in the table above as a block-similarity guess, not a promise. Getting materially past ~7% requires the rejected levers (JSDoc strip, feature cuts, API merges) — under "same UX, same API, docs kept" this codebase is ~93-95% load-bearing, which is what the verdict below already said while the table contradicted it.

50% would require removing ~3,940 lines, and after the ~1,330 of genuine duplication above, the remaining mass is *earned*: aria wiring, keyboard machines (time-core's segment machine, select typeahead, calendar roving focus), motion choreography (toast stacking math, sheet drag physics, tab ink keyframes), and ~400 lines of prop documentation that is the "agents can read this" moat. This codebase is feature-dense, not bloated — the duplication is real but bounded, and it clusters exactly where the hazards live (three positioning engines, five field chromes, seven controllable hooks).

Levers beyond the ceiling, with their status:

| Lever | Saves | Status |
|---|---|---|
| Strip per-prop JSDoc from source (docs only in llms.txt/site) | ~400 | **rejected in review** — DX is the moat |
| Collapse Select/MultiSelect into one exported component (`multiple` prop) | ~80 more | **rejected in review** — pollutes state, public API change |
| Drop StatusBadge `morph` mode, toast swipe/tone gestures, sheet drag | ~290 | violates the brief (visible UX loss) — not proposed |
| Merge date fields into one `DateField mode="single\|range\|datetime"` | ~150 more | public API change — discuss separately if ever |

Recommendation: take the ~20-24% that makes the codebase *better*, not the 50% that makes it worse.

### What NOT to touch (audited, earns its lines)

`toast-store.ts` (framework-free queue, clean), `time-core.tsx` (segment machine — intricate and correct), `sheet-drag.tsx` (drag physics + scroll handoff), `overlay-core`'s stack/focus-trap/inert/scroll-lock (this *is* the engine everything should adopt), `Button`/`Checkbox`/`Toggle`/`Collapse`/`Badge`/`Avatar`/`IconSlot` (already minimal), `date-utils.ts`, `Textarea`'s mirror auto-grow.

---

## C. Suggested execution order (when changes are approved)

1. **Foundations (no visual change):** shared `useControllable`, `readTokenPx`, `mergeTriggerProps`, `useScrollEdges`, delete B11 noise. — **APPLIED 2026-07-07, complete**: `use-controllable.ts` + `token-px.ts` (all 3 copies + 4 px readers deleted, Tooltip's rem-broken import-time `TIP_GAP` made lazy); trigger cloning unified as `layer.tsx cloneTrigger` (B9 — ovCloneTrigger is now a 12-line adapter, Tooltip's clone+`chain` deleted); `use-scroll-edges.ts` (B10 — Dialog's local hook, Table's live-scroll effect and Tabs' updateEdges all ride it, each keeping its exact data-attrs; Table's 1px-vs-0px `data-scrolled` threshold preserved by handing the raw element to the callback); inline controllable hand-rolls replaced in ToggleTag/Alert (direct) and Toggle (state via hook, public event-handler contract untouched); B11 noise gone — Tag/ToggleTag manual prop-splitters → object rest (Tag's grouped spread needs one `Record<string,unknown>` cast: span props whose names collide with Motion gesture callbacks can't be typed onto motion.span), hook-rename destructures and `ovMotion/OvAnimatePresence/ovSM/sdSM/TabsSM/dlgUse*` aliases deleted, overlay-core no longer re-exports motion (Overlay imports it plainly).
2. **A3 CSS graph:** add owning-CSS imports / extract `CheckGlyph` + `Odometer` (B6/B7). — **APPLIED 2026-07-07**: `checkbox/check-glyph.tsx` (Checkbox, Table, MultiSelect), `badge/odometer.tsx` + `odometer.css` split out of badge.css (CountBadge, Table), owning-CSS imports in Table/Toast/Alert/Pagination/DateField/DateRangeField (`button.css`), RadioGroup/ToggleTag (`collapse.css`), field-shell (`input.css`), FilterRow renders the real `<Collapse>`. tsup `onSuccess` re-points cross-directory CSS specifiers at dist's flat copies. Verified in dist by graph-walking entries: table.js → checkbox+odometer+button css; multi-select.js → checkbox css; select.js stays lean; date-field.js → input+button css.
3. **Overlay engine adoption:** Select menu onto portal+anchor (fixes A2), Tooltip host onto `OverlayPortal` + shared placement (fixes A6), dev-mode containing-block warning (A10-1). — **Select half APPLIED 2026-07-07**: portal + stack primitives extracted to css-free `overlay/layer.tsx`; the menu now body-portals AND joins the overlay stack (dialog focus traps defer; Escape unwinds menu-then-dialog; z from the stack). Verified: menu stays glued to the trigger (dx=0) under a `transform`ed ancestor. `select.css`'s five `.select[data-multiple] …` menu rules re-anchored to `.select__menu[data-multiple]` (descendant selectors don't survive a portal).
   **Tooltip half APPLIED 2026-07-07**: the private `createRoot` second React tree is gone — the host now renders inside exactly one living Tooltip's tree via election (module registry; first registered wins, next takes over on unmount and the store re-feeds the same payload), so context crosses, the host dies with the app, and `react-dom/client` is no longer imported. The host mounts as a *sibling* of the anchor (portal events bubble through the React tree — nested, the bubble's own pointer events would feed back into show/hide). Bubble id + `aria-describedby`: `scheduly-tooltip` → `pds-tooltip`. Honest ledger: −0 lines — the election machinery (~30) costs what `ensureHost` saved; this was a correctness item (A6), not a size item. Tooltip's flip/clamp placement math stays its own: it flips per-axis on the measured bubble and is fine post-portal; forcing it onto `useAnchorPosition` would change placement behavior for no hazard gain (B1's Tooltip row realized ~0).
   **A10-1 verdict: obsolete by architecture.** The containing-block warning was designed for in-place `position:fixed` surfaces; after A2, every anchored surface (Overlay, Select menu, Tooltip, Dialog, Sheet, Toast) body-portals, so an ancestor transform can no longer hijack their coords. The remaining transform hazard class was FLIP measurement (A4) — closed by B8 below. No dead warning shipped.
4. **Select+MultiSelect listbox extraction (B2, revised), field chrome (B4), date restructure (B5), glide migration (B8/A4).** One PR each; screenshot-diff docs pages per component. — **B2 APPLIED 2026-07-07**: `useListbox` + `ListboxPanel` in select-core; Select 265→118, MultiSelect 283→138, both keep their own state models and full JSDoc. Honest ledger: select-core grew to 657 absorbing the shared assembly + portal/stack wiring, so the cluster nets −59, not the ~−200 estimated — the sharing interfaces (`UseListboxArgs`, panel props) and the portal machinery ate most of it.
   **B4 APPLIED 2026-07-07**: `input/field-chrome.tsx` (`FieldLabel`, `FieldMessage`, `resolveFieldMessage`) adopted by TextField, NumberField, Textarea, field-shell; RadioGroup's pasted collapse DOM became the real `<Collapse>`. Deliberate alignments (the A9 unification): NumberField and the date fields' messages now animate via Collapse like TextField's, and the date fields' label renders as `<label>` instead of `<span>` (same class, same look). RadioGroup does NOT share the .fld DOM — it's a `fieldset/legend` with its own `.rg` vocabulary; the audit's "5×" overcounted it. Textarea's missing input.css (it renders .fld) is now carried via field-chrome.
   **B5 APPLIED 2026-07-07 (reduced scope)**: the full `CalendarMonth` unification was **rejected on execution** — the two panels differ structurally on purpose (row-wrapped vs flat grid DOM, one 3-button header vs per-month headers, JS `animate()` vs CSS-keyframe month slide (the DRP comment explains Motion fights the layoutId caps), different PageUp/Down semantics) and a shared component would be a config-blob riskier than the duplication. What did land: shared `useDayFocus` (seed + armed focus-chase), `FieldTrigger` (the ×3 pasted trigger button — must spread rest props through, Overlay clones onClick/aria/ref onto it), `within()`/`displayDay()` in date-utils, `DateFieldBaseProps` (shared prop JSDoc written once, inherited by all four field interfaces), DateTimeField onto `useControllable` (B3 leftover), all `dtf/drp/dttf/DTF_/DRP_` alias fossils killed, both A8-4 dead conditionals removed, TimeField's 18-line essay header compressed. `useResponsiveOverlayMode` stays in DateRangeField: single-date sheet adoption (A8-3) needs `.dtp` sheet CSS that doesn't exist — new design work, not restructuring.
   B8 pending.
5. **State-layer wash tokens (A5)** + surface-matrix screenshots. — pending.
6. **Motion truth (A1):** adapter module + honest packaging/copy. — pending.
7. **Guardrails (A10-2/3/4)** so the class stays dead. — pending (the standalone twins now serve as the A3 regression harness: both pages must render identically).

Verification per phase: `pnpm typecheck && pnpm build`, playground screenshot diffs at 1440/390 (light + dark band), the hostile-context interaction tests from A10-3, and a scratch consumer app importing each subpath in isolation (catches A1/A3 regressions).
