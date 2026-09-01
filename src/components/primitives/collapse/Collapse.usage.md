# Collapse - @zyncat/ui/collapse

Group: primitives
Docs: https://ui.zyncat.app/collapse

Layout-transition primitive; eases height open/closed, never teleports.

Closed content also leaves the tab order, accessibility tree and hit-testing once the exit
completes; reopening is focusable immediately. animation takes motion tokens ONLY - { duration, ease
}, each one token (fast|base|slow|slower|slowest / standard|entrance|exit|spring|glide) or
per-direction { open, close }.

```tsx
<Collapse open={open} animation={{ duration: { close: 'fast' }, ease: { close: 'exit' } }}>
  <div>...revealed content...</div>
</Collapse>
```
