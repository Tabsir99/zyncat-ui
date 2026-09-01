# Table - @zyncat/ui/table

Group: data-display
Docs: https://ui.zyncat.app/table

Declare columns + rows; owns sort, selection, stickiness, overflow.

columns: TableColumn<T>[] ({ key, label, render?, sortable?, sortBy?, align?, mono?, strong?, grow?
}); selectable, defaultSort, footer.

```tsx
<Table<Invoice>
  ariaLabel="Invoices"
  columns={COLUMNS}
  rows={INVOICES}
  selectable
  defaultSort={{ key: 'amount', dir: 'desc' }}
/>
```
