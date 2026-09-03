# Theme - @zyncat/ui/theme

Group: dev

Typed theming - defineTheme takes the decisions at the top level and every other token in a typed group; ZyncatTheme renders the set as unlayered CSS with no build step.

The eight decisions sit at the top level - `accent`, `success`, `warning`, `danger`, `neutral`,
`radius`, `fontSans`, `fontMono` - and everything else derives from them, so a retheme is usually one
or two of those keys. The rest of the vocabulary is grouped the way it is organised - `color`, `type`,
`space`, `radii`, `elevation`, `motion`, `glass`, `icon`, `layer`, `avatar` - plus `components`, where
each expressive or compound component's scoped knobs sit under its own name with the prefix dropped
(`components.odometer.accent` is `--odometer-accent`). Keys are the token in camelCase, values take
any CSS including `var()` references, a typo is a type error, and `custom` takes any other property
written out in full. `theme` is the whole set: `base` lands on `:root` and every other key becomes
`[data-theme='<key>']`, activated by setting that attribute on `<html>` or any subtree root - no
re-render, and duration overrides re-collapse under prefers-reduced-motion. This is the route for a
theme that is data; the default route is the `zyncat.theme.css` file `init` writes, and a project
keeps one writer per decision. Each component's own `style` prop types its own knobs and no other
component's; the design tokens are typed on every `style` prop.

```tsx
import { defineTheme, ZyncatTheme } from '@zyncat/ui/theme';

const base = defineTheme({
  accent: 'oklch(0.58 0.19 292)',
  radius: '0.75rem',
  components: { odometer: { accent: 'var(--warning)' } },
});
const dark = defineTheme({ color: { bgApp: 'oklch(0.19 0.008 198)', textBody: 'oklch(0.92 0.004 198)' } });

export function AppRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ZyncatTheme theme={{ base, dark }} />
      {children}
    </>
  );
}
```
