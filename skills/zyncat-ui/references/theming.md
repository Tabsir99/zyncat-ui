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

Eight values are decisions and everything else derives from them: `--accent`, `--success`,
`--warning`, `--danger`, `--neutral` (the gray ramp's hue, the accent by default, read on `:root` only), `--radius`,
`--font-body`, `--font-code`. `zyncat-ui init` writes them at their defaults into `zyncat.theme.css`
beside the app entry, imported right after `@zyncat/ui/styles.css`; a retheme is editing a value
there. VS Code's built-in CSS completion only sees variables declared in the file being edited; a
workspace-indexing extension such as CSS Variable Autocomplete picks this file up. Setting
`--accent` moves `--accent-hover/-active/-lift/-subtle/-border/-disabled/-wash`, `--text-accent`,
`--ring-accent`, `--focus-ring` and `--info`; `--success`, `--warning` and `--danger` each carry their
own `-subtle`, `-text` and `-wash`; the `--radius-*` steps are fixed ratios of `--radius`, so
`--radius: 0` squares every corner (`--radius-full` is a shape and stays put); the `--type-*` bundles
follow the faces. Set a derived token only to break it away from its decision.

Dark ships in the package. `data-theme="dark"` on `<html>` turns the page - the base layer paints
`body` in `--bg-app`, `--text-body` and `--type-body`, so there is no wrapper to add - and on any
element it turns that subtree, where `data-theme="light"` makes a light island. The dark theme sets
the neutral roles (`--bg-*`, `--text-*`, `--border-*`), the shadow ink, `--shadow-strength` (how much
shadow the surfaces cast), `--sheen-strength` (how bright the white top-light highlights render) and
`--glow-strength` (how much light a hovered hue fill casts on the canvas around it), drops the filled
faces (`--accent-fill`, `--danger-fill`) a step, and re-derives the hue steps whose light values pin a
lightness near white; the decisions cascade in, so the accent a project sets is the dark theme's
accent too. Extend it in the same block -
`[data-theme='dark'] { --accent: oklch(0.72 0.14 292); --shadow-strength: 2.5; }` - and whatever is
left out keeps the shipped dark value. The derived tokens are declared on every theme root (`:root`
and any element with `data-theme`), so a subtree theme that repoints `--accent` re-derives all of
them; the neutral roles cascade like any property, so a theme of your own that sets `--bg-app` and
`--text-body` keeps them without restating the rest.
Components read the tokens live and the WAAPI engine reads the same DOM values, so motion retimes
with the CSS. Reduced motion is handled here - every `--duration-*` collapses to 1ms under
`prefers-reduced-motion`, so derive your own delays from a duration token, and repoint durations on
`:root` rather than a nested scope or the collapse cannot reach them.

`@zyncat/ui/theme` is the same level with a type on it, for a theme that is data - several named
themes, or values computed at build time. `defineTheme` takes one object shaped like a theme: four
categories - `color` (the five hues, then `bg`, `text` and `border`), `type.font` (`body`, `code`),
`shape.radius`, `motion` (`duration`, `ease`, `distance`, `scale`) - then `components` for the scoped
knobs and `custom` for any other token by its CSS name - a ramp stop, a size, a spacing step, a
derived hover - or a property of your own. The path is the CSS name: `color.bg.app` is `--bg-app`,
`type.font.body` is `--font-body`, `motion.duration.base` is `--duration-base`. Values are any CSS
including `var()` references, every level completes with its default on hover, and a typo is a
compile error. `ZyncatTheme` renders the set once at the app root; it is a plain component with no
hooks, so it server-renders and needs no build configuration. Keep one writer per decision: a project
on `defineTheme` drops those lines from `zyncat.theme.css`.

```tsx
import { defineTheme, ZyncatTheme } from '@zyncat/ui/theme';

const base = defineTheme({
  color: { accent: 'oklch(0.58 0.19 292)' },
  shape: { radius: '0.75rem' },
  components: { odometer: { accent: 'var(--warning)' } },
});
const dark = defineTheme({ color: { accent: 'oklch(0.72 0.14 292)' }, custom: { '--shadow-strength': 2.5 } });

<ZyncatTheme theme={{ base, dark }} />;
```

`base` lands on `:root`; every other key is a `[data-theme='<key>']` block, so `dark` and `light`
extend the shipped polarities rather than starting them. Durations you repoint keep their
reduced-motion collapse automatically.

The vocabulary a page reads is the roles, never the plumbing:
`--bg-app/-surface/-surface-raised/-subtle/-muted/-inset/-overlay`,
`--text-strong/-body/-secondary/-muted/-subtle/-disabled/-accent/-on-accent/-inverse`,
`--border-subtle/-default/-strong`, the four status hues and `--info` with `-subtle` and `-text`, the
`--type-*` bundles (one `font:` shorthand per role), `--space-px` and `--space-1..10` (a 4px grid),
`--radius-sm..2xl/-full`, `--shadow-xs..xl`, `--focus-ring`, `--duration-*`, `--ease-*`,
`--transition-control/-colors/-opacity`. `get_tokens` prints all of it with real values.

## Level 2 - retune one component

Expressive and compound components publish scoped `--<component>-<name>` properties as their public
contract, each with a doc line: `--odometer-size/-accent/-gap`, `--typing-lines-caret-ink/-blink`,
`--lens-surface/-fringe-warm`, `--morphing-text-size/-smear`, `--weight-field-peak-weight/-hover-padding`,
`--flow-field-ramp-0..11`, `--confetti-paper-1..5`, `--support-rail-width/-accent/-row-pad-block`. Set
them on any ancestor or inline via `style`. The canvas simulations sample theirs at their next measure -
FlowField on resize and on a theme attribute change, Confetti on the next `fire()`.

Both reaches are typed. In a theme they are `components`, grouped like the theme:
`components.odometer.accent` is `--odometer-accent`, `components.typingLines.caret.ink` is
`--typing-lines-caret-ink`, `components.confetti.paper[3]` is `--confetti-paper-3`. On one instance
they are the component's own `style` prop, which accepts the design tokens plus that component's knobs
and nothing from another component - `<Odometer style={{ '--odometer-size': '3rem' }} />`.

Everything else a component declares - its constants, its derivations, the per-frame state it writes
to itself - is a private `--_<component>-*` property: not a contract, and absent from the types, so
setting one is a compile error.

System primitives and composites publish none by design - retheme those at level 1.

## Level 3 - restyle one instance

Primitives and fields take `className` and `style` directly; on a field they land on the wrapper,
and `htmlProps` reaches the native `<input>`. Overlays (Dialog, Modal, Sheet, Popover, Tooltip,
Dropdown) have no `className` prop - pass `htmlProps={{ className }}` and it lands on the panel
itself. Importing `@zyncat/ui/theme` anywhere in the app types every design token in `style`, so
`style={{ '--accent': 'red' }}` completes and checks like any other property.

## Replicas answer to none of this, on purpose

FacebookFeed, InstagramFeed, TikTok and YouTube pin platform metrics as constants; only
`--font-body`, `--focus-ring` and the duration tokens reach them, and there are no scoped
properties to set. Fidelity is the contract. If you want a card that follows your theme, build one
from primitives instead.
