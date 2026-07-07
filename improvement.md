# premium-ds — revamp audit

Recorded 2026-07-07, before any change. Scope: `src/components/` (22 components, 38 TS/TSX files, 7,881 lines TS/TSX + 4,649 CSS). Two tracks: (A) every instance of the "works in the playground, breaks in a real app" hazard class, (B) duplication / complexity with a credible size-reduction plan.

Method: every TSX/TS file read in full; CSS greped for positioning, surface tokens, z-index, and cross-file class usage; claims cross-checked against `package.json`, `tsup.config.ts`, `styles.css`, and `llms.txt`.

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

**Fix:** render `SelectMenu` through the overlay engine (portal + `useAnchorPosition`), or promote it to the native top layer (`popover` attribute — keeps DOM position, so scoped token overrides still inherit, which a `<body>` portal loses). Either way keep the existing rect math. Add the dev-mode guard from A10.

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
| B1 | **One overlay engine.** Select's placement + outside-press (`select-core.tsx:131-170`) and Tooltip's flip/clamp + portal plumbing (`Tooltip.tsx:84-114,178-243`) re-implement what `overlay-core` already exports (`useAnchorPosition`, `useOutsidePress`, `OverlayPortal`). Adopting the engine *is* the fix for A2 + A6. | select-core, Tooltip | ~190 |
| B2 | **Select + MultiSelect merge.** The two files are ~85% identical — same trigger wiring, same group/option render loop, same glide effect, same empty/search plumbing (`Select.tsx:147-259` ≡ `MultiSelect.tsx:162-277`). One internal listbox component with a `multiple` flag; `Select`/`MultiSelect` become thin policy wrappers (commit semantics + trigger text). Also deletes the `Ms*` import-alias block (`MultiSelect.tsx:6-19`) and one near-identical 30-line props interface. | select/ | ~430 |
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

**Sum of receipts: ~1,590 code lines.** Comment tightening (the 30-40-line essay headers in `Tabs.tsx:3-40`, `Tooltip`, `overlay-core`, `TimeField.tsx:3-20` compress to the same information at CLAUDE.md density — content-preserving, not reformatting): **~250-300 more.**

### The honest verdict on "−50%"

**~25-30% (≈2,000-2,300 lines) is the real, receipts-backed ceiling under your own constraints** (identical UX, identical visuals, identical public API, prop JSDoc kept). 7,881 → ≈5,600-5,900.

50% would require removing ~3,940 lines, and after the ~1,900 of genuine duplication above, the remaining mass is *earned*: aria wiring, keyboard machines (time-core's segment machine, select typeahead, calendar roving focus), motion choreography (toast stacking math, sheet drag physics, tab ink keyframes), and ~400 lines of prop documentation that is the "agents can read this" moat. This codebase is feature-dense, not bloated — the duplication is real but bounded, and it clusters exactly where the hazards live (three positioning engines, five field chromes, seven controllable hooks).

Levers that would close the gap to 50%, each with a cost you'd need to accept:

| Lever | Saves | Cost |
|---|---|---|
| Strip per-prop JSDoc from source (docs only in llms.txt/site) | ~400 | kills IDE intellisense + the agent-legibility pitch — **not recommended** |
| Drop StatusBadge `morph` mode, toast swipe/tone gestures, sheet drag | ~290 | visible UX loss — violates the brief |
| Collapse Select/MultiSelect into one exported component (`multiple` prop) | ~80 more | public API change |
| Merge date fields into one `DateField mode="single\|range\|datetime"` | ~150 more | public API change |

Recommendation: take the ~25-30% that makes the codebase *better*, not the 50% that makes it worse. If the number itself matters for positioning, the API-merge levers (last two rows) are the defensible ones to discuss — they arguably improve the API.

### What NOT to touch (audited, earns its lines)

`toast-store.ts` (framework-free queue, clean), `time-core.tsx` (segment machine — intricate and correct), `sheet-drag.tsx` (drag physics + scroll handoff), `overlay-core`'s stack/focus-trap/inert/scroll-lock (this *is* the engine everything should adopt), `Button`/`Checkbox`/`Toggle`/`Collapse`/`Badge`/`Avatar`/`IconSlot` (already minimal), `date-utils.ts`, `Textarea`'s mirror auto-grow.

---

## C. Suggested execution order (when changes are approved)

1. **Foundations (no visual change):** shared `useControllable`, `readTokenPx`, `mergeTriggerProps`, `useScrollEdges`, delete B11 noise. Low risk, unblocks everything.
2. **A3 CSS graph:** add owning-CSS imports / extract `CheckGlyph` + `Odometer` (B6/B7). Verify per-subpath rendering in a scratch app.
3. **Overlay engine adoption:** Select menu onto portal+anchor (fixes A2), Tooltip host onto `OverlayPortal` + shared placement (fixes A6), dev-mode containing-block warning (A10-1).
4. **Select+MultiSelect merge (B2), field chrome (B4), date restructure (B5), glide migration (B8/A4).** One PR each; screenshot-diff docs pages per component.
5. **State-layer wash tokens (A5)** + surface-matrix screenshots.
6. **Motion truth (A1):** adapter module + honest packaging/copy.
7. **Guardrails (A10-2/3/4)** so the class stays dead.

Verification per phase: `pnpm typecheck && pnpm build`, playground screenshot diffs at 1440/390 (light + dark band), the hostile-context interaction tests from A10-3, and a scratch consumer app importing each subpath in isolation (catches A1/A3 regressions).
