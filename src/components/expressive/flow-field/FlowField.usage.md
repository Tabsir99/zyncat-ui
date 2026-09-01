# FlowField - @zyncat/ui/flow-field

Group: expressive
Docs: https://ui.zyncat.app/flow-field

A canvas field of needles that breathe on a noise loop, then swing away from the pointer with per-cell lag - a decorative backdrop for a hero or a card.

Children render above it. speed is sampled live every frame; spacing 12-72 px sets needle density
and widens on its own so the field never draws more than 1600 needles; radius 40-640 px is the
pointer's reach. Retune through --flow-field-* on the root: ink, accent, min-height, and ramp-0 to
ramp-11, the twelve oklab stops the needles are drawn from. The canvas is aria-hidden and adds no
tab stop; your children keep their own semantics. Reduced motion paints one static frame of the
settled field and never starts the loop.

```tsx
<FlowField spacing={26} radius={210}>
  <Hero />
</FlowField>
```
