# Lens - @zyncat/ui/lens

Group: expressive
Docs: https://ui.zyncat.app/lens

An optical loupe that magnifies whatever you wrap.

It renders a second live copy of the children, scaled about the pointer and clipped to a disc, so
magnified text is re-rasterised vector type rather than an upscaled bitmap. A MutationObserver
re-clones, so edits stay live. magnification 1.2-6, radius 60-260 px, chromatic toggles the
speed-reactive rim fringing. The glass tracks the pointer with no lag; speed drives the specular
sweep and the shadow. Arrow keys move the glass when the stage has focus, Escape dismisses it. Your
children stay in the accessibility tree - only the magnified copy is aria-hidden. Retune through
--lens-* on the stage: ink, surface, edge, highlight, fringe-warm, fringe-cool.

```tsx
<Lens magnification={2.6} radius={132}>
  <TypeSpecimen />
</Lens>
```
