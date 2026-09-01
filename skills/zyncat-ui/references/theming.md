# Theming @zyncat/ui - the four override levels

Load your own stylesheet after `@zyncat/ui/styles.css`, then reach for the LOWEST level that does
the job. Never fork the source. The `get_tokens` MCP tool prints the whole vocabulary with real
values.

## Level 0 - your plain CSS already wins

Every shipped rule lives inside `@layer zyncat.tokens` or `@layer zyncat.components`, and unlayered
CSS beats every layer however specific the layered rule is. `.btn { border-radius: 0 }` in your
sheet lands: no `!important`, no specificity ladder, no parent selector. Even `:where(.btn)` at
specificity (0,0,0) wins. Class names are BEM off a short base - `.btn`, `.btn--primary`,
`.btn__label`; `.fld`, `.fld__input`; `.dialog__body`.

## Level 1 - retheme the whole system

Repoint the semantic tokens on `:root`: `--accent` and its ramp, `--bg-*`, `--text-*`,
`--border-*`, `--radius-*`, `--shadow-*`, `--space-*`, `--size-*`, `--type-*`, `--duration-*`,
`--ease-*`, `--focus-ring`. Components read them live and the WAAPI engine reads the same DOM
values, so motion retimes with the CSS. Reduced motion is already handled here - every
`--duration-*` collapses to 1ms under `prefers-reduced-motion`, so derive your own delays from a
duration token.

## Level 2 - retune one component

Expressive and compound components publish scoped `--<component>-<name>` properties as their public
contract: `--odometer-size/-accent/-gap`, `--typing-lines-caret-ink/-blink`,
`--lens-surface/-fringe-warm`, `--morphing-text-size/-smear`, `--weight-field-reach/-peak-weight`,
`--flow-field-ramp-0..11`, `--confetti-paper-1..5`, `--support-fan-*`, `--support-rail-*`. Set them
on any ancestor or inline via `style`. The canvas simulations sample theirs at their next measure -
WeightField and FlowField on resize, FlowField also on a theme attribute change, Confetti on the
next `fire()`.

A few are per-frame state the component writes to itself, not knobs -
`--odometer-velocity/-blur`, `--lens-lift/-blur/-shadow-alpha`, `--morphing-text-heat/-letter-blur`,
`--weight-field-pull/-wght`, `--support-fan-x/-y`, `--support-rail-drag`, `--youtube-progress`.
Setting those does nothing.

System primitives and composites publish none by design - retheme those at level 1.

## Level 3 - restyle one instance

Primitives and fields take `className` and `style` directly; on a field they land on the wrapper,
and `htmlProps` reaches the native `<input>`. Overlays (Dialog, Modal, Sheet, Popover, Tooltip,
Dropdown) have no `className` prop - pass `htmlProps={{ className }}` and it lands on the panel
itself.

## Replicas answer to none of this, on purpose

FacebookFeed, InstagramFeed, TikTok and YouTube pin platform metrics as constants; only
`--font-sans`, `--focus-ring` and the duration tokens reach them, and there are no scoped
properties to set. Fidelity is the contract. If you want a card that follows your theme, build one
from primitives instead.
