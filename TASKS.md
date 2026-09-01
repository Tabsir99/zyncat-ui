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

## Task 3 — pointerdown activation for responsiveness (DONE)

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
- [x] Reviewed & accepted

Pre-existing, unrelated to this task: committing a Select option with the keyboard leaves the listbox
open and focus off the trigger. Identical before and after this change (A/B'd against a stashed tree).

## Task 4 — "On this page" section readability (IN PROGRESS)

Brief: the ToC section feels uncomfortable to read (tiny uppercase mono links). Do something —
make it comfortable.

- [ ] Done & reviewed

## Task 5 — Examples reimagined (big one) (IN PROGRESS)

Brief: some components are not properly exampled — little thought went into their effect.
Confetti renders in a tiny space where it looks bad and makes no sense (confetti is page-wide
almost always); same for the Lens effect; there are likely others — needs good judgment per
component. Those need a much bigger area or possibly the entire page when mounted. Related:
the examples feel randomly stuffed without thought — some pages are insanely long scrolls for
no reason. Make the actual props editable via inputs so the user sees the full behavior by
interacting; keep things short otherwise. Small components like Button just render directly.
Be sensible about what makes a good reading UX per page.

- [x] Audit every component page. Three classes: page-scale demos (Confetti, Lens, FlowField,
      the four replicas, the two compounds), prop playgrounds (those plus the overlays, Select,
      TextField, Table, DateTimeField), direct renders kept as-is (Button, Icon, Badge tier,
      Collapse, the small form fields, Avatar, Tag, Pagination, Toast, Dropdown, EmojiPicker)
- [x] Playground kit (`apps/docs/components/playground.tsx`): stage + knob rail built from the
      library's own Select/Toggle/TextField, live-generated Code tab, replay; `FitStage` scales
      the oversized replicas (TikTok 1584px at 0.44) into the column with no horizontal scroll
- [x] Page-scale surfaces: Confetti playground defaults to `field="viewport"` — the burst rains
      over the whole docs page; Lens magnifies a full-width broadsheet specimen (9px small print,
      engraving); FlowField runs a 26rem hero band; fan/rail keep their 26rem frames
- [x] Confetti `field="viewport"` was broken under any transformed ancestor (the canvas stayed
      stage-sized — measured 746x411 instead of the window): viewport mode now portals the canvas
      to the body like every other viewport surface in the system
- [x] Editable props via inputs on 21 pages; knobs drive the real component live and the Code tab
      reflects the current values
- [x] Long scrolls cut: support-fan 9 examples → playground + 3, support-rail 8 → playground + 1,
      tiktok 8 → playground + 1, youtube 8 → playground only, facebook 6 → playground only,
      instagram 7 → playground + 1; expressive pages keep only the Retuning examples
- [x] Verified in Chrome over CDP: all 21 playground pages mount clean (no console errors, no
      horizontal overflow, ToC leads with Playground), dialog opens from its knobs, the fan
      re-targets on a live layout switch, viewport confetti canvas measures 1440x900 on body

Review round 2 - "desktop replicas look so small" + Facebook alignment:

- [x] Full-size view: the playground's stage and knob rail open in a viewport-filling `Modal`
      (Esc, focus trap, scroll lock, inert all come from the library). Measured at 1440x900:
      TikTok desktop 0.44 -> 0.76, Facebook reel-wide 0.44 -> 0.78, YouTube short 0.63 -> 0.82.
      On a 1920 monitor the wide surfaces land at 1:1
- [x] `FitStage` fits height as well as width inside that view, centres its inner box at every
      scale, and skips the re-render when the measurement is unchanged
- [x] YouTube joins FitStage: the 1106px Shorts watch page was overflowing the 746px column and
      being cropped by the card's `overflow: clip` - left title and right rail both cut off
- [x] The stage note moved out of the stage: a caption strip under it carries the note on the
      left and the Full size control on the right. It was painting over the replica's own
      bottom edge on the bare stages
- [x] Full size on the four replicas plus Lens (the broadsheet at full width) and FlowField
      (the field fills the viewport); the in-flow stage holds its height and says where it went
- [x] Facebook icon/metric alignment: `.facebook-feed-button` had no display, so an inline SVG
      picked up the line box's descender - the glyph sat 2.5px above its count in the post
      action bar, the dismiss X 3px above the kebab, the story close 2.5px above the mute chip,
      and the reel rail's declared 4px icon-to-count gap rendered as 10px. The button is now
      `inline-flex` centred, so the box hugs the glyph. Measured level in Chrome after
- [x] Surveyed TikTok, YouTube and Instagram for the same strut defect - none of them have it
- [ ] Done & reviewed
