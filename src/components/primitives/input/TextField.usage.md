# TextField - @zyncat/ui/text-field

Group: forms
Docs: https://ui.zyncat.app/text-field

Base text input; states disclose via Collapse.

leadingIcon, clearable, optional/required.

```tsx
<TextField id="ws" label="Workspace name" required value={v} onChange={(e) => set(e.target.value)} />
<TextField id="h" label="Username" error="Must be at least 4 characters." value={v} onChange={...} />
```
