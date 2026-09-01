# Dialog - @zyncat/ui/dialog

Group: overlays
Docs: https://ui.zyncat.app/dialog

DEFAULT CHOICE for modals - the styled surface: header (icon/title/description/close), scrolling body, footer actions, on top of scrim + focus trap + scroll lock.

Reach for Modal only if this chrome is wrong. open/onOpenChange, tone, icon, title, description,
footer: (close) => node. Header is omitted entirely when there is no icon/title/description and
dismissible={false}. container mounts it inside a positioned element instead of the viewport; scrim,
scroll lock and inert then scope to that box and the rest of the page stays live.

```tsx
<Dialog open={o} onOpenChange={setO} tone="danger" title="Delete this project?" footer={(close) => <>...</>}>
  ...
</Dialog>
```
