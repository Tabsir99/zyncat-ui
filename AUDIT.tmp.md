# Audit — comments + `motion` dependency

Base commit `47d6bc6` · 2026-08-11 · temporary file, delete when consumed

---

# Part 1 — Comment audit (APPLIED)

## Result

| Bucket                                | Count | Action      |
| ------------------------------------- | ----: | ----------- |
| Internal prose (line / block / JSDoc) |   363 | **deleted** |
| Shipped API JSDoc (reaches `.d.ts`)   |   428 | kept        |
| Tooling directives                    |    22 | kept        |
| **Total before**                      |   813 | 72 files    |

- Files touched: 72 of 72 `.ts`/`.tsx` in `src/`.
- Deleted kinds: section banners (`/* ---- layer 2: Motion JS clock ---- */`), field-restating trailers (`// "button"`), internal rationale prose, JSDoc on non-exported helpers.

## Why 428 JSDoc were kept — this is the load-bearing finding

- `tsup`'s `dts` pass copies JSDoc **verbatim** into `dist/*.d.ts`. Verified: `/** Control height. sm 28px - md 36px (default) - lg 40px. @default 'md' */` is present in `dist/button.d.ts`.
- `src/mcp/server.ts` → `readTypes()` reads `dist/*.d.ts` and serves it as the `## Types` half of `get_component`.
- So prop-level JSDoc **is** the MCP's prop documentation. Deleting it makes `get_component` return bare type unions with no semantics.
- That is the direct cause of the failure mode raised in the previous session: an agent that cannot see what `variant='unstyled'` or `htmlProps` mean falls back to hand-rolling via `children`.
- Conclusion: these are not comments in the CLAUDE.md sense — they are the shipped API reference. Source is the only place TypeScript can carry them.
- **Open decision:** if the zero-comment rule is meant to cover these too, the replacement is a generated `.d.ts` post-process step that injects docs from an external file. Not built; say the word.

## Verification

- `pnpm typecheck` — clean (`tsc --noEmit` + `tsconfig.node.json`).
- `pnpm format:check` — all files match Prettier.
- `pnpm build` — 64 JS (56 client) + 25 CSS + 41 `.d.ts`.
- **`dist/*.d.ts` corpus byte-identical before vs after** (sha256 `0447642…`) — proves zero shipped-doc loss.

## Incidental fixes

- `dist/` had **zero `.d.ts`** on entry — the previous session's `pnpm build` was killed mid-declaration-pass. `get_component` was returning "package is not built" for every component. Rebuilt.
- Re-applied the `entryTeaser()` truncation fix to `src/mcp/server.ts` (lost to a restore mid-audit), now comment-free.
- Restored one over-deleted prop doc: `/** Chip label. */` in `Badge.tsx`.

---

# Part 2 — `motion` dependency audit

## Weight — measured, not estimated

esbuild `--bundle --minify`, `react`/`react-dom` external, `gzip -9`:

| Import surface                                         |   raw B | gzip B | vs today |
| ------------------------------------------------------ | ------: | -----: | -------- |
| **Today** — full surface used by the library           | 137,441 | 45,955 | —        |
| Drop drag + layout, keep `motion.*` + AnimatePresence  | 134,832 | 45,051 | **−2%**  |
| `animate()` only, vanilla `motion`                     |  63,115 | 22,596 | −51%     |
| `m` + AnimatePresence + LazyMotion (features deferred) |  22,440 |  8,920 | −81%     |
| Hand-rolled WAAPI call                                 |     193 |    182 | −99.6%   |

### Finding: incremental feature removal buys nothing

- Dropping drag **and** layout saves **904 B gzip (2%)**.
- The `motion.*` component factory pulls the whole render/animation pipeline regardless of which props are used.
- Only two moves actually pay: abandon `motion.*` React components entirely, or switch to `m` + `LazyMotion`.

## Coexistence / dedup reality

- `motion` is already an **optional** peer dep and `external` in `tsup` — it is never bundled. Consumers pay, not us.
- Two copies are **not** currently safe: `src/components/dev/slowmo-engine.ts` mutates module-level singletons — `frameData.timestamp`, `MotionGlobalConfig.useManualTiming`, `acceleratedValues`.
- With two copies the devtools time-scaler drives only its own copy; the app's animations ignore it.
- So "a lighter lib that can coexist as 2 copies" is only true for libs with **no global frame loop**. WAAPI qualifies (browser-owned timeline). Any JS-driven engine with a singleton clock has the same problem motion has.

## Usage surface

- **19 files** import from `motion`.
- **20** `<motion.*>` elements: 11 `span`, 7 `div`, 1 `tr`, 1 `li`.
- **8** `AnimatePresence` sites.

### Tier 1 — WAAPI 1:1, no engine needed (9 files)

| File                                   | Uses                             |
| -------------------------------------- | -------------------------------- |
| `composites/tabs/Tabs.tsx`             | imperative `animate()` translate |
| `composites/pagination/Pagination.tsx` | imperative `animate()`           |
| `internal/overlay/modal.tsx`           | 2 `motion.div`, variants         |
| `internal/overlay/panel.tsx`           | 1 `motion.div`                   |
| `composites/select/core/menu.tsx`      | 1 `motion.div`, variants         |
| `composites/popover/Popover.tsx`       | variants only                    |
| `composites/dialog/Dialog.tsx`         | AnimatePresence only             |
| `composites/alert/Alert.tsx`           | 1 `motion.div`, height + opacity |
| `composites/tooltip/tooltip-host.tsx`  | `motion.div` + `motion.span`     |

- All are opacity / scale / translate / height keyframes on open+close.
- Modern CSS covers most of this with `@starting-style` + `transition-behavior: allow-discrete` — zero JS, and it fits the library's CSS-token thesis.

### Tier 2 — exit-before-unmount orchestration

- 8 `AnimatePresence` sites need a presence primitive: hold the node mounted, run the exit keyframes, then unmount.
- ~40–60 lines with WAAPI `finished` promises. Self-contained, no layout math.

### Tier 3 — FLIP / shared-element layout (6 files) — real engine work

| File                                        | Uses                             |
| ------------------------------------------- | -------------------------------- |
| `primitives/radio-group/RadioGroup.tsx`     | `LayoutGroup` + 3 `layoutId`     |
| `motion/glide.tsx`                          | `layoutId` + `useLayoutSelfHeal` |
| `primitives/tag/Tag.tsx`                    | `layout` (neighbours reflow)     |
| `composites/table/Table.tsx`                | `motion.tr` + `layout`           |
| `composites/date-picker/calendar-panel.tsx` | 1 `layoutId`                     |
| `composites/date-picker/range-panel.tsx`    | 2 `layoutId`                     |

- Measure → invert → play is ~1–2 KB.
- The cost is the edge cases already encoded here: nested-transform poisoning (`useLayoutSelfHeal` exists precisely for this), scroll-relative rects, cross-element `layoutId` continuity, `LayoutGroup` coordination.

### Tier 3 — drag physics (2 files) — most expensive

| File                                 | Uses                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `composites/sheet/use-sheet-drag.ts` | `useMotionValue`, `useTransform`, `useDragControls`, `dragElastic`, `dragConstraints` |
| `composites/toast/Toast.tsx`         | drag-to-dismiss, `useMotionValue`, `dragElastic`                                      |

- Behavior to preserve: pointer-intent handoff to scroll, damped rubber-band overdrag, velocity-based dismiss threshold, scrim opacity derived from travel, selection suppression during drag.
- Needs a reactive value primitive (`useMotionValue`/`useTransform` equivalent) plus a spring integrator.

### Tier 4 — motion internals, no public equivalent (1 file)

- `components/dev/slowmo-engine.ts` — `frameData`, `MotionGlobalConfig.useManualTiming`, `acceleratedValues`.
- Reaches into motion's private clock to time-scale JS animations.
- Under a hand-rolled engine this gets **simpler**: we own the clock, so no private-API poking and no `acceleratedValues` juggling.

## Options

**A. `m` + `LazyMotion`** — 8.9 KB initial, −81%.

- Keeps every behavior, smallest diff.
- Layout + drag require the `domMax` feature bundle (42.5 KB) — deferred, not removed.
- Forces consumers to wrap their app in `<LazyMotion features={…}>`. Bad for a component library: a single `@zyncat/ui/tabs` import shouldn't demand a root-level provider.
- Still `motion`; dedup and the slowmo-singleton problem remain.

**B. Hand-roll everything** — ~6–10 KB own engine, zero peer, full dedup immunity.

- Tier 1+2 are cheap and low-risk (~2–4 KB).
- Tier 3 FLIP + drag is where the real work and the real regression risk sit.
- Tier 4 improves.

**C. Lighter third-party** — not recommended on current evidence.

- No off-the-shelf library provides FLIP layout + React presence + drag physics at materially lower weight; a swap would leave Tier 3 to hand-roll anyway, so the dependency buys only Tier 1+2 — the part that is nearly free.
- Any candidate needs the same esbuild measurement before it earns consideration; I have not measured any.

## Recommendation — split the peer by tier

1. Hand-roll Tier 1 + Tier 2 on WAAPI (prefer CSS `@starting-style` where it suffices). Clears **9 of 19** files.
2. Keep `motion` for Tier 3 only (FLIP + drag): RadioGroup, glide, Tag, Table, calendar/range panels, Sheet, Toast.
3. Consumers importing only Tier 1 components then pay **zero** — `needsMotion()` in `src/mcp/server.ts` already computes and reports per-component peer need, so the granularity is a modeled concept, not new surface.
4. Revisit Tier 3 separately. Drag is one hook (`use-sheet-drag`) and FLIP is one concept — both are tractable, but neither should ride along with the cheap win.

Sequenced this way the first step is low-risk, independently shippable, and removes the peer for the majority of the component surface.
