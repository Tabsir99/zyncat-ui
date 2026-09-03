# motion-tokens - @zyncat/ui/motion-tokens

Group: dev

TypeScript readers for the motion token vocabulary - duration/ease/distance/scale token names resolved to the live CSS values.

Use it to time your own animation code off the same tokens the components read, so your motion
retimes with the theme and collapses under reduced motion exactly like the library's. UIMotion
carries dur/ease/dist/scale maps, ready-made enter/exit/layout/settle/glide transitions on `t`, and
`reduced`, which reflects prefers-reduced-motion. It re-reads in place when `data-theme` changes on any
element, when prefers-reduced-motion flips and after `ZyncatTheme` renders, so read it at call time rather
than into a module constant; `refreshMotionTokens()` re-reads it after a stylesheet of your own retimes the `--duration-*`
tokens.

```tsx
import { UIMotion } from '@zyncat/ui/motion-tokens';

const settle = { duration: UIMotion.dur.base, ease: UIMotion.ease.standard };
```
