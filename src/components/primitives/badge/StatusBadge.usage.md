# StatusBadge - @zyncat/ui/status-badge

Group: primitives
Docs: https://ui.zyncat.app/status-badge

Canonical post status - tone + one-word label.

status draft|scheduled|processing|published|failed; add `morph` to animate in place as status
changes.

```tsx
<StatusBadge status="published" />
<StatusBadge status={s} morph />
```
