# pagination - keyword research

Primary: react pagination (KD 3, >100 bucket, **600/mo proven** - mui.com/material-ui/react-pagination/
#2, react-bootstrap.netlify.app/docs/components/pagination #1, github.com/AdeleD/react-paginate #7,
medium.com/@swatikpl44/pagination-in-react-a5cb6357a485 #3 - four independent sources, same number)

Secondary: pagination (KD 59, >10K bucket, **11K/mo**, en.wikipedia.org/wiki/Pagination #1 and
designsystem.digital.gov/components/pagination/ #10; getbootstrap.com's own pagination docs page also
ranks #3 for the bare term at 5.4K/mo), pagination component (KD 6, <100 bucket, **50/mo proven** on
four independent pages - ui.shadcn.com/docs/components/base/pagination #3, vuetifyjs.com/en/components/
paginations/ #6, polaris-react.shopify.com/components/navigation/pagination #8, component.gallery/
components/pagination/ #2), table pagination (KD 9, <100 bucket, **100/mo**, v6.mui.com/base-ui/
react-table-pagination/ #1 and ui.shadcn.com/docs/components/radix/pagination #3 - the territory `table.ts`
ceded)

Candidates collected: 319 generator ideas + 198 generator questions + 67 competitor `topKeywords` rows = 584. Of the 67 raw competitor rows, 62 clear the >=20/mo `traffic` gate (44 unique keywords, 41 of them
past the gate once deduped). Shipped: 12.

## The component is not what the brief assumed, and that changed the whole page

The brief asked to establish "page-number rendering and truncation/ellipsis logic" from source. Reading
`Pagination.tsx` in full found neither. `PaginationProps` is `ariaLabel`, `range: [number, number]`
(1-based inclusive `[from, to]`), `total?: number | null`, `hasPrev?: boolean`, `hasNext?: boolean`,
`onPrev?: () => void`, `onNext?: () => void`, `loading?: boolean`, `className`, `htmlProps` - nothing
else. There is no page-number list, no ellipsis truncation, no `page`/`pageSize`/`totalCount`/
`onPageChange` prop anywhere in the interface. The registry's own `heroCode` string
(`<Pagination page={page} pageSize={10} totalCount={94} onPageChange={setPage} />`) does not match the
shipped component and was not used as a source; the real demo, `PaginationHero` in
`apps/docs/components/pages/data.tsx`, computes `range`/`hasPrev`/`hasNext` from a local `offset` and
matches `Pagination.tsx` exactly. The registry blurb - "Honest cursor strip - a mono range readout and a
prev/next pair" - is the accurate description, and every claim below is checked against
`Pagination.tsx`/`pagination.css` directly, not inferred (the MCP `get_component` tool was unreliable
this session).

This means the page cannot chase "page numbers", "ellipsis pagination" or a numbered-pages angle at all

- the honest story is the opposite: a component that deliberately has no page-number row, and that turns
  out to be a real, provable differentiator once `page numbers` (below) came back as a document-editing
  term rather than a UI-pagination one anyway.

## `pager` is a total wipeout - same shape as `table.md`'s `table`

`generator pager` returned 20 ideas and every one is either "one pager" (a business-plan/marketing
one-page-document term - `one pager template`, `one pager examples`, `how to write a one pager`) or the
literal radio-paging device (`pager duty` as in PagerDuty, `beeper pager`, `pager device`). `serp pager`
confirms it cold: `en.wikipedia.org/wiki/Pager` #1, `amazon.com/pager` #2 (a product category),
`pagersdirect.net/collections/numeric-pagers` #3, a pager-history/hospital article #4,
`retekess.com` #5 and `discoversystems.com/what-is-a-pager` #6 - all six results are the physical device.
Zero software anywhere in either call. Not dignified with a `kd` or `traffic` check; the SERP alone is
unambiguous.

## `page numbers` and `page navigation` are real terms for different subjects entirely

`generator page numbers` (20 ideas + 13 questions, all of it): Word, Google Docs, PDF, Canva, InDesign,
Adobe, PowerPoint, and APA/MLA/Chicago citation-format page numbering - `how to add page numbers in
word`, `apa page numbers`, `add page numbers to pdf`, `how to start page numbers on page 2`. This is the
document-editing convention of numbering printed/exported pages, not a UI component showing which page
of results is active - and this component doesn't render page numbers at all, so there is no capability
gap to explain even if the intent matched.

`generator page navigation` (20 ideas + 20 questions): SharePoint/Confluence/WordPress _site navigation
menus_ (`how to add a page to navigation in sharepoint`, `how to add page navigation in wordpress`),
Power BI _report-to-report_ navigation buttons (`power bi page navigation examples`), and Avalonia's .NET
`Frame` navigation control (`avalonia frame page navigation`) - all "move between distinct
pages/screens of an app," not "page through a list of rows." One relevant-looking row, `mdn aria-current
page navigation`, ties to `aria-current="page"` on nav links - which this component doesn't use (there
are no per-page links to mark current, only two arrow buttons). Neither term shipped.

## `prev next`, `load more` and `infinite scroll` are real UI ideas, drowned by unrelated senses

`prev next` splits three ways in the generator data: Google's deprecated (2019) `rel="prev"/"next"` HTML
pagination-SEO convention (`google rel prev next deprecated 2019`, `rel prev next canonical` - eight
separate phrasings of the same dead announcement), doubly-linked-list CS diagrams (`doubly linked list
diagram prev next pointers` - six phrasings), and a thin, generic UI remainder (`prev next button`,
`swiper prev next button`). No single sense dominates enough to anchor on, and the UI remainder never
clears its own `traffic` proof. Not shipped.

`load more` (20 ideas + 20 questions) is mostly noise from the _other_ sense of "load" - washing-machine
and electrical load (`front load washers`, `load on gpu`, `does a generator use more fuel under load`),
Gmail's fetch limits, Janitor AI chat-loading errors, Minecraft chunk loading. The relevant sliver
(`load more button`, `ajax load more`, `load more vs pagination`) never got a `traffic` test since the
seed itself doesn't clear a clean-intent bar the way `react pagination` or `pagination component` do.
Not shipped, not forced into an FAQ.

`infinite scroll` is real and large (`kd` not tested, but `infinite scroll vs pagination`, `ux pagination
or infinite scroll` and `pagination vs infinite scroll` all sit in the generator's `>100` bucket) and is
a genuine adjacent pattern - but this component is click-driven (`onPrev`/`onNext` fire only on a button
press) and has no scroll listener anywhere in `Pagination.tsx`. Claiming the term would misrepresent the
mechanism. Addressed in one FAQ answer alongside the page-numbers disambiguation, never shipped as a
keyword.

## `cursor pagination` and `api pagination` are real, large, and belong to backend engineering

`serp cursor pagination`: `betterprogramming.pub` (offset vs cursor) #1, `merge.dev/blog/cursor-pagination`
#2, a Stack Overflow API-cursor question #3, `apollographql.com/docs/react/pagination/cursor-based` #4,
an embedded-API-pagination guide #5, Zendesk's cursor-pagination API docs #6 - six of six results are
backend/API-design content, not a single UI component. `generator cursor pagination` backs this up at
every row: MongoDB, Postgres, ClickHouse, Laravel, the JSON:API spec, Twitter/X, Square and GraphQL
Relay-style cursor docs, `cursor pagination vs offset pagination` comparisons. `kd cursor pagination` =
**3** - as easy as `react pagination` itself - which is exactly the "winnable by difficulty, wrong by
intent" trap `table.md` flagged for `table ui`. `api pagination` is the same subject from the REST side:
GitHub's `Link` header, Notion's `start_cursor`/`page_size`, Shopify's API, `rest api pagination best
practices` - all backend-implementation content.

The honest wrinkle: this component's own shape - `hasPrev`/`hasNext` booleans and an optional `total`,
never a page count - is exactly what a cursor-paginated API hands back, unlike a numbered-pages UI that
needs to know how many pages exist. That's a real, checkable fact (`total = null` default,
`total?: number | null`), so it earns one honest FAQ answer explaining the fit - without claiming either
keyword, matching how `table.md` handled `data grid`.

## `pagination ui` is mixed, not a wipeout like `table.md`'s bare `table ui`

`serp pagination ui`: `dribbble.com/search/pagination` #1 and `figma.com/community/.../pagination-ui-kit`
#3 are mood-board/design-gallery results, but `mui.com/material-ui/react-pagination/` #2 and
`ui.shadcn.com/docs/components/radix/pagination` #6 are real component docs, plus two UX-practice
articles (`stevesohcot.medium.com` #5, `eleken.co/blog-posts/pagination-ui` #8) and `mobbin.com/
glossary/pagination` #4, a design-pattern glossary rather than a pure mood board. `kd pagination ui` =
**0**, and `traffic` proves **250/mo** independently on three of those pages (mui.com #2, mobbin.com #4,
ui.shadcn.com/radix #8). Unlike `table.md`'s bare `table ui` (a 100% Dribbble/Pinterest/Figma sweep),
real component and pattern-reference pages hold three of eight slots here. Kept.

## Kept

| keyword                    | source (angle · competitor)                                                         | volume | traffic/mo | kd  | cluster                     | placed in                    |
| -------------------------- | ----------------------------------------------------------------------------------- | ------ | ---------- | --- | --------------------------- | ---------------------------- |
| pagination                 | A ground · en.wikipedia.org/wiki/Pagination #1, designsystem.digital.gov #10        | >10K   | **11K**    | 59  | pagination                  | title, description, keywords |
| pagination website         | B behaviour (competitor-mined) · coyleandrew.medium.com/design-better-pagination #7 | n/a    | **900**    | n/a | ux-pattern                  | keywords                     |
| react pagination           | C stack · mui.com/material-ui/react-pagination/ #2                                  | >100   | **600**    | 3   | react-pagination (head)     | title, description, keywords |
| web pagination             | B behaviour (competitor-mined) · component.gallery/components/pagination/ #20       | >100   | **600**    | 42  | ux-pattern                  | keywords                     |
| pagination examples        | G shopping · designsystem.digital.gov/components/pagination/ #6                     | <100   | **400**    | 10  | pagination                  | keywords                     |
| pagination ui              | F platform · mui.com/material-ui/react-pagination/ #2                               | >100   | **250**    | 0   | pagination-ui               | keywords                     |
| pagination design          | F platform (competitor-mined) · component.gallery/components/pagination/ #4         | <100   | **150**    | 5   | pagination-ui               | keywords                     |
| table pagination           | I product use (ceded by `table.ts`) · v6.mui.com/base-ui/react-table-pagination/ #1 | <100   | **100**    | 9   | table-pagination (head)     | keywords, faq                |
| pagination best practices  | G shopping/H assistant (competitor-mined) · coyleandrew.medium.com #2               | n/a    | **90**     | 11  | pagination-ui               | keywords                     |
| react pagination component | D artifact · mui.com/material-ui/react-pagination/ #1                               | <100   | **80**     | 11  | react-pagination            | title, description, keywords |
| react table pagination     | C+I combined (competitor-mined) · v6.mui.com/base-ui/react-table-pagination/ #2     | n/a    | **70**     | 0   | table-pagination            | keywords                     |
| pagination component       | D artifact · ui.shadcn.com/docs/components/base/pagination #3                       | <100   | **50**     | 6   | pagination-component (head) | title, description, keywords |

`volume` is the generator-seeded bucket, kept only for context, never itself evidence. Four rows read
`n/a`: three (`pagination website`, `web pagination`, `pagination best practices`) surfaced only from
competitor `topKeywords` mining and were never one of this page's own generator seeds; `react table
pagination` is the same. The `traffic` number next to each is still real, measured proof.

`react pagination` anchors the title (`React Pagination Component`, 27 chars) alongside `pagination
component` - both single-digit KD (3 and 6), both proven on 3-4 independent competitor pages at once,
and both literally true of `PaginationProps` (it is a React component, and pagination is what it does).
`pagination` itself, despite the biggest number on the page (11K/mo), stays out of the anchor position:
`kd pagination` = **59**, and its own SERP is dictionary-and-Wikipedia-led (Merriam-Webster #1, an
unrelated SaaS brand `pagination.com` #2, Google's SEO-crawling guide #3, Wikipedia #6) - not a wipeout
like `table` or `pager`, since two of seven results (`getbootstrap.com` #5, `designsystem.digital.gov`
#7) are real pagination components, but not clean enough to lead on either. Same call `table.md` made
with `data table`.

Past the >=20/mo gate but cut for redundancy (safe for a future pass):

- `pagination example` **100** (designsystem.digital.gov #6, singular) and `pagination website examples`
  **80** (coyleandrew.medium.com #2) - near-duplicates of `pagination examples`.
- `paginated table` **30** (v6.mui.com #2) and `pagination table`/`table pagination` word-order twins
  (**20-100** across ant.design, v6.mui.com, ui.shadcn.com/radix) - redundant with `table pagination`.
- `pagination styles` **20** and `pagination style` **40** (both component.gallery) - thinner phrasings
  of `pagination design`.
- `pagination web design` **20** (coyleandrew.medium.com #1, right at the gate) - redundant with
  `pagination design` / `pagination website`.
- `how to do pagination in react` **200** and `how to implement pagination in react` **200**
  (medium.com/@swatikpl44 #2, #3) and `pagination in react` **100** (#1) - real, proven, but long-tail
  phrasings of `react pagination`; used as FAQ question sources instead of separate keyword slots, to
  keep the array tight (the brief: "Google ignores this tag ... so tight beats long").

## Rejected clusters

- **`pager`.** See above - "one pager" business documents and literal radio pagers, zero software at
  any volume tier, confirmed by both `generator` (20/20 wrong subject) and `serp` (6/6 wrong subject).
  Never appears bare anywhere on the page.

- **`page numbers`.** Word/Google Docs/PDF/Canva/InDesign/Adobe/PowerPoint document pagination and
  APA/MLA/Chicago citation page numbers. This component has no page-number row to begin with, so there
  is no capability gap worth an FAQ either.

- **`page navigation`.** Site-navigation menus (SharePoint, Confluence, WordPress) and app/report
  navigation (Power BI, Avalonia's `Frame`) - moving between distinct pages of an app, not paging
  through one list's rows. `aria-current="page"` surfaced once in the questions but doesn't apply: no
  per-page links exist to mark current.

- **`prev next`.** Google's deprecated (2019) `rel="prev"/"next"` SEO convention and doubly-linked-list
  CS-diagram questions dominate; the genuine UI remainder (`prev next button`) is too thin to anchor on
  and never got a `traffic` test.

- **`load more`.** Overwhelmingly the _other_ senses of "load" - washing machines, electrical/GPU load,
  Gmail fetch limits, Janitor AI errors, Minecraft chunk loading. The relevant sliver (`load more vs
pagination`) wasn't independently proven.

- **`infinite scroll`.** Real and large (`infinite scroll vs pagination` family sits in the generator's
  `>100` bucket) but a different, scroll-triggered mechanism this component doesn't implement -
  `Pagination.tsx` has no scroll listener; `onPrev`/`onNext` fire only on a button press. Addressed once
  in the FAQ, never shipped as a keyword.

- **`cursor pagination` and `api pagination`.** See above - both `kd 3`-`kd` range easy, both entirely
  backend/API-design content on `serp` (MongoDB, Postgres, GraphQL Relay, GitHub's `Link` header,
  Notion, Shopify). The component's own `hasPrev`/`hasNext`-plus-optional-`total` shape genuinely matches
  cursor consumption, so it gets one honest FAQ answer - never shipped as a keyword, same treatment
  `table.md` gave `data grid`.

- **`shadcn pagination`.** `ui.shadcn.com/docs/components/base/pagination` earns **200/mo at #1** - a
  large, real number - but shadcn/ui is a Tailwind + Radix copy-paste registry, and this project's own
  invariant is "No Tailwind, no CSS-in-JS, no UI library." Same rejection `table.md` made for `shadcn
table`, for the same reason.

- **Other library/framework brand names.** `bootstrap pagination` **450** and `pagination bootstrap`
  family (getbootstrap.com, all Bootstrap-brand navigational), `antd pagination`/`pagination antd`
  **70/40** (Ant Design), `vue pagination` **60** (Vuetify - a different framework, not React),
  `shopify pagination` **200** (Shopify Polaris, brand-navigational), `pagination tailwind` **10**
  (below the gate, and Tailwind besides). All navigational to a specific competing library or off-stack.

- **`pagination meaning` / `what is pagination` (as keywords) / `paginated` / `paginated pages`.**
  Purely definitional - Wikipedia's own top keywords for its article (`pagination meaning` **2.3K**,
  `what is pagination` **2K**, `paginated` **2.7K**, `paginated pages` **350**, all en.wikipedia.org).
  Zero component-shopping intent. `what is pagination` is used verbatim as the first FAQ question
  (matching a real 2K/mo-proven question people ask), but none of the four ship as keywords - informational,
  top-of-funnel, and the FAQ opener already covers the "what is X" intent once.

- **Territory received per the brief.** `pagination`, `react pagination`, `table pagination` - ceded by
  `table.ts` in this round, confirmed still live and un-shipped by any sibling `content/seo/*.ts` file
  before this page claimed them (checked via `grep -l "page\|pagination" apps/docs/content/seo/*.ts`;
  every hit found was an incidental use of the word "page" in unrelated prose, not a claimed pagination
  keyword).

## FAQ sources

| Shipped question                                                  | Generator row / rationale                                                                                                                                                |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| What is pagination?                                               | `what is pagination` (2K/mo proven, en.wikipedia.org #1) - definitional opener, then pivots to this component's specific shape                                           |
| Does this show numbered page buttons, or support infinite scroll? | Disambiguation combining the `page numbers` and `infinite scroll` rejections into one answer - no verbatim row, same precedent as `table.md`'s data-grid FAQ             |
| How do I add pagination to a table in React?                      | `how can i add pagination to the table`, `how to add pagination to table in react js`, `how can i implement pagination for the table` - the `table pagination` territory |
| Can I use it with a cursor-based API that has no total count?     | `what is cursor pagination`, `how does cursor pagination work` - disambiguation, not a claimed keyword, mirrors `table.md`'s `data grid` FAQ                             |
| How do I show a loading state while the next page is fetching?    | angle E (trigger moment); no generator row - same precedent as `table.md`'s row-selection FAQ (a real feature, no verbatim source)                                       |
| Is it accessible, and does it work with Next.js?                  | angle F/platform; no generator row - mirrors `table.md`'s and `select.md`'s closing platform FAQ                                                                         |

Every answer is checked against `src/components/composites/pagination/Pagination.tsx` and
`pagination.css` directly (the MCP `get_component` tool was unreliable this session, so every prop claim
is first-hand): `range: [number, number]`, `total?: number | null` (default `null`, so `of N` renders
only when supplied), `hasPrev`/`hasNext` booleans, `onPrev`/`onNext` callbacks, and the complete absence
of any `page`/`pageSize`/`onPageChange` prop - confirmed by reading the full `PaginationProps` interface,
not inferred - for the "no page numbers" and "controlled-only, cursor-shaped" claims; `loading`,
`lastDirRef` and the `prevBusy`/`nextBusy` split (`Button`'s own `loading` prop) for the loading-state
answer; the `<nav aria-label>` root, the `ariaLabel` prop's own JSDoc ("name the list (\"Posts\"), not
\"pagination\"") , `aria-live="polite"` on the range readout, per-button `aria-label` ("Previous
page"/"Next page"), and native `<button>` elements (confirmed in `Button.tsx`) for the accessibility
answer; `'use client'` on line 1 for Next.js App Router support; `package.json`'s absent `dependencies`
key plus `react`/`react-dom` `^19` peer ranges for zero-runtime-dependency and React 19 claims; and
`src/tokens/motion.css`'s global `prefers-reduced-motion` block (lines 57-62, every duration collapses to
1ms) for the reduced-motion claim, which applies to the `animate(rangeRef.current, slideIn(...))` range
slide the same way `table.md` documented it applying to that component's row-reorder FLIP.

No scroll listener, no page-number list, no ellipsis-truncation logic and no `page`/`pageSize` prop exist
anywhere in `Pagination.tsx` - confirmed by reading the full file, not assumed from the brief's own
framing, which is what makes the "does this show numbered pages" FAQ answer defensible rather than a
guess.

## Tooling note

Ran against the round's dedicated mint server at `127.0.0.1:9503` (per the task, not the skill's default
`:9500`). `/health` fluctuated between `ready: 5` (idle) and `ready: 0` with `failed` climbing into the
80-90s under concurrent load from other agents' sessions during the busiest stretch - consistent with the
multi-agent contention both `table.md` (port 9502) and `select.md` (port 9501) logged. Every batch in
this file still completed successfully; no `kd` call returned `null` and none needed a retry. The `kwr
batch` plan schema uses `"tool"`, not `"cmd"`, for the operation name - the first batch call in this run
used `"cmd"` and every row failed with `Unsupported tool:`, caught immediately from the batch JSON output
before any real research time was lost. Per-item `out`/`md` paths inside a batch plan are also ignored in
this build; only the top-level `--out`/`--md` passed to the `batch` command itself controls where results
land, so every result in this file was read back from one combined summary JSON rather than the
per-target files the plan requested.
