# Textarea - @zyncat/ui/textarea

Group: forms
Docs: https://ui.zyncat.app/textarea

Auto-grow, char meter (max), ⌘/Ctrl+↵ submit (onSubmit).

minRows/maxRows.

```tsx
<Textarea id="bio" label="Bio" max={280} minRows={4} value={v} onChange={(e) => set(e.target.value)} onSubmit={save} />
```
