# table - keyword research

Primary: react data table (KD 8, <100 bucket, **150/mo proven** - ag-grid.com/react-table/ #3)
Secondary: data table (KD 56, 2200/mo, datatables.net #1), responsive table (KD 17, 300/mo, allthingssmitty.com #3),
sorting table (KD 1, 200/mo, w3.org APG #6), sortable table (KD 22, 30/mo, proven independently on three
accessibility-pattern pages), table component (KD 6, 40/mo, heroui.com #3)

Candidates collected: 354 generator ideas + 299 generator questions + 103 competitor `topKeywords` rows = 756.
94 of the competitor rows clear the >=20/mo `traffic` gate. Shipped: 15.

## The homograph warning was right to call this the worst one yet

Bare `table` is not a soft trap here, it is a wipeout. `serp table` returned seven results and every
single one is furniture retail:

| #   | URL                                            | What it is                         |
| --- | ---------------------------------------------- | ---------------------------------- |
| 1   | `amazon.com/table/k=table`                     | Amazon's own "table" category page |
| 2   | `nathanjames.com/collections/dining-tables`    | dining table retailer              |
| 3   | `transformertable.com/transformer-tables-sets` | modular dining table sets          |
| 4   | `theexpert.com/shop/category/furniture`        | furniture shop                     |
| 5   | `roomandboard.com/`                            | modern dining tables               |
| 6   | `costco.com/dining-tables`                     | Costco furniture                   |
| 7   | `westelm.com/shop/furniture`                   | West Elm furniture                 |

Zero software. `generator table` backs this up at every volume tier: `periodic table` (>1M),
`premier league table` / `epl table` / `multiplication table` / `times table` / `coffee table` /
`sur la table` / `open table` (all >100K - sports standings, math, a restaurant chain and a
reservations app all outrank anything React), then `round table pizza`, `pool table`, `table saw`,
`la liga table`, `console table`, `dining table`, `folding table`, `serie a table`, `table of
contents` (all >10K). `best table` repeats the pattern one level down - `best table saw`, `best
table tennis paddle`, `best table lamps`, `best table saw for beginners/2025/small shop`, `best
table top christmas trees with lights`. Bare `table` never appears anywhere on the page, and
neither does `best table`. This is a harder rejection than `odometer`, `otp` or `lens` - those had
at least a software-adjacent sense competing on page one. This one has none.

## `react table` is measured and it is TanStack's, same shape as `select`'s `react select`

`serp react table`: `tanstack.com/table/latest` #1, `github.com/tanstack/table` #2,
`mui.com/material-ui/react-table/` #3, a Reddit thread #4, `material-react-table.com` #5 (built on
TanStack Table), `npmjs.com/package/react-table` #6 (the legacy TanStack-lineage package),
`ag-grid.com/react-table/` #7, `react-bootstrap` #8, `mantine-react-table.com` #9 (also built on
TanStack Table). Five of nine results are TanStack or a TanStack-derivative. `kd react table` =
**54** - even harder than `react select`'s 46 - and `traffic tanstack.com` confirms **1100/mo at
#1** for the exact phrase, consistent across both the `/table/latest` subpage and the domain root.
Per the brief: this does not go in the title. It ships in `keywords` at its full proven volume
(1100/mo, the second-highest number on the page) and nowhere else.

## `react data table` is the pivot - fragmented SERP, KD 8, and it is the brief's own ground term

`serp react data table` came back genuinely mixed, no repeat domain:

| #   | URL                                            | What it is                         |
| --- | ---------------------------------------------- | ---------------------------------- |
| 1   | `npmjs.com/package/react-data-table-component` | a dedicated npm package            |
| 2   | `datatables.net/manual/react`                  | DataTables' own React wrapper docs |
| 3   | `ag-grid.com/react-table/`                     | AG Grid                            |
| 4   | `reddit.com/r/reactjs/...`                     | a comparison thread                |
| 5   | `tanstack.com/table/latest`                    | TanStack (only one slot here)      |
| 6   | `dev.to/jacksonkasi/...`                       | a blog tutorial                    |
| 7   | `marmelab.com/react-admin/DataTable.html`      | React-admin's DataTable            |
| 8   | `mui.com/material-ui/react-table/`             | MUI                                |

One TanStack slot out of eight, versus five of nine for bare `react table`. `kd react data table` =
**8** - winnable outright, not just "better than bare." `traffic ag-grid.com/react-table/` proves
**150/mo at #3** for the exact phrase. This is the same move `select.md` made with `react select
dropdown` (there: KD 31, 150/mo, pivoting off a KD-46 head) - here the pivot is even cleaner because
the KD gap is 54 to 8, not 46 to 31, and "react data table" is literally named in the brief's own
ground list. Title anchor.

## `data grid` is real, proven, and is not what this component is - confirmed from source

The brief said distinguish data grid (virtualised, editable, enterprise) from a presentational
table before claiming anything. `serp data grid` returned a three-way split: enterprise UI grids
(`mui.com/x/react-data-grid/` #2, `ag-grid.com` #3, `github.com/Comcast/react-data-grid` #7), an
unrelated distributed-computing sense (`redisson.pro/glossary/data-grid.html` #4 and
`en.wikipedia.org/wiki/Data_grid` #6 - grid computing / in-memory data grids, nothing to do with
UI), and unrelated company brands (`datagrid.com` #1, an AI-agents startup; `salesrabbit.com/datagrid`
#5). The traffic is real - `react data grid` earns **400/mo at `mui.com/x/react-data-grid/` #2** and
another **400/mo at `github.com/Comcast/react-data-grid` #1** - but `kd data grid` = **50**, and
every genuine UI competitor in that cluster is virtualised and cell-editable. `Table.tsx` was read
in full: `sortedRows.map(...)` renders every row directly, no windowing import, no `onCellEdit` or
`editable` prop anywhere in `TableProps`. Claiming "data grid" would misrepresent the component.
Addressed once, honestly, in the FAQ ("Is this a data grid, like AG Grid or MUI X?") - the term is
not shipped as a keyword.

## `table ui` is winnable by difficulty and wrong by intent - a second, different rejection

`kd table ui` = **5**, about as easy as keyword difficulty gets. `serp table ui` shows why that
doesn't matter: `mobbin.com` #1 ("Table UI Web Design Inspiration Examples"), `dribbble.com/tags/table-ui`
#2 and `dribbble.com/search/table` #8, `pinterest.com/.../table-ui-design/` #4, a UX-pattern article
#5, a Reddit design thread #6, Material's spec #7, a Figma community template #9. This is a
design-inspiration gallery query, not a "give me a working component" query - designers browsing
mood boards, not developers integrating a table. `data table ui` was kept instead: its proof point
is `m2.material.io/components/data-tables` ranking **#2 with 100/mo**, a legitimate design-pattern
spec rather than a mood board, and `kd data table ui` = **2**.

## Kept

| keyword                  | source (angle · competitor)                                                      | volume | traffic/mo | kd  | cluster            | placed in                            |
| ------------------------ | -------------------------------------------------------------------------------- | ------ | ---------- | --- | ------------------ | ------------------------------------ |
| data table               | A ground · datatables.net #1                                                     | >10K   | **2200**   | 56  | data-table         | description, keywords                |
| react table              | C stack · tanstack.com/table/latest #1                                           | >1K    | **1100**   | 54  | react-table        | keywords                             |
| responsive table         | B behaviour · allthingssmitty.com/responsive-table-layout #3                     | <100   | **300**    | 17  | responsive         | keywords                             |
| sorting table            | B behaviour (competitor-mined) · w3.org APG sortable-table #6                    | n/a    | **200**    | 1   | sortable           | keywords                             |
| react table library      | D artifact/G shopping · ag-grid.com/react-table/ #3                              | >100   | **200**    | 43  | react-table        | keywords                             |
| table responsive         | B behaviour (competitor-mined) · w3schools.com/css_table_responsive #2           | n/a    | **150**    | 22  | responsive         | keywords                             |
| react tables             | C stack (competitor-mined) · ag-grid.com/react-table/ #2                         | n/a    | **150**    | 57  | react-table        | keywords                             |
| react data table         | C stack/ground (competitor-mined) · ag-grid.com/react-table/ #3                  | n/a    | **150**    | 8   | react-table (head) | title, lede, keywords                |
| data table ui            | F platform · m2.material.io/components/data-tables #2                            | <100   | **100**    | 2   | data-table         | keywords                             |
| react table component    | D artifact · mui.com/material-ui/react-table/ #1                                 | >100   | **100**    | 42  | table-component    | keywords, faq                        |
| react datatable          | C stack (competitor-mined) · ag-grid.com/react-table/ #3                         | n/a    | **100**    | 1   | react-table        | keywords                             |
| table in react           | H assistant (competitor-mined) · react-bootstrap.netlify.app/table/ #2           | n/a    | **90**     | 37  | react-table        | keywords                             |
| best react table library | G shopping · ag-grid.com/react-table/ #2                                         | <100   | **90**     | 0   | react-table        | keywords                             |
| table component          | D artifact · heroui.com/react/components/table #3                                | <100   | **40**     | 6   | table-component    | keywords, faq                        |
| sortable table           | B behaviour · w3.org APG #1, dequeuniversity.com #2, designsystem.digital.gov #3 | <100   | **30**     | 22  | sortable           | title (as "Sortable"), keywords, faq |

`volume` is this page's own generator-seeded bucket estimate, kept only for context - never itself
evidence, per the skill's own rule. Six rows read `n/a` because they surfaced only from competitor
`topKeywords` mining and were never one of this page's own generator seeds; the `traffic` number
sitting next to them is still real, measured proof either way.

`react data table` anchors the title (`Sortable, Selectable React Data Table`, 37 chars) because it
is the only head-shaped term in the set with single-digit KD; "Sortable" and "Selectable" are the
two literal headline props (`sortable` per column, `selectable` on the root) named in the registry's
own blurb - "it owns sort, selection, stickiness, overflow" - so the title makes no claim beyond
what `TableProps` actually exposes. `data table`, at 2200/mo, is the single largest proven number on
the page; it stays out of the title only because `datatables.net`, a two-decade-old jQuery plugin,
owns position 1, exactly the `react-select.com` situation from `select.md`.

Past the >=20/mo gate but cut for redundancy (safe for a future pass):

- `responsive tables` **90** (smashingmagazine.com #1) and `sorting tables` **150**
  (dequeuniversity.com #5) - plural near-duplicates of rows already kept.
- `html sortable table` **40** (w3.org APG #2) and `table sorting` **30** (dequeuniversity.com #3) -
  would have made the sortable cluster five entries deep.
- `responsive table css` **50**, `table responsive css` **60**, `css responsive table` **30**,
  `make table responsive` **50**, `table scroll css` **50**, `responsive table design` **30** (all
  w3schools.com/css_table_responsive or allthingssmitty.com) - six more responsive-cluster variants,
  all independently proven, all redundant with `responsive table` / `table responsive`.
- `table in react js` **60** (react-bootstrap.netlify.app #1) - near-duplicate of `table in react`.
- `table component react` **20** and `tables in react` **20** (both heroui.com, right at the gate) -
  near-duplicates of `react table component` / `table in react`.

## Rejected clusters

- **Bare `table` and `best table`.** See above - furniture, sport-league standings, math tables, a
  restaurant chain, a reservations app, woodworking tools. Zero software presence at any volume
  tier. Never appears bare anywhere on the page.

- **`table design`.** Furniture and office-document dominated: `dressing/dining/coffee/wood/study/
console/side table design`, `modern dining table design`, `luxury console table design`, `office
table design`, `rotary indexing table design` (machining), `dynamodb single table design` (a
  database schema pattern - different subject), plus `where is table design in excel/word` and `how
to design a beautiful ppt table` (Office menu-location questions). No "well-designed table UI"
  intent anywhere in the set.

- **`table header`.** Dominated by the Word/Excel/Confluence convention of repeating a header row
  across printed pages - `confluence freeze table header`, `how to repeat table header in word`,
  `word table header on each page`, `excel print table header on each page`, `google docs table
header`. A different sense from CSS `position: sticky`; the generic phrase does not reach this
  component's sticky-header feature. `sticky table header` / `css sticky header` were not tested as
  their own phrases - open question for a future pass.

- **`table selection`.** Poker (`poker table selection`, `online poker table selection software`),
  furniture (`dining table selection`), and overwhelmingly Excel pivot tables (`how to change/
expand/edit pivot table selection` - ten-plus variants). Zero relevance to row-selection
  checkboxes. Rejected outright, nothing shipped.

- **`admin table`.** Dominated by _Among Us_, the video game (`admin table among us`, `how to use
admin table in among us`, `skeld admin table`, `does the admin table show dead bodies`) and
  brand-specific admin-panel frameworks (`vben admin table component` x5 variants, `sb admin table`,
  `ngx admin table`, `laravel-admin table`). No generic component demand survived.

- **`dashboard table`.** Dominated by specific products' own UI: ServiceNow (x3), Supabase's
  dashboard table editor (x3), Stripe, NocoDB, Jenkins, Power BI. Navigational to those brands, not
  a generic "how do I build a dashboard table" ask.

- **The `html table` / native-element cluster.** `table in html` **8500** (w3schools.com #1),
  `table tag in html` **2600** (geeksforgeeks.org #2), `tables in html` **2000**, `html tables`
  **1600**, `table html` **1400** (developer.mozilla.org #1), `html table` **600** (MDN #1),
  `html table code` **450**, `table format in html` **250**. `kd html table` = **55**. The largest
  unclaimed volume in the whole candidate set, and the correct answer to every one of them is the
  native `<table>` element and a tutorial, not a React component - the exact shape of `select.md`'s
  rejected `dropdown in html` / `select html` cluster, with W3Schools, MDN and GeeksforGeeks holding
  the same DR-90+ role that W3Schools/MDN held there.

- **`html table generator` / `builder` / `maker`.** `tablesgenerator.com/html_tables` earns
  `html table generator` **500** #1, `html table builder` **100** #1, `html table maker` **40** #1.
  A markup-generation utility (paste data, get an HTML table) - a different product category, not a
  component.

- **`data grid` and its family.** See above - `data grid` **kd 50**, `react data grid` **400/mo**
  (mui.com/x #2 and github.com/Comcast/react-data-grid #1), plus pure brand traffic:
  `ag grid` **5700**, `mui datagrid` **900**, `ag-grid`/`aggrid` **900**, `agrid` **450**, `mui data
grid` **400**, `material ui grid` **900** (a different MUI product, their layout Grid). Virtualised,
  cell-editable, enterprise territory this component does not occupy. Addressed once in the FAQ,
  never shipped as a keyword.

- **`table ui` (bare).** See above - `kd 5` but a design-inspiration-gallery SERP (Mobbin, Dribbble
  x2, Pinterest, Figma). Wrong audience. `data table ui` kept instead on a design-_spec_ proof point.

- **The `css table` / native-styling cluster.** `kd css table` = **39**.
  `piccalil.li/blog/styling-tables-the-modern-css-way/` earns only **398/mo total** across every
  variant (`table styles` 150, `table styling` 90, `css table styling` 50, `table styling css` 40,
  `stylish css tables` 60). The intent is "restyle a bare native `<table>` with CSS," a recipe this
  component doesn't need to answer - unlike `select`, where a native `<select>` menu genuinely
  cannot be restyled (justifying that page's FAQ entry), a native `<table>` styles fine with plain
  CSS, so there is no equivalent capability gap to explain. Skipped entirely, no FAQ forced.

- **`shadcn table`.** `reui.io/components/table` earns **600/mo at #3** for it - the single
  largest number found for any table-component-adjacent library brand. Not shipped: shadcn/ui is a
  Tailwind + Radix copy-paste registry, and this project's own invariant is "No Tailwind, no
  CSS-in-JS, no UI library." Claiming this term would misrepresent the component's own methodology.
  Separately, `ui.shadcn.com/docs/components/table` itself measures **0/mo** even though "shadcn
  table component" surfaced as four separate phrasings in the generator's ideas - phrasing volume
  that never became real clicks, one more confirmation the >=20 gate is doing real work.

- **Other library brand names.** `material react table` **400**, `mui table` **1000**,
  `material table` **250**, `material ui table` **200/250** (two different pages), `mantine react
table` **10**, `mantine ui` **800**, `tanstack table` **1500**, `tanstack` **5700**, `jquery
datatable` **600**, `bootstrap datatable` **250**, `datatable`/`datatables` **1500/700**. All
  navigational to a specific competing library.

- **`cap table`.** Surfaced via generator questions ("who offers the best cap table software",
  "what's the best way to manage a cap table") - a startup capitalisation-table (equity ownership)
  term from company finance/legal. Different subject entirely.

- **Gaming and academic-quiz noise.** Genshin Impact's "sturdy library table" quest item (from the
  `table library` seed, six separate phrasings), Minecraft's crafting/smithing table UI (from the
  `table ui` seed, five phrasings), `router table` (a woodworking tool) versus "routing table" in
  networking (`which router component holds the routing table` - also a different subject), plus a
  long tail of academic quiz questions lifted wholesale into the question set (periodic-table
  chemistry, pivot-table statistics, mortgage-payment tables, acceptance-rate probability tables).
  Self-evidently irrelevant; not dignified with individual line items beyond this one.

- **Territory ceded per the brief.** `pagination`, `react pagination`, `table pagination` - the
  `pagination` page's territory, not yet researched. `react table pagination` surfaced in the
  `react table` generator cluster (`<100` bucket) and was excluded on sight, never queried further.

## FAQ sources

| Shipped question                                              | Generator row / rationale                                                                                                       |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| How do I make a table sortable in React?                      | `how to create sortable html table javascript`, `how to make a sortable table in html`, adapted to the React prop surface       |
| How do I add row selection or checkboxes to a table?          | angle E (trigger moment); no generator row - same as `select.md`'s precedent for a real-feature FAQ without a verbatim source   |
| How do I make a table responsive without breaking the layout? | `how to make a table responsive`, `how to make a table responsive for mobile`, `how to make table responsive css`               |
| Is this a data grid, like AG Grid or MUI X?                   | `what is a data grid`, `react table vs ag grid`, `react table vs ag-grid` - disambiguation, not a claimed keyword               |
| How do I create a table component in React?                   | `how to create a table component in react`, `how to create table component in react js`, `how to add data to table in react js` |
| Does it work with Next.js, and is it accessible?              | angle F/platform; no generator row - mirrors `select.md`'s sixth FAQ                                                            |

Every answer is checked against `src/components/composites/table/Table.tsx` and `table.css` directly
(the MCP `get_component` tool was unreliable this session, so every prop claim below is first-hand):
`sortable`/`sortBy`/`defaultSort`/`onSortChange` and the numeric-aware `tblCompare` for sorting; the
`Motion`-driven `layoutTransition` (`ROW_FLIP`) for the reorder animation; `selectable`, the `Set`-
based selection state, `onSelectionChange`, `bulkActions(keys, clear)`, and the `shiftRef`/
`lastIdxRef` range-select logic in `toggleRow` for selection; `hideBelow` plus `container-type:
inline-size` and the `@container (max-width: 42rem / 30rem)` rules in `table.css` for responsive
columns (a container query, not a viewport media query - verified in source, not assumed);
`pinFirst`, the sticky `thead th` and `.tbl__cell--pin` rules, and the `data-x-more`/`data-x-back`
edge-fade driven by `useScrollEdges` for the overflow behaviour; `columns[].render`, `mono`,
`strong`, `align`, `grow` for cell rendering; `loading` (0.45 opacity, `aria-busy`) and `empty` for
the two non-happy-path states; `'use client'` (line 1), `scope="col"`, and `aria-sort` for platform/
a11y; `package.json` for zero runtime `dependencies` and `react`/`react-dom` `^19` peer deps; and
`src/tokens/motion.css`'s global `prefers-reduced-motion` block (every duration collapses to 1ms)
for the reduced-motion claim, which applies to the row-reorder FLIP the same way `select.md`
documented it applying to that component's transitions.

No virtualisation and no cell-editing prop exist anywhere in `TableProps` - confirmed by reading the
full interface, not inferred - which is what makes the "Is this a data grid?" FAQ answer defensible
rather than a guess. No `<caption>` element exists in the render output either (only `aria-label` on
the `<table>` itself); no claim in this file depends on one.

## Tooling note

Ran against the round's dedicated mint server at `127.0.0.1:9502` (overridden per the task, not the
skill's default `:9500`). `/health` at the start showed `ready: 5` of 10 widgets; mid-run checks
during the busiest stretch showed `ready: 0` with a 2-5 deep queue and `failed` climbing past 150,
consistent with heavy concurrent load from other agents' sessions sharing the same server - matching
the multi-agent contention `select.md` logged on port 9501. Every batch in this file still completed
successfully; none needed a retry, and no `kd` call returned `null`. All fifteen kept rows and every
rejected-cluster number came from a call that returned real data.
