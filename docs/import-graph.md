# Import Graph — Zyncat UI

Structural map of the internal module dependencies in `src/`, generated with
[`madge`](https://github.com/pahen/madge) (a devDependency).

- **Files analyzed:** 88 (`.ts` / `.tsx`)
- **Circular dependencies:** none ✅
- **Shape:** a two-tier library — a small foundation of tokens / hooks / icon
  plus overlay & motion primitives, then 31 independent public components that
  fan out from it. Public components never import one another, with a single
  exception — `Button`, which the rest reuse directly (see below).

_Generated 2026-07-09._

---

## Hubs — most depended-upon modules

Highest in-degree (how many internal files import it). These are the shared
foundation; a change here ripples widest.

| In-degree | Module                                   | Role                                                                                                                      |
| --------: | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|        19 | `tokens/motion-tokens.ts`                | JS/CSS motion bridge — every animated component reads durations/easings from here instead of hardcoding                   |
|        15 | `components/icon/Icon.tsx`               | Curated internal glyph set, statically imported for tree-shaking                                                          |
|        13 | `components/use-controllable.ts`         | The library's single controlled/uncontrolled state hook                                                                   |
|         9 | `components/icon/IconSlot.tsx`           | Sizes consumer-supplied icon nodes to `--icon-*` tokens                                                                   |
|         7 | `components/overlay/layer.tsx`           | CSS-free layering primitives (portal + stack + outside-press) behind every floating surface                               |
|         6 | `components/motion/glide.tsx`            | Spring "active pill" indicator (`useGlide` + `GlidePill`)                                                                 |
|         6 | `components/button/Button.tsx`           | The button primitive — also the public `@zyncat/ui/button` export, now dogfooded by every component that renders a button |
|         4 | `components/token-px.ts`                 | CSS-token → px runtime utility                                                                                            |
|         4 | `components/input/field-chrome.tsx`      | Shared label + animated-message chrome for field controls                                                                 |
|         4 | `components/date-picker/field-shell.tsx` | Shared segment + trigger shell for all date/time fields                                                                   |
|         4 | `components/date-picker/date-utils.ts`   | Parse / format / compare helpers for the date-picker family                                                               |

**Shared CSS hubs** (stylesheets a sibling component imports directly, not via a
component): `date-picker/date-picker.css` (8), `input/input.css` (4).
`button/button.css` is deliberately absent — components render `<Button>` rather
than importing the raw `.btn` classes, which is why `Button.tsx` itself carries
in-degree 6 while `button.css` has **zero** direct sibling importers.

---

## Coordinators — files that assemble the most pieces

Highest out-degree (internal modules imported; `madge` counts the component's own
CSS import too).

| Out-degree | File                             | Assembles                                                                                              |
| ---------: | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
|          8 | `dialog/Dialog.tsx`              | overlay `layer`+`modal`, Icon, IconSlot, use-controllable, use-scroll-edges, motion-tokens, dialog.css |
|          7 | `popover/Popover.tsx`            | overlay `layer`+`panel`+`position`+`focus`, use-controllable, motion-tokens, popover.css               |
|          7 | `toast/Toast.tsx`                | toast-store, glass/glint, token-px, Icon, Button, motion-tokens, toast.css                             |
|          7 | `table/Table.tsx`                | badge/odometer, Button, Checkbox, Icon, use-scroll-edges, motion-tokens, table.css                     |
|          7 | `date-picker/calendar-panel.tsx` | Button, Icon, motion/glide, use-day-focus, date-utils, motion-tokens, date-picker.css                  |
|          7 | `date-picker/range-panel.tsx`    | (same set as `calendar-panel`)                                                                         |
|          7 | `date-picker/DateTimeField.tsx`  | Popover, field-shell, calendar-panel, time-core, date-utils, use-controllable, date-picker.css         |
|          6 | `sheet/Sheet.tsx`                | overlay `layer`+`modal`, use-sheet-drag, use-controllable, motion-tokens, sheet.css                    |
|          6 | `select/core/panel.tsx`          | Icon, IconSlot, Collapse, glide, `./menu`, use-listbox                                                 |
|          6 | `radio-group/RadioGroup.tsx`     | Icon, IconSlot, Collapse, glide, motion-tokens, radio-group.css                                        |
|          6 | `date-picker/DateField.tsx`      | Popover, field-shell, calendar-panel, date-utils, use-controllable, date-picker.css                    |
|          6 | `date-picker/DateRangeField.tsx` | Popover, Sheet, field-shell, range-panel, use-controllable, date-picker.css                            |

`DateRangeField` pulls **both** `Popover` and `Sheet` — the panel opens in a
popover on wide viewports and an edge sheet on narrow ones.

---

## Layering

```bash
Layer 0 — Foundation  (imported everywhere; import nothing internal)
  tokens/motion-tokens.ts                 JS/CSS motion values
  components/use-controllable.ts          controlled/uncontrolled hook
  components/token-px.ts                   token → px util
  components/use-scroll-edges.ts           scroll-edge detection
  components/icon/Icon.tsx                 glyph set
  components/icon/IconSlot.tsx             consumer-icon sizing
  components/glass/glint.ts                glass shimmer effect
  components/date-picker/date-utils.ts     date parse/format/compare
  components/date-picker/use-day-focus.ts  calendar roving focus

Layer 1 — Shared primitives  (assemble Foundation pieces)
  components/overlay/layer.tsx             portal + stack + outside-press (floating-surface base)
  components/overlay/position.ts           anchored placement
  components/overlay/focus.ts              focus return / trap policy
  components/overlay/panel.tsx             floating-panel renderer (Popover + modal shell)
  components/overlay/modal.tsx             modal machinery (scrim + trap + scroll-lock) on top of the above
  components/motion/glide.tsx              spring pill indicator
  components/motion/Collapse.tsx           collapse animation
  components/input/field-chrome.tsx        label + message chrome for fields
  components/date-picker/field-shell.tsx   date/time field shell

Layer 2 — Domain cores  (assemble Layer 1 + Foundation)
  components/select/core/*                 listbox mechanics (menu, panel, trigger, use-listbox)
  components/date-picker/calendar-panel.tsx  month-grid panel (DtpPanel)
  components/date-picker/range-panel.tsx     range panel (DrpPanel)
  components/date-picker/time-core.tsx       time-segment mechanics

Layer 3 — Public components  (import Layers 0–2, never each other)
  Alert · Avatar · AvatarGroup · Badge · Button · Checkbox · Collapse ·
  CountBadge · DateField · DateRangeField · DateTimeField · Dialog · MultiSelect ·
  NumberField · OtpField · Pagination · Popover · RadioGroup · Select · Sheet ·
  StatusBadge · Table · Tabs · Tag · Textarea · TextField · TimeField · Toast ·
  Toggle · ToggleTag · Tooltip
```

`Button` also sits in Layer 3 (it is a public export), but it is the one public
component the others import — hence its appearance among the hubs.

### Who uses which shared core

| Shared core                                 | Consumed by                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| `overlay/layer.tsx`                         | Dialog, Popover, Sheet, Tooltip, select/core/menu (+ overlay modal/focus) |
| `overlay/modal.tsx`                         | Dialog, Sheet                                                             |
| `overlay/panel.tsx`                         | Popover (+ overlay/modal)                                                 |
| `overlay/position.ts`                       | Popover, select/core/menu                                                 |
| `select/core` (index)                       | Select, MultiSelect                                                       |
| `input/field-chrome.tsx`                    | TextField, NumberField, Textarea (+ date field-shell)                     |
| `date-picker/field-shell.tsx`               | DateField, DateRangeField, DateTimeField, TimeField                       |
| `date-picker/calendar-panel.tsx` (DtpPanel) | DateField, DateTimeField                                                  |
| `date-picker/range-panel.tsx` (DrpPanel)    | DateRangeField                                                            |
| `date-picker/time-core.tsx`                 | DateTimeField, TimeField                                                  |
| `motion/glide.tsx`                          | calendar-panel, range-panel, RadioGroup, select/core, Tabs                |
| `motion/Collapse.tsx`                       | field-chrome, RadioGroup, select/core/panel                               |
| `glass/glint.ts`                            | Toast, StatusBadge                                                        |

---

## Observations

1. **The overlay module is an internal stack, not a public component.**
   `layer.tsx` (portal + outside-press) is the base; `position`, `focus` and
   `panel` build on it; `modal.tsx` composes them into the scrim + focus-trap +
   scroll-lock shell. Popover consumes the non-modal set directly; Dialog and
   Sheet add `modal`; Tooltip and the select dropdown take only `layer`
   (+ `position`). There is **no `Overlay` export** — the public surface is
   Popover / Sheet / Dialog / Tooltip.
2. **date-picker is the coupling epicentre.** The field wrappers are thin; the
   weight lives in `calendar-panel` (DtpPanel) and `range-panel` (DrpPanel), each
   out-degree 7 and shared across variants. `DateTimeField` composes on top of
   `calendar-panel` + `time-core`; `DateRangeField` swaps Popover for Sheet on
   narrow viewports.
3. **select routes around the modal machinery.** `select/core/menu` imports
   `overlay/layer` + `overlay/position` directly (portal + placement), never
   `modal` — the dropdown skips scrim / trap / scroll-lock.
4. **`toast` is a self-contained island.** Owns its state store
   (`toast-store.ts`), uses `glass/glint.ts`, and touches no overlay/select core.
5. **`table` is similarly isolated.** Borrows only `odometer` (badge), `Checkbox`,
   `Button`, Icon, and `use-scroll-edges` — no field/overlay cores.
6. **Button is the one public component the others import.** Alert, Pagination,
   Table, Toast, and both date panels render `<Button>` rather than hand-rolling
   button markup, giving `Button.tsx` in-degree 6. Every other public component is
   a pure leaf.

---

## How to regenerate

`madge` is installed as a devDependency.

```bash
# Full dependency map (JSON)
npx madge src --extensions ts,tsx --json

# Circular dependencies (should be none)
npx madge src --extensions ts,tsx --circular

# Coordinators — out-degree per file
npx madge src --extensions ts,tsx --json \
  | jq -r 'to_entries[] | "\(.value|length)\t\(.key)"' | sort -rn | head

# Hubs — in-degree (how many modules import each file)
npx madge src --extensions ts,tsx --json \
  | jq -r 'to_entries[] | .value[]' | sort | uniq -c | sort -rn | head

# Optional: render an SVG (requires graphviz `dot` installed)
npx madge src --extensions ts,tsx --image docs/import-graph.svg
```
