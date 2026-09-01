# MultiSelect - @zyncat/ui/multi-select

Group: forms
Docs: https://ui.zyncat.app/multi-select

Many-of listbox; stays open while toggling, trigger summarises as first +N.

value: string[], onChange(string[]); searchable.

```tsx
<MultiSelect options={PEOPLE} value={ids} onChange={setIds} placeholder="Choose members" ariaLabel="Members" />
```
