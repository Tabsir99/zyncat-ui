# Sheet - @zyncat/ui/sheet

Group: overlays
Docs: https://ui.zyncat.app/sheet

Edge-docked modal panel, drag-to-dismiss.

side right|bottom, trigger (node), dismissible. container docks it inside a positioned element
instead of the viewport; scrim, scroll lock and inert then scope to that box and the rest of the
page stays live.

```tsx
<Sheet side="right" trigger={<Button>Filters</Button>}><div role="dialog">...</div></Sheet>
<Sheet side="bottom" container={panel} open={o} onOpenChange={setO}><div role="dialog">...</div></Sheet>
```
