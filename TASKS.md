# Docs & system polish — working task list

One task per review cycle. Status moves only after review.

## Task 1 — Color harmony at the token level (DONE)

Brief: the codeblock background looked way too off; get proper harmony on the tokens by
reimagining the actual values at the smallest level so the coloring hierarchy feels premium
and satisfying by default. Same problem on the date picker. Select trigger hover was way too
dark — make it similar to the secondary button. Things should feel connected, like a design
system someone put thought into.

- [x] Neutral ramp re-hued warm hue 96 → accent hue 198 at whisper chroma, light fills aired out (`src/tokens/color.css`)
- [x] Shadow ink cooled to match the ramp
- [x] Calendar selection: solid accent endpoints + selected day, white numerals (pale tint-on-tint didn't read committed)
- [x] Dark theme removed from the docs site completely (toggle, transition machinery, dark token block) — light only, per review round 2
- [x] Code block: light two-tone panel — `bg-subtle` body, `bg-muted` header, hairline frame
- [x] Code block: shadow added (`--shadow-sm`; flush embedded variants stay shadowless)
- [x] Select + DateField trigger hover: the secondary button's hover tone (`color-mix(surface 55%, muted)`) — round-1 wash swap (10% → 6% gray) was imperceptibly subtle
- [x] Reviewed & accepted

## Task 2 — Tabs active indicator spacing (DONE)

Brief: reduce the spacing between the tab items and the active indicator (ink) — should be
about `--space-px`, not the current visible gap.

- [x] Tab bottom gap 8px → the ink's own band plus a hairline, so pad-to-ink clearance is
      exactly `--space-px` (tab height 36px → 31px); `--tabs-ink-h` hoisted to `.tabs` so the
      relationship is stated in code, not a magic number
- [x] Docs headers re-tuned to the new baseline (hero preview bar, example-card header) —
      label and action-button centres measured at delta 0
- [x] Panel entrance: vertical drift dropped, x-only travel
- [x] Panel height teleport fixed — the root now FLIPs its box (`<Motion layout>` with
      `size: 'morph'`) so a taller or shorter tab grows into place instead of snapping
- [x] Reviewed & accepted

## Task 3 — pointerdown activation for responsiveness (IN REVIEW)

Brief: components with a click action should switch to pointerdown to feel super responsive.
Do NOT apply it to buttons directly — only internal things where the library controls the
trigger. It must be overridable. Open question to handle: when a consumer passes their own
trigger element, how does their choice of pointer vs click interact with ours — make sure
that works rather than assuming it does.

- [x] One shared primitive, `activationProps` (`internal/utils/activation.ts`) — mouse/pen activate on
      pointerdown, touch and keyboard fall through to click, modified and non-primary presses defer,
      `disabled`/`aria-disabled` never fire, and the press takes focus itself (focus otherwise lands on
      mousedown, one event too late for an overlay reading `activeElement` as it mounts)
- [x] Round 1 rolled it out everywhere the library owns a trigger. Review: pointerdown paired with a
      press effect feels unnatural — the surface arrives, then the control dips, reading as two events.
      Scaled back to the three surfaces where the wait is actually felt.
- [x] On by default: Select, MultiSelect, Dropdown (trigger + rows), Tabs, the date fields (trigger,
      day cells, month nav, presets — their trigger is the select trigger's twin) and Table's sort
      headers
- [x] Back to click by default: Popover, Dialog, Modal, Sheet, EmojiPicker. `activationProps` itself
      now defaults to click; a component opts in by defaulting its own `activateOn`
- [x] `activateOn?: 'pointerdown' | 'click'` still on every one of them, both directions — the reverted
      components can opt back in, the three can opt out
- [x] Tabs keeps its `:active` press rule (removing it was reverted on review). Whether a dip that lands
      after the surface has opened is worth keeping is a per-component judgement, not a rule
- [x] Dropdown trigger matched to the select trigger — `ovCloneTrigger` marks a pointerdown trigger
      `data-activate`, and `internal/overlay/trigger.css` drops its press transform and gives it the
      accent border + ring while expanded. Measured identical to `.select__trigger`'s open style. No
      scoped custom property of another component is touched, so a consumer's trigger keeps its own look
- [x] Deliberately excluded throughout: `Button` and anything rendered as one (Pagination, calendar
      Done, Alert action), native form controls, table rows (press-drag is text selection), dismiss buttons
- [x] Consumer-passed triggers: their own `onPointerDown`/`onClick` run first, and `preventDefault()`
      in their pointerdown cancels ours — measured: the click then activates normally
- [x] Rows inside a focus-managing panel use `holdFocus`, which cancels the pointerdown so focus stays
      where the panel put it (select option pick returns focus to the trigger; emoji grid keeps it out)
- [x] Verified in Chrome over CDP, both rounds: single activation per press, keyboard Enter/Space intact,
      touch defers to the tap, right-press and shift-press ignored, and the reverted components confirmed
      inert at pointerdown
- [ ] Reviewed & accepted

Pre-existing, unrelated to this task: committing a Select option with the keyboard leaves the listbox
open and focus off the trigger. Identical before and after this change (A/B'd against a stashed tree).

## Task 4 — "On this page" section readability

Brief: the ToC section feels uncomfortable to read (tiny uppercase mono links). Do something —
make it comfortable.

- [ ] Done & reviewed

## Task 5 — Examples reimagined (big one)

Brief: some components are not properly exampled — little thought went into their effect.
Confetti renders in a tiny space where it looks bad and makes no sense (confetti is page-wide
almost always); same for the Lens effect; there are likely others — needs good judgment per
component. Those need a much bigger area or possibly the entire page when mounted. Related:
the examples feel randomly stuffed without thought — some pages are insanely long scrolls for
no reason. Make the actual props editable via inputs so the user sees the full behavior by
interacting; keep things short otherwise. Small components like Button just render directly.
Be sensible about what makes a good reading UX per page.

- [ ] Audit every component page: which need page-scale demos, which need prop playgrounds, which render directly
- [ ] Page-scale / full-page demo surface for the components that need room (Confetti, Lens, …)
- [ ] Editable props via inputs on the pages where interaction shows the behavior
- [ ] Cut the pointless long scrolls
- [ ] Done & reviewed
