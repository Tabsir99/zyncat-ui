/** Names of the UI-transition duration scale (`--duration-*`):
 *  - `fast` 140ms - micro feedback: hover washes, presses, control tint/border/shadow.
 *  - `base` 200ms - standard element transitions: fades, toggles, badge morphs.
 *  - `slow` 300ms - layout-scale movement: Collapse, panel resizes, reordering.
 *  - `slower` 450ms - large-surface movement: dialogs, sheets, page-scale reveals.
 *  - `slowest` 900ms - hero-scale movement: card expansion, container transforms. The scale's
 *    ceiling: anything longer is choreography and belongs to Motion, not a transition token. */
export type DurationToken = 'fast' | 'base' | 'slow' | 'slower' | 'slowest';

/** Names of the brand easing curves (`--ease-*`):
 *  - `standard` cubic-bezier(0.2, 0, 0, 1) - brisk start, soft landing; the default for state changes.
 *  - `entrance` cubic-bezier(0.16, 1, 0.3, 1) - hard deceleration; content arriving on screen.
 *  - `exit` cubic-bezier(0.4, 0, 1, 1) - accelerates away; content leaving (pair with a faster duration).
 *  - `spring` cubic-bezier(0.34, 1.4, 0.5, 1) - overshoots then settles; playful confirmations.
 *  - `glide` cubic-bezier(0.55, 0, 0.15, 1) - symmetric in-out travel; a persistent element moving
 *    between positions, never enter/exit. */
export type EaseToken = 'standard' | 'entrance' | 'exit' | 'spring' | 'glide';

export type DistanceToken = 'sm' | 'md' | 'lg';

export type ScaleToken = 'panel' | 'floating' | 'chip';
