# Select - @zyncat/ui/select

Group: forms
Docs: https://ui.zyncat.app/select

Single-select listbox in a popover, searchable; holds value: string | null.

options: SelectOption[]; value: string|null, onChange(value); searchable, leadingIcon, placeholder,
invalid, loading, ariaLabel. highlight neutral|accent picks the hue of the highlight travelling
between options; rail adds a short accent bar on its leading edge.

```tsx
<Select
  options={TIMEZONES}
  value={tz}
  onChange={setTz}
  searchable
  placeholder="Choose a time zone"
  ariaLabel="Time zone"
/>
```
