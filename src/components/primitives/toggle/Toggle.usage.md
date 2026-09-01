# Toggle - @zyncat/ui/toggle

Group: forms
Docs: https://ui.zyncat.app/toggle

Actuates a setting on the spot - pick Checkbox when the form commits the choice later.

label, description; checked/onChange like a checkbox.

```tsx
<Toggle label="Auto-save drafts" checked={on} onChange={(e) => set(e.target.checked)} />
```
