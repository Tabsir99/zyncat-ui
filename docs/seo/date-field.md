# date-field - SEO record

Page: https://ui.zyncat.app/date-field · Component: `DateField` (`@zyncat/ui/date-field`)

First of four date/time pages. `datetime-field`, `date-range` and `time-field` are separate pages;
their ground is fenced off below so those agents inherit a clean brief.

## Primary and secondary

| role                 | keyword            | proven traffic | best competitor position | proof URL                                 |
| -------------------- | ------------------ | -------------- | ------------------------ | ----------------------------------------- |
| primary              | react date picker  | 450/mo         | p1                       | npmjs.com/package/react-datepicker        |
| primary (title head) | date picker        | 1,100/mo       | p2                       | m3.material.io/components/date-pickers    |
| secondary            | react datepicker   | 700/mo         | p1                       | npmjs.com/package/react-datepicker        |
| secondary            | react calendar     | 450/mo         | p2                       | untitledui.com/react/components/calendars |
| secondary            | calendar component | 100/mo         | p10                      | primereact.org/calendar/                  |

KD is unavailable this round - Ahrefs' keyword-difficulty checker returned `kd: null` for all 15
title candidates while the site-explorer and traffic endpoints were rate-limited (see **Tooling**).
Position data from `serp` and per-keyword traffic from `traffic <url>` were both captured, so every
shipped keyword still clears the >=20 gate on real integers.

### The `react datepicker` head-term call

The briefing asked for an honest read on whether the title can win `react datepicker`. It cannot,
and the title does not try.

- Positions 1-3 for `react datepicker` are the package itself: npmjs.com/package/react-datepicker
  (700/mo at p1), reactdatepicker.com (700/mo at p2), then MUI. A docs page for a _different_
  library does not displace a package's own npm listing and homepage for its own name.
- The generic spaced form `react date picker` is a different SERP: npm p1, MUI p2, reactdatepicker
  p3, wojtekmaj p4, syncfusion p5, LogRocket p6, **21st.dev p7**, rsuite p8, **daypicker.dev p9**,
  flowbite p10. Component docs pages hold four of the ten slots, and 21st.dev earns 29/mo total
  traffic on essentially that one keyword at p7.

So the title leads with `react date picker`, `react datepicker` ships in the keyword array, and the
hyphenated package names (`react-datepicker`, `react-calendar`, `react-day-picker`) are rejected as
brand terms below.

## Kept

| keyword                  | source                                                            | volume | traffic/mo | kd  | cluster      | placed in                               |
| ------------------------ | ----------------------------------------------------------------- | ------ | ---------- | --- | ------------ | --------------------------------------- |
| date picker              | A bare head · m3.material.io/components/date-pickers p2           | >100   | 1100       | n/a | picker       | title, description, keywords            |
| react datepicker         | C stack · npmjs.com/package/react-datepicker p1                   | >100   | 700        | n/a | picker       | keywords                                |
| react date picker        | C stack · npmjs.com/package/react-datepicker p1                   | >100   | 450        | n/a | picker       | title, description, lede, keywords, faq |
| react calendar           | C stack · untitledui.com/react/components/calendars p2            | >100   | 450        | n/a | calendar     | keywords                                |
| datepicker               | A bare head · element-plus.org/en-US/component/date-picker p4     | >100   | 250        | n/a | picker       | keywords                                |
| html date input          | F platform · developer.mozilla.org/.../input/date p1              | >100   | 200        | n/a | native input | keywords, faq                           |
| react calendar component | D artifact · untitledui.com/react/components/calendars p1         | >100   | 200        | n/a | calendar     | keywords                                |
| date picker in react     | B behaviour · rsuitejs.com/components/date-picker/ p3             | <100   | 150        | n/a | picker       | keywords, faq                           |
| html date picker         | F platform · developer.mozilla.org/.../input/date p1              | >100   | 150        | n/a | native input | keywords                                |
| input type date          | F platform · w3schools.com/tags/att_input_type_date.asp p2        | <100   | 150        | n/a | native input | keywords, faq                           |
| datepicker react         | C stack · npmjs.com/package/react-datepicker p1                   | <100   | 100        | n/a | picker       | keywords                                |
| react calendar picker    | A/C · untitledui.com/react/components/date-pickers p4             | <100   | 100        | n/a | calendar     | keywords                                |
| calendar component       | D artifact · primereact.org/calendar/ p10                         | <100   | 100        | n/a | calendar     | title, keywords                         |
| date selector            | B behaviour · designsystem.digital.gov/components/date-picker/ p4 | <100   | 80         | n/a | picker       | keywords                                |
| date input               | A bare head · designsystem.digital.gov/components/date-picker/ p2 | <100   | 70         | n/a | native input | keywords, faq                           |

Proven but not shipped (kept the array tight at 15; all clear the gate and are safe for a future
pass): `calendar component react` 100, `calendar react component` 100, `react js calendar` 90,
`react calender` 80 (misspelling), `html datepicker` 70, `html date` 70, `input date` 70,
`calendar date picker` 60, `react date picker component` 50, `calendar react` 40,
`date of birth in html` 40, `react date` 30, `date picker html` 20, `datepicker html` 20,
`calendar in react` 20.

Failed the >=20 gate, dropped: `best react date picker` 10, `reactjs datepicker` 10,
`react month picker` 10, `date tag in html` 10, `datepicker format` 0.

## Rejected clusters

### Sibling-owned - do not claim on this page

| cluster                                                                                                           | proven traffic seen     | owner              |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------ |
| `react datetime picker` 150, `date time picker react` 30, `react datetime picker` 30, `datetime-local`            | 150/mo at untitledui p9 | **datetime-field** |
| `react date range picker` 100, `date range picker`, `range calendar`, `booking calendar`, `availability calendar` | 100/mo at untitledui p8 | **date-range**     |
| `time picker`, `react time picker`, `clock input`, `time input`                                                   | not mined               | **time-field**     |

These surfaced with real traffic on the same competitor URLs I mined (untitledui and rsuite rank for
the date-only _and_ the datetime/range terms on one page). They are deliberately left on the table.

### Ambiguous terms resolved to the date-only reading

Recorded so the three siblings do not re-litigate them:

- **`calendar component` / `react calendar component` / `react calendar` - kept here.** The SERP is
  split between date-picker calendars (shadcn Calendar, MUI DateCalendar, PrimeReact) and event
  calendars (FullCalendar, Bryntum, react-big-calendar). DateField's popover _is_ a month calendar,
  so the date-picker half is ours. The event-calendar half is a fourth subject that none of the four
  date/time pages owns - see the next section.
- **`calendar picker` / `react calendar picker` - kept here.** Single-day selection.
- **`date input` / `html date input` / `input type date` - kept here.** `<input type="date">` is the
  native _single-date_ control. Its sibling `<input type="datetime-local">` belongs to
  **datetime-field**, and `<input type="time">` to **time-field**.
- **`date selector` - kept here.** Proven off the USWDS date-picker page, single-date intent.

### Different subject - homograph

The highest-volume ground in the entire mine is not this component:

- `calendar` (>1M), `google calendar` (>1M), `calendar 2026`, `2026 calendar`,
  `december 2025 calendar`, `advent calendar`, `economic calendar`, `skylight calendar`,
  `month calendar` (>1K), `12 month calendar`, `mini calendar`, `printable month calendar`,
  `calendar design` and every `<month> calendar design` - wall calendars, printables and Google
  Calendar. `calendar` bare is the classic homograph trap; the seed was worth running only to map
  the boundary. **Never put a bare `calendar` in this page's title.**
- `calendar widget` (>100) and `google calendar widget` (>1K) - iPhone/Android/Notion home-screen
  widgets, not a web component.
- `date format` (>1K), `iso 8601 date format yyyy-mm-dd` (>1K), `us date format`, `european date
format`, `mla date format`, `military date format`, `javascript date format`, `sql date format` -
  formatting _reference_, not a component. Tempting because the component's value is literally
  ISO `'YYYY-MM-DD'`, and correctly rejected: the searcher wants a format table, not a picker. The
  fact still earns its place in FAQ 2, where it answers a real product question.
- `date component often crossword`, `date component, often` - crossword clue.
- `date field` bare - Microsoft Word insert-field and watch-complication homograph
  (`day date field watch`, `insert date field in word`). This is the component's own name and it
  does **not** earn a place in the title.
- `select date society` - a band.
- `random date picker`, `birthday picker wheel` - randomiser toys.

### Different subject - event/scheduler calendars

`react calendar timeline` (>100), `react calendar scheduler` (>100), `react big calendar`,
`fullcalendar`, `event calendar`, `react event calendar component`, `js calendar scheduler`.
DateField is a date _input_, not an agenda view. No FAQ or copy claims scheduling.

### Competitor-brand and other-stack qualified

Rejected because the page cannot answer "how do I use _theirs_":
`mui date picker`, `mui datepicker`, `material datepicker`, `shadcn date picker`,
`bootstrap datepicker`, `jquery datepicker`, `jquery ui datepicker`, `angular datepicker`,
`angular material datepicker`, `react native date picker`, `swiftui datepicker`,
`vue calendar component`, `blazor date input`, `asp.net mvc datepicker`, `tailwind datepicker`.

Package names, rejected as brand terms even though they carry the most traffic in the set:
`react-datepicker` (2,300/mo), `react-calendar` (100/mo), `react-day-picker` (250/mo),
`react day picker` (150/mo), `react-date-picker` (60/mo), `react-datepicker example` (30/mo),
`react-datepicker npm` (20/mo).

Other platforms entirely: `excel date picker`, `date picker in excel`, `google sheets date picker`,
`shopify delivery date picker`, `insert date picker in excel`, `how to add a date picker in word`.

## FAQ sourcing

Five of the six questions are rewrites of verbatim `generator` question rows:

| shipped question                                                    | verbatim source rows                                                                                                                                                              | angle      |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| How do I add a date picker to a React or Next.js form?              | `how to use datepicker in react js`, `how to use react datepicker`, `how to add calendar in input field in react js`, `how to close datepicker after selecting date`              | E trigger  |
| Why does the date picker give me a string instead of a Date object? | `how to get date from datepicker in react js`, `how to get value from datepicker`, `how to change date format in react datepicker`, `html input date value format yyyy-mm-dd mdn` | F format   |
| How do I disable past dates or limit the picker to a range?         | `how to disable past date in datepicker`, `how to restrict date in datepicker`, `how to disable dates in datepicker react`, `how to disable date before today in datepicker`      | E trigger  |
| Does it need date-fns, dayjs or Moment?                             | `react-datepicker 7.3.0 peerdependencies date-fns`, `best datepicker for react`                                                                                                   | G shopping |
| How do I restyle the calendar without Tailwind?                     | `how to style react-datepicker`, `how to style react calendar`, `how to style date input css`, `how to change calendar icon in input type date`                                   | F platform |
| Can you pick a date with the keyboard?                              | authored - no verbatim row; covers the a11y invariant                                                                                                                             | invariant  |

## Claim provenance

Every FAQ claim is read off the source, not inferred:

- Popover + live commit - `src/components/composites/date-picker/DateField.tsx` wraps `DtpPanel` in
  `<Popover side="bottom" align="start">`; `pickDay` calls `commit(key)` on every day press.
- `'YYYY-MM-DD'` value - `DateFieldProps.value/defaultValue/min/max` are `string`; `toKey()` in
  `date-utils.ts` builds `Y-MM-DD`.
- Escape / outside press / Done - `Popover` defaults `dismissible = true`
  (`useOutsidePress` + the `Escape` handler in `internal/overlay/layer.tsx`); `DtpPanel`'s footer
  renders a `Done` button bound to `close`.
- min/max inclusive, arrows stop at the bound - `within()` in `date-utils.ts`;
  `canPrev`/`canNext` in `calendar-panel.tsx`.
- `timezone` is display-only - `tzLabel()` formats a GMT offset for the footer and never touches the
  committed key.
- Zero dependencies - root `package.json` has no `dependencies`, only `react`/`react-dom` `^19`
  peers. Month maths is built-in `Date`; `Intl.DateTimeFormat` appears once, inside `tzLabel`.
- Tokens - `date-picker.css` uses 49 distinct `var(--*)` system tokens plus one component-scoped
  `--dtp-cell`, which defaults to `var(--control-height)` and sizes the seven grid columns.
- Keyboard + a11y - `onGridKeyDown` in `calendar-panel.tsx` handles Arrow/PageUp/PageDown/Home/End/
  Enter/Space; `role="grid"`, `role="gridcell"`, per-day `aria-label`, `role="dialog"` labelled by
  `label`; roving focus in `use-day-focus.ts` skips `:disabled` cells.
- Reduced motion - `src/tokens/motion.css` collapses every `--duration-*` to `1ms` under
  `prefers-reduced-motion: reduce`, which flips `UIMotion.reduced` (`dur.base <= 0.005`) and makes
  the layout pill settle at `duration: 0`.

## Tooling

`kwr` mint server on `127.0.0.1:9501`, `--country us`. Mid-run, Ahrefs rate-limited every
metrics endpoint for roughly 25 minutes: `traffic` returned `—`/`monthlyTrafficRaw: 0` for known-good
domains (github.com, ahrefs.com), `kd` returned `null` for all 15 candidates, `dr` returned
`null`, the `serp` DR/traffic columns came back `-`, and `generator` briefly dropped to 0 ideas.
SERP _positions_ were captured before the limit and `traffic` was re-run to completion after it
lifted, so the >=20 gate is enforced on real integers throughout. Only `kd` never recovered - it is
the one column this record cannot fill.

Raw artifacts:
`/tmp/claude-1000/-home-tabsir-ap-reactp-zyncat-ui/84d4d32b-155d-4e54-921b-e491cc040419/scratchpad/seo/date-field/`
(`seeds.json`, `merged.json`, `shortlist.json`, `serp.json`, `traffic2.json`, `traffic-rows.json`, `kd.json`).
