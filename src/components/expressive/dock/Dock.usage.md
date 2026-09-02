# Dock - @zyncat/ui/dock

Group: expressive
Docs: https://ui.zyncat.app/dock

A macOS-style magnifying rail: the tile nearest the pointer springs open and pushes its neighbours along the axis.

Dock is the rail, DockItem is one tile; anything else you nest renders untouched and never magnifies.
size is the resting tile box in pixels, magnification the box directly under the pointer, and distance
how far along the axis the swell reaches - past it nothing moves. orientation picks the axis the rail
runs along and the pointer coordinate it reads, align the cross-axis placement. A tile's box is what
springs, so a child sized 100% grows with it and a fixed-size icon stays put while the gaps open around
it. The rail itself is pinned to size plus its padding and never grows, so the tiles swell out of a
box that holds still - set --dock-rail-size to auto if your tiles are not square. disableMagnification
holds every tile at size and keeps the rail. Retune through --dock-* on the root: surface, line, radius,
shadow, backdrop, gap, pad, rail-size, item radius and item padding. Under reduced motion no pointer is
wired and every tile sits at size.

```tsx
<Dock htmlProps={{ role: 'toolbar', 'aria-label': 'Apps' }}>
  <DockItem>
    <HomeIcon />
  </DockItem>
</Dock>
```
