# Tooltip - @zyncat/ui/tooltip

Group: overlays
Docs: https://ui.zyncat.app/tooltip

Transient hint on hover/focus; wraps any child (no ref wiring needed).

content, shortcut, placement top|bottom|left|right; open/defaultOpen/onOpenChange to drive it yourself, for a
hint no hover would ever fire. With open set, hover, focus and Escape decide nothing on their own - they only
report through onOpenChange, so a parent that ignores it keeps the bubble up. Scrolling never closes it: the
bubble tracks its anchor through page and container scroll, and leaves on pointer out, blur, or a handled Escape.
It also leaves the moment a surface around it starts animating out, so a tooltip inside a closing Popover or
Modal goes with it rather than outliving the panel.

```tsx
<Tooltip content="Save changes" shortcut="⌘S">
  <Button>Save</Button>
</Tooltip>
<Tooltip content="Drafts land here" open={tour === 'drafts'} onOpenChange={(next) => !next && nextStep()}>
  <Button variant="ghost">Drafts</Button>
</Tooltip>
```
