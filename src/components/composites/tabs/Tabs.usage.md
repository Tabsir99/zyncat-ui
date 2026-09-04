# Tabs / TabPanel - @zyncat/ui/tabs

Group: date-time
Docs: https://ui.zyncat.app/tabs

Underline tabs or a segmented pill; the ink reaches then releases; panels enter from the side you moved toward.

items: TabItem[]; value/onChange(value, dir). variant underline|pill - the pill track hugs its tabs rather than
filling the row, and drops the hairline; the motion is identical in both. Pair with <TabPanel name tab dir>.

```tsx
<Tabs name="views" ariaLabel="Workspace views" value={view} onChange={(v, d) => { setView(v); setDir(d); }} items={items} />
<TabPanel name="views" tab={view} dir={dir}>...</TabPanel>
```
