# Confetti - @zyncat/ui/confetti

Group: expressive
Docs: https://ui.zyncat.app/confetti

A canvas particle burst you fire yourself: paper flakes, curls, ribbons and foil sequins tumbling on real drag, lift and flip, across three depth layers.

Fire it from the ref handle - ref.current.fire({count, duration, emitter}) - bursts coexist, never
cancel. emitter sides|top|corners is the launch geometry; count is pieces per fire (cap 520, the
oldest piece retires past it); duration is the seconds the emitter stays open, 0.15 for one shove
and 2.5 for a taper; speed is sampled live; field container|viewport picks what the canvas covers.
Retune through --confetti-* on the canvas: paper-1..5, weights, ink, light, shade, gloss, layer.
Purely decorative - aria-hidden, pointer-events none, never focusable, no live region: announce the
success yourself. Reduced motion renders nothing and fire() is a no-op.

```tsx
<Confetti ref={confetti} count={170} />
```
