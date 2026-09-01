# Glide / GlidePill - @zyncat/ui/glide

Group: primitives

A persistent background pill that glides smoothly between hovered/active elements.

Container must be `position: relative`.

```tsx
const glide = useGlide(containerRef); // { ref, enter, leave } - pass the whole thing to GlidePill
<nav ref={containerRef} onPointerLeave={glide.leave}>
  <GlidePill glide={glide} className="my-pill" />
  <button onPointerEnter={(e) => glide.enter(e.currentTarget)}>Item 1</button>
</nav>;
```
