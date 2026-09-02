# WeightField - @zyncat/ui/weight-field

Group: expressive
Docs: https://ui.zyncat.app/weight-field

A display headline where hovering one letter ramps its variable-font wght to the peak and its two neighbours either side part-way, so weight spills outward from the cursor.

Every character is its own hover unit, spaces included, and the ramp reads purely from CSS sibling
state - no pointer listener, no per-frame work. The hovered letter takes the peak weight, a doubled text
stroke and a sliver of padding either side; its immediate neighbours take the near weight and the same
padding; the two beyond them take the far weight only. text is the headline; speed multiplies the ramp
rate. Retune through --weight-field-* on the root: ink, size, leading, align, pad, tracking, rest-weight,
far-weight, near-weight, peak-weight, hover-padding, stroke, stroke-peak, duration, ease. Flatten
near-weight and far-weight onto rest-weight and only the hovered letter answers. Needs a variable face to
glide rather than step. The headline is exposed to screen readers, every glyph is aria-hidden; reduced
motion collapses the ramp to a cut.

```tsx
<WeightField text="Nostalgia" speed={1.2} />
```
