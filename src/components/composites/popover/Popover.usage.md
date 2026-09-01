# Popover - @zyncat/ui/popover

Group: overlays
Docs: https://ui.zyncat.app/popover

Headless anchored panel, non-modal.

side, align, arrow, trigger (node), dismissible. Anchor without a trigger: pass anchor - anything
with getBoundingClientRect (a DOMRect source, an element) - and drive open yourself. Pass a new
object to re-place a moving anchor.

```tsx
<Popover side="bottom" align="start" trigger={<Button>Actions</Button>}><menu>...</menu></Popover>
<Popover open={!!spot} onOpenChange={dismiss} anchor={spot} side="right"><menu>...</menu></Popover>
```
