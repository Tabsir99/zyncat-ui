# WeightField - @zyncat/ui/weight-field

Group: expressive
Docs: https://ui.zyncat.app/weight-field

A display headline where cursor proximity drives each glyph's variable-font wght axis through a damped spring - letters swell toward the pointer and overshoot back to rest.

The weight is real font-variation-settings, carried by a lift, optical tracking and an accent tint,
so the field still reads when the resolved face turns out not to be variable. text is the headline;
speed is sampled live every frame. Under 48 glyphs each glyph springs on its own; past that the
split falls back to one spring per word. Retune through --weight-field-* on the root: ink, accent,
size, leading, align, pad, reach, rest-weight, peak-weight, lift, tracking, tint. The headline is
exposed to screen readers, the glyph layer is aria-hidden; reduced motion renders it at rest weight
and wires no pointer.

```tsx
<WeightField text="Kinetic" speed={1.2} />
```
