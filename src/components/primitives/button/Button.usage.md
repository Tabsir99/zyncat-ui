# Button - @zyncat/ui/button

Group: primitives
Docs: https://ui.zyncat.app/button

One control for every click; exactly one primary per view.

variant primary|secondary|ghost|danger|link, size sm|md|lg|icon, loading, disabled. Icons are plain
children - Button lays them out in a centered row with gap, no iconLeft/iconRight slots.

```tsx
<Button variant="primary"><Icon name="plus" size="sm" />Schedule post</Button>
<Button size="icon" aria-label="Close"><Icon name="x" size="sm" /></Button>
```
