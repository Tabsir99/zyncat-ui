# Theme - @zyncat/ui/theme

Group: dev

Typed theming - defineTheme groups every token with autocomplete and hover docs; ZyncatTheme renders the themes as unlayered CSS above the library layers, with no build step.

Tokens are grouped the way they are organised - `color`, `type`, `space`, `radius`, `elevation`,
`motion`, `glass`, `icon`, `layer`, `avatar` - plus `components`, where each expressive or compound
component's scoped knobs sit under its own name with the prefix dropped
(`components.odometer.accent` is `--odometer-accent`). Keys are the token in camelCase, values take
any CSS including `var()` references, a typo is a type error, and `custom` takes any other property
written out in full. `theme` is the whole set: `base` lands on `:root` and every other key becomes
`[data-theme='<key>']`, activated by setting that attribute on `<html>` or any subtree root - no
re-render, and duration overrides re-collapse under prefers-reduced-motion. Each component's own
`style` prop types its own knobs and no other component's; the design tokens are typed on every
`style` prop.

```tsx
import { defineTheme, ZyncatTheme } from '@zyncat/ui/theme';

const base = defineTheme({
  color: { accent: 'oklch(0.58 0.19 292)', accentHover: 'oklch(0.52 0.19 292)' },
  radius: { radiusMd: '0.5rem' },
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
