# RadioGroup - @zyncat/ui/radio-group

Group: forms
Docs: https://ui.zyncat.app/radio-group

Pick exactly one from options that stay visible - rows or cards; pick Select for long lists.

options: RadioOption[] ({ value, label, description?, icon?, disabled? }); variant rows|cards,
orientation; value/onChange(value).

```tsx
<RadioGroup name="role" label="Member role" value={role} onChange={setRole} options={ROLES} />
```
