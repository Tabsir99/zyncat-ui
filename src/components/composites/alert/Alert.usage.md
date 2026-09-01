# Alert - @zyncat/ui/alert

Group: overlays
Docs: https://ui.zyncat.app/alert

Persistent, in-flow status.

tone, title, children (body), action { label, onClick }, dismissible, banner, open/onDismiss
(controlled).

```tsx
<Alert tone="warning" title="Your trial ends in 5 days" action={{ label: 'Upgrade', onClick: fn }}>
  Add a plan...
</Alert>
```
