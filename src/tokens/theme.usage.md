# Theme - @zyncat/ui/theme

Group: dev

Typed theming - defineTheme is the shape of a theme, not a list of every token; ZyncatTheme renders the set as unlayered CSS with no build step.

The type is the shape of a theme, not a list of every token. Four categories: `color` holds the five
hue decisions (`accent`, `neutral`, `success`, `warning`, `danger`) and the neutral roles a dark theme
sets, grouped as `bg`, `text` and `border`; `type.font` holds the `body` and `code` faces; `shape`
holds `radius`; `motion` holds `duration`, `ease`, `distance` and `scale`. The path is the CSS name -
`color.bg.app` is `--bg-app` - and everything derives from the decisions, so a retheme is usually one
or two keys. `components` holds each expressive or compound component's public knobs, grouped the
same way (`components.typingLines.caret.ink` is `--typing-lines-caret-ink`). Every other token - a
ramp stop, a spacing step, a derived hover - goes under `custom` by its CSS name; every name
completes with its default on hover, a typo is a type error, and values take any CSS. `theme` is the
whole set: `base` lands on `:root` and every other key becomes `[data-theme='<key>']`, activated by
setting that attribute on `<html>` or any subtree root - no re-render, and duration overrides
re-collapse under prefers-reduced-motion. This is the route for a theme that is data; the default is
the `zyncat.theme.css` file `init` writes, and a project keeps one writer per decision. Each
component's own `style` prop types its knobs and no other component's; the design tokens are typed on
every `style` prop.

```tsx
import { defineTheme, ZyncatTheme } from '@zyncat/ui/theme';

const base = defineTheme({
  color: { accent: 'oklch(0.58 0.19 292)' },
  shape: { radius: '0.75rem' },
  components: { odometer: { accent: 'var(--warning)' } },
});
const dark = defineTheme({
  color: { bg: { app: 'oklch(0.19 0.008 198)' }, text: { body: 'oklch(0.92 0.004 198)' } },
  custom: { '--shadow-rgb': '0 0 0' },
});

export function AppRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ZyncatTheme theme={{ base, dark }} />
      {children}
    </>
  );
}
```
