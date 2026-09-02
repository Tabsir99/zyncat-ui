import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'Sortable, Selectable React Data Table',
  description:
    'A React data table with sortable columns, row selection and a sticky header. Semantic <table> markup, container-query responsive columns, zero dependencies.',
  keywords: [
    'data table',
    'react table',
    'responsive table',
    'sorting table',
    'react table library',
    'table responsive',
    'react tables',
    'react data table',
    'data table ui',
    'react table component',
    'react datatable',
    'table in react',
    'best react table library',
    'table component',
    'sortable table',
  ],
  lede: 'A React data table with sorting, row selection and a sticky header - for admin panels and record lists.',
  faq: [
    {
      q: 'How do I make a table sortable in React?',
      a: 'Set sortable: true on a column - clicking its header (or activateOn="click" instead of the pointerdown default) cycles asc to desc, sorting a copy of rows locally with a numeric-aware compare. Pass defaultSort={{ key, dir }} to start pre-sorted, or read onSortChange to sync the active sort elsewhere; rows re-flow with a FLIP animation, not a jump cut.',
    },
    {
      q: 'How do I add row selection or checkboxes to a table?',
      a: 'Set selectable - it adds a checkbox column plus a bulk-action bar that slides in from the header once anything is checked. Selection is a Set reported through onSelectionChange, shift-click extends the range across rows, and bulkActions(keys, clear) renders your own buttons next to the built-in Clear.',
    },
    {
      q: 'How do I make a table responsive without breaking the layout?',
      a: 'Two mechanisms, no viewport media queries: hideBelow="sm" or "md" drops a column once the table\'s own container - not the window - crosses a 30rem or 42rem @container breakpoint, and whatever\'s left scrolls horizontally with a pinned identity column (pinFirst, on by default) and a fading edge that signals there\'s more to scroll.',
    },
    {
      q: 'Is this a data grid, like AG Grid or MUI X?',
      a: 'No - nothing here is virtualized or cell-editable; it\'s a presentational table for columns, rows and a render function, not a spreadsheet engine. AG Grid and MUI X\'s Data Grid solve windowing and inline editing at enterprise scale; this solves "declare columns and rows, get sorting, selection, a sticky header and overflow handling for free."',
    },
    {
      q: 'How do I create a table component in React?',
      a: 'Pass columns and rows: each column is a key (also the default row[key] accessor), an optional label, and an optional render(row) for a custom cell - <Table columns={columns} rows={rows} rowKey="id" />. mono gives a column tabular numerals for IDs and timestamps, strong adds identity emphasis, and align or grow control text alignment and which column absorbs the slack width.',
    },
    {
      q: 'Does it work with Next.js, and is it accessible?',
      a: 'Yes to both. It ships with \'use client\' intact for the Next.js App Router, renders a real table/thead/tbody with scope="col" headers and aria-sort on the active sort column, and has zero runtime dependencies. A loading table fades its rows to 45% opacity and sets aria-busy; the row-reorder animation collapses to 1ms under prefers-reduced-motion.',
    },
  ],
};

export default seo;
