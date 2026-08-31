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

## Task 2 — Tabs active indicator spacing (IN PROGRESS)

Brief: reduce the spacing between the tab items and the active indicator (ink) — should be
about `--space-px`, not the current visible gap.

- [ ] Done & reviewed

## Task 3 — pointerdown activation for responsiveness

Brief: components with a click action should switch to pointerdown to feel super responsive.
Do NOT apply it to buttons directly — only internal things where the library controls the
trigger. It must be overridable. Open question to handle: when a consumer passes their own
trigger element, how does their choice of pointer vs click interact with ours — make sure
that works rather than assuming it does.

- [ ] Audit which components own their trigger (dropdown, select, tabs, date fields, …)
- [ ] pointerdown as the default activation there, overridable per component
- [ ] Consumer-passed triggers keep working with either scheme
- [ ] Done & reviewed

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
