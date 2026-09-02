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

Reach for `@zyncat/ui/theme` first: it is this level with types on it. `defineTheme` takes one
grouped object - `color`, `type`, `space`, `radius`, `elevation`, `motion`, `glass`, `icon`,
`layer`, `avatar`, plus `components` for scoped knobs and `custom` for anything else. Keys are the
token in camelCase (`accent`, `radiusMd`, `durationBase`), values are any CSS including `var()`
references, and a typo is a compile error. `ZyncatTheme` renders the set once at the app root; it
is a plain component with no hooks, so it server-renders and needs no build configuration.

```tsx
import { defineTheme, ZyncatTheme } from '@zyncat/ui/theme';

const base = defineTheme({
  color: { accent: 'oklch(0.58 0.19 292)', accentHover: 'oklch(0.5 0.19 292)' },
  radius: { radiusMd: '0.5rem' },
  components: { odometer: { accent: 'var(--warning)' } },
});
const dark = defineTheme({ color: { bgApp: 'oklch(0.19 0.008 198)', textBody: 'oklch(0.92 0.004 198)' } });

<ZyncatTheme theme={{ base, dark }} />;
```

`base` lands on `:root`; every other key is a `[data-theme='<key>']` block, so switching themes -
globally or for one subtree - is setting that attribute. Durations you repoint keep their
reduced-motion collapse automatically.

The same tokens are writable as plain CSS: repoint them on `:root` in your own stylesheet -
`--accent` and its ramp, `--bg-*`, `--text-*`, `--border-*`, `--radius-*`, `--shadow-*`,
`--space-*`, `--size-*`, `--type-*`, `--duration-*`, `--ease-*`, `--focus-ring`. Components read
them live and the WAAPI engine reads the same DOM values, so motion retimes with the CSS. Reduced
motion is handled here - every `--duration-*` collapses to 1ms under `prefers-reduced-motion`, so
derive your own delays from a duration token, and repoint durations on `:root` rather than a
nested scope or the collapse cannot reach them.

## Level 2 - retune one component

Expressive and compound components publish scoped `--<component>-<name>` properties as their public
contract: `--odometer-size/-accent/-gap`, `--typing-lines-caret-ink/-blink`,
`--lens-surface/-fringe-warm`, `--morphing-text-size/-smear`, `--weight-field-peak-weight/-hover-padding`,
`--flow-field-ramp-0..11`, `--confetti-paper-1..5`, `--support-rail-*`. Set them
on any ancestor or inline via `style`. The canvas simulations sample theirs at their next measure -
FlowField on resize and on a theme attribute change, Confetti on the next `fire()`.

Both reaches are typed. In a theme they are the `components` group with the prefix dropped:
`components.odometer.accent` is `--odometer-accent`. On one instance they are the component's own
`style` prop, which accepts the design tokens plus that component's knobs and nothing from another
component - `<Odometer style={{ '--odometer-size': '3rem' }} />`.

A few are per-frame state the component writes to itself, not knobs -
`--odometer-velocity/-blur`, `--lens-lift/-blur/-shadow-alpha`, `--morphing-text-heat/-letter-blur`,
`--support-rail-drag`, `--youtube-progress`.
Setting those does nothing, and they are absent from the types, so trying is a compile error.

System primitives and composites publish none by design - retheme those at level 1.

## Level 3 - restyle one instance

Primitives and fields take `className` and `style` directly; on a field they land on the wrapper,
and `htmlProps` reaches the native `<input>`. Overlays (Dialog, Modal, Sheet, Popover, Tooltip,
Dropdown) have no `className` prop - pass `htmlProps={{ className }}` and it lands on the panel
itself. Importing `@zyncat/ui/theme` anywhere in the app types every design token in `style`, so
`style={{ '--accent': 'red' }}` completes and checks like any other property.

## Replicas answer to none of this, on purpose

FacebookFeed, InstagramFeed, TikTok and YouTube pin platform metrics as constants; only
`--font-sans`, `--focus-ring` and the duration tokens reach them, and there are no scoped
properties to set. Fidelity is the contract. If you want a card that follows your theme, build one
from primitives instead.
