# Tabs / TabPanel - @zyncat/ui/tabs

Group: date-time
Docs: https://ui.zyncat.app/tabs

Line tabs; the ink reaches then releases; panels enter from the side you moved toward.

items: TabItem[]; value/onChange(value, dir). Pair with <TabPanel name tab dir>.

```tsx
<Tabs name="views" ariaLabel="Workspace views" value={view} onChange={(v, d) => { setView(v); setDir(d); }} items={items} />
<TabPanel name="views" tab={view} dir={dir}>...</TabPanel>
```
