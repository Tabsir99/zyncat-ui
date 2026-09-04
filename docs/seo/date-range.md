# date-range - SEO record

Page: https://ui.zyncat.app/date-range · Component: `DateRangeField` (`@zyncat/ui/date-range-field`)

Third of four date/time pages. Territory is binding: `date-field` (shipped) owns date-only terms
(`date picker`, `react date picker`, `react calendar`, `calendar component`, `date input`);
`datetime-field` owns date+time terms; `time-field` owns time-only terms. This page owns range
ground: `date range picker`, `react date range picker`, `date range`, `range calendar`, `booking
calendar`, `check in check out picker`, `daterangepicker`. Two of those seven granted terms
(`range calendar`, `check in check out picker`) came back with zero SERP data on repeat tries and
two (`booking calendar` and its sibling `availability calendar`) turned out, on a fresh SERP pull,
to be a different subject - see **Rejected clusters**.

## Primary and secondary

| role      | keyword                 | proven traffic | best competitor position                                | proof URL                                             |
| --------- | ----------------------- | -------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| primary   | date range picker       | 450/mo         | p1                                                      | daterangepicker.com                                   |
| secondary | date range              | 350/mo         | p3 (live SERP; the site's own keyword table reports p1) | daterangepicker.com                                   |
| secondary | daterangepicker         | 250/mo         | p1                                                      | daterangepicker.com                                   |
| secondary | react date range picker | 200/mo         | p1                                                      | npmjs.com/package/react-date-range                    |
| secondary | range picker            | 150/mo         | p1                                                      | heroui.com/en/docs/react/components/date-range-picker |

KD (Ahrefs difficulty) came back clean this round, no retries needed: `date range picker` 12,
`react date range picker` 13, `daterangepicker` 13, `date range` 15, `range picker` 0, `date range
picker react` 12, `react date range` 12, `date range selector` 9, `daterange` 9, `daterange picker`
**51**, `react daterangepicker` 3, `daterangepicker react` 9. All 12 candidates medium-or-easier
except `daterange picker` (hard, 51) - kept in the keyword array per its real 40/mo traffic, never
used in the title, per the skill's >40-belongs-in-copy-only rule.

### The `date range picker` head-term call

Unlike `date-field`'s `react datepicker` (which the package's own site owns outright), the SERP for
bare `date range picker` is genuinely a level field: `daterangepicker.com` (the jQuery plugin) at
p1, then eight of the next nine slots are React/Angular/web-component **date-range-picker doc
pages** - MUI (p2), USWDS (p3), Adobe react-aria (p4), HeroUI (p5), Material 3 (p6), a Reddit
"best library" thread (p7), Infragistics Angular (p8). `react date range picker` narrows further to
an all-component-doc field: Reddit p1, MUI p2, the `react-date-range` npm listing p3, `react-dates`
on GitHub p4, Tremor p5, a YouTube tutorial p6, a Medium build-your-own post p7, UntitledUI p8,
rsuite p9, Infragistics React p10. A docs page for a date-range-picker component is exactly what
both SERPs already reward, so the title leads with `React Date Range Picker Component` without
hedging the way `date-field` had to hedge on `react datepicker`.

## Kept

| keyword                 | source                                                        | volume | traffic/mo | kd  | cluster         | placed in                    |
| ----------------------- | ------------------------------------------------------------- | ------ | ---------- | --- | --------------- | ---------------------------- |
| date range picker       | A bare head · daterangepicker.com p1                          | >100   | 450        | 12  | picker          | title, description, keywords |
| date range              | A bare head · daterangepicker.com p1 (table) / p3 (live SERP) | >100   | 350        | 15  | bare            | keywords                     |
| daterangepicker         | A bare head / D artifact · daterangepicker.com p1             | <100   | 250        | 13  | daterangepicker | title (embedded), keywords   |
| react date range picker | C stack · npmjs.com/package/react-date-range p1               | n/a\*  | 200        | 13  | picker          | title, description, keywords |
| range picker            | B behaviour (shortened) · heroui.com p1                       | >100   | 150        | 0   | picker          | keywords                     |
| date range picker react | C stack (reversed) · npmjs.com/package/react-date-range p1    | n/a\*  | 100        | 12  | picker          | keywords                     |
| react date range        | C stack · npmjs.com/package/react-date-range p1               | n/a\*  | 70         | 12  | picker          | keywords, faq                |
| daterange               | A alt spelling · daterangepicker.com p1                       | n/a\*  | 50         | 9   | daterangepicker | keywords                     |
| date range selector     | B alt naming · designsystem.digital.gov p3                    | n/a\*  | 40         | 9   | bare            | keywords                     |
| daterange picker        | A/D alt spacing · designsystem.digital.gov p3                 | n/a\*  | 40         | 51  | daterangepicker | keywords                     |
| daterangepicker react   | C stack · npmjs.com/package/react-date-range p1 (heroui p5)   | n/a\*  | 20         | 9   | daterangepicker | keywords                     |
| react daterangepicker   | C stack · tremor.so p6 (infragistics-react p4)                | n/a\*  | 20         | 3   | daterangepicker | keywords, faq                |

\* Not seeded through `generator` (three-word / low-signal seeds return nothing per the tool's own
limit); these surfaced only as rows in a competitor's own `traffic` keyword table, which is a real
integer, not a bucket, so the >=20 gate still applies to a directly observed number.

Proven but not shipped (12 items ship a tight array; `range date` is real traffic on an unnatural
word order, kept out of the array on purpose):

- `range date` 40/mo (designsystem.digital.gov p7) - genuine traffic, backwards phrasing no one
  would want to see in a title or a sentence; recorded here so a future pass doesn't re-mine it
  and ship it by accident.

Failed the >=20 gate outright: none of the seeded on-topic rows landed under 20 and got dropped -
every on-topic keyword this round either cleared the gate or was rejected on subject-match grounds
below, never on a sub-20 number.

## Rejected clusters

### Package names and other-stack, rejected as brand terms

All real traffic, rejected on the same convention `date-field` used for `react-datepicker` /
`bootstrap datepicker` / `jquery datepicker`:

`react-date-range` 200/mo (npmjs.com p1 - the hypeserver/react-date-range package's own listing),
`mui date range picker` 150/mo, `bootstrap date range picker` 50/mo, `angular date range picker`
30/mo, `date range picker angular` 20/mo, `angular material date range picker` 20/mo,
`daterangepicker jquery` 30/mo, `jquery daterangepicker` 20/mo, `daterangepicker js` 30/mo (every
ranking source for this exact phrase is the dangrossman/daterangepicker.js jQuery-plugin ecosystem
specifically, not a generic "a picker built in JS").

### Different subject - full scheduling/booking systems, not a date-range input

The single biggest correction this round. The brief's territory grant and Angle I both pointed here
hard, and the generator buckets looked promising (`booking calendar` >100, `availability calendar`

> 100, `hotel booking` >10K) - but a fresh `serp` pull on each shows zero component-library docs
> pages in the field:

- **`booking calendar`** (top 7): wpbookingcalendar.com p1, Google Workspace appointment
  scheduling p2, Calendly p3, wordpress.org/plugins/booking p4, Microsoft 365 booking app p5,
  Google Calendar appointment-slots support page p6, Square Appointments p7. Every result is a
  scheduling **SaaS product or a WordPress plugin** with its own staff calendar and appointment
  backend - a different artifact from an input field that hands back a `{ start, end }` pair. Its
  sub-cluster (`online/hotel/room/appointment booking calendar`, `wp/woocommerce booking calendar
plugin`, `salesforce/hubspot booking calendar`) reads the same way.
- **`availability calendar`** (top 9): availabilitycalendar.com, when2meet.com, Virto shift
  scheduling, Google Workspace appointment scheduling, Calendly, availcalendar.com,
  whenavailable.com, doodle.com. "When is X free" meeting/shift tools, same wrong-artifact call.
- **`hotel booking`** and its sub-cluster (`hotel booking sites/app/website`, `trivago/agoda/aaa
hotel booking`, `how to build a hotel booking website`): consumer travel-booking intent or
  "build me a whole booking website" - never a search for a form component. >10K bucket, real
  volume, wrong subject.
- **`vacation dates`**: purely informational school/vacation-calendar-by-country search
  (`italy summer vacation dates`, `japan school summer vacation dates`), no component intent.
- **`reporting period`**: an insurance/accounting/legal-CLE compliance term (`extended reporting
period tail coverage`, `ias 10 events after the reporting period`, `gst/hst reporting period`,
  per-state `cle reporting period`) - the literal words match, the subject is a claims-made
  insurance policy window, not a UI date filter. Same trap shape as `date-field`'s `date format`.
- **`analytics dashboard`** and its sub-cluster: names the whole BI product (`google analytics
dashboard`, `marketing/social-media/hr analytics dashboard`), not a date-range control inside
  one. >1K bucket, wrong artifact.
- **`check in` / `check out`** and sub-clusters: airline check-in (`southwest/delta/united/american
check in`, >10K-1K bucket), literal paper checks (`how to write/fill out a check`), hotel
  check-out time policy (`what time is hotel check out`) - travel-procedure and banking homographs.
  `check in check out picker`, the exact phrase the territory brief named, returned **zero SERP
  rows** on a direct test - unprovable, not shipped.
- **`select dates`**: dominated by a SQL sub-cluster (`select dates between two dates in sql`,
  `sql select where date between two dates`) - a WHERE-clause question, not a UI search. Two
  genuinely on-topic rows survived out of this seed and are used as FAQ raw material instead of
  keywords - see **FAQ sourcing**.
- **`date filter`**: filtering an existing inbox/sheet/feed by date inside someone else's product
  (Gmail, Outlook, Google Sheets, LinkedIn, Tableau, Power BI, ag-Grid) - not a component to add to
  your own app.

These are documented here, not merely dropped, so a future pass on any of the four date/time pages
doesn't re-mine and re-litigate them.

### Different subject - homograph

- **`date range`'s own zodiac/generational flood**: `cancer/leo/gemini/pisces/scorpio/libra/
aquarius/taurus/capricorn/virgo date range` (>1K/>100 bucket each) and `millennial/gen z/gen x date
range` - astrology sign date windows and generational cutoffs. The bare term still ships (see
  Kept) because `daterangepicker.com` provably ranks inside the same live SERP at p3 - but the title
  and lede never use it standalone, only inside `React date range picker`.
- **`pick dates`** (the whole seed): an old MTV dating show ("the show where parents pick dates"),
  literal date-fruit ripeness (`when are dates ripe to pick`), Powerball, Easter-date trivia - zero
  usable rows, worst seed of the round.
- **`range picker`'s own golf/robot noise**: `golf range picker`, `robot range picker`, `driving
range picker`, `robotic range picker`, `2026 yamaha umax range picker` - a driving-range ball
  robot and a Yamaha vehicle accessory, not UI. Kept in the array anyway because, unlike the zodiac
  case, the actual top-ranking page for bare `range picker` is HeroUI's date-range-picker doc at p1
  - the golf/robot reading loses the real SERP even though it dominates the generator's raw idea
    list.
- **`excel`, `figma`** (both full seeds, the F-platform angle): returned 100% brand/product noise -
  spreadsheet features (`vlookup excel`, `pivot tables in excel`) and the design tool/company
  (`figma pricing`, `is figma down`, `who owns figma`). Neither seed produced a single date-range
  idea. Recorded so a future F-angle pass tries different platform words instead of repeating these.
- **`date range calculator`** (>1K): a duration/day-count calculator - the search wants a number
  (days between two dates), not a component to embed. Same shape as `date-field`'s `date format`
  rejection.
- **`react range slider` / `react range selector` / `react range column chart` / `react range area
chart`**: a numeric dual-handle slider or a chart axis range - a different component on the word
  "range," unrelated to dates.
- **`react-date-range calendar showndate prop`, `...disabledday prop`**: the prop API of the
  specific `react-date-range` npm package - competitor documentation search, not generic.

### Untestable - granted territory, no provable data

- **`range calendar`**: `serp` returned zero rows on two separate attempts (retried per the
  empty-table-is-a-signal rule, not treated as a fluke). No ranking URL existed to run `traffic`
  against. Explicitly granted territory, but nothing here proves it.
- **`check in check out picker`**: same - zero SERP rows on the direct test, no traffic to mine.

## FAQ sourcing

Generator's `questions` arrays were thin this round - most seeds' question rows were homograph noise
(Gmail/Outlook date-filter questions, MTV-show trivia, fitness range-of-motion). Two of six answers
are grounded in verbatim rows anyway; the rest are authored straight from the source, same as
`date-field`'s keyboard FAQ:

| shipped question                                                   | verbatim source rows                                                                                                                                             | angle              |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| How do I add a date range picker to a React or Next.js form?       | authored - no on-topic verbatim row landed here this round                                                                                                       | E trigger          |
| Why doesn't onChange fire after I click the first day?             | `daterangepicker event when date is selected`; answers the mechanic named in the component's own `onChange` JSDoc                                                | B behaviour        |
| How do I disable past dates or cap the picker to a min/max window? | authored - mirrors the proven min/max pattern already established on `date-field`                                                                                | E trigger          |
| Does it have quick presets like Last 7 days or This month?         | `what is the widget to select dates called?`, `how to select multiple dates on airbnb calendar`, `how to select flexible dates on google flights`, `...on kayak` | I product use case |
| Does it need dayjs, date-fns or Moment for the range math?         | mirrors `date-field`'s own proven dependency-question pattern, re-verified against this component's own math                                                     | G shopping         |
| Can you pick a date range with the keyboard alone?                 | authored - no verbatim row; covers the a11y invariant                                                                                                            | invariant          |

The Angle I brief called product use case "unusually strong" for this page, and the keyword mining
disagreed - `booking calendar`, `hotel booking` and `analytics dashboard` all resolved to a
different artifact on fresh SERP evidence (see Rejected clusters). The angle still earns its place
honestly: the `select dates` seed's own verbatim rows show real people asking how to pick a range on
Airbnb's calendar and how to select flexible dates on Google Flights / Kayak, and the component's
built-in presets (`Today`, `Yesterday`, `Last 7 days`, `Last 30 days`, `This month`, `Last month`,
`Last 90 days`, `Year to date`) are literally the same vocabulary a booking form or an analytics
dashboard already uses. That went into FAQ 4 and the lede as prose, grounded in verbatim search
behaviour and the component's real feature set, without claiming keyword rank the evidence doesn't
support.

## Claim provenance

Every FAQ claim is read off the source, not inferred:

- Two-tap, auto-ordering, commit-only-on-complete - `DateRangeFieldProps.onChange` JSDoc in
  `src/components/composites/date-picker/DateRangeField.tsx` ("Fires only on a COMPLETE range - a
  lone anchor never commits"); `pickDay()` in `range-panel.tsx` sets `anchor` on the first click,
  then on the second click computes `start = anchor < key ? anchor : key` / `end = anchor < key ?
key : anchor` before calling `commit({ start, end })` - order of clicking never matters.
- `DateRange` value shape - `export interface DateRange { start: string; end: string }` in
  `range-panel.tsx`; both fields are `'YYYY-MM-DD'` via `toKey()` in `date-utils.ts`; `value` /
  `defaultValue` on `DateRangeFieldProps` are typed `DateRange | null`.
- Hover preview before commit - while `anchor` is set and no second pick has happened, `lo`/`hi` are
  derived from `hoverKey || anchor` with `provisional = true`, rendering the ghost-capped band
  (`zc-is-cap-ghost`) live as the pointer or keyboard focus moves.
- Popover / Sheet responsive switch at 640px - `DateRangeField.tsx`: `useMediaQuery('(max-width:
640px)')` drives `narrow`, which picks `<Sheet side="bottom">` over `<Popover side="bottom"
align="start">` and drops `months` from 2 to 1.
- min/max inclusive, month arrows disable at the bound - `within()` in `date-utils.ts` gates
  `inBounds()`; in `range-panel.tsx`'s `renderMonth`, the prev/next buttons carry `disabled={min &&
prevEnd < min}` / `disabled={max && nextStart > max}`.
- `timezone` is display-only - `tzLabel()` (shared with `DateField`) formats the footer's GMT-offset
  label and is never read by `pickDay`, `applyPreset` or `commit`.
- Eight presets, exact labels - `drpPresets()` in `range-panel.tsx` returns Today, Yesterday, Last 7
  days, Last 30 days, This month, Last month, Last 90 days, Year to date; `applyPreset()` calls
  `commit({ start: p.start, end: p.end })` directly, skipping the anchor step.
- Day-count readout - `drpDays()` computes `Math.round((+parse(end) - +parse(start)) / 86400000) +
1`, rendered in the panel footer next to `drpRangeText()`.
- Zero dependencies - root `package.json` has no `dependencies` key, only `react`/`react-dom` `^19`
  peers (verified fresh this round, same as `date-field`'s claim). Range math is plain string
  comparison and built-in `Date`; `Intl.DateTimeFormat` appears once, inside `tzLabel`.
- Keyboard + a11y - `onGridKeyDown` in `range-panel.tsx` handles Arrow/PageUp/PageDown/Enter
  (`pickDay(focusKey)`)/Space/Escape (clears `anchor`/`hoverKey` only, does not call `close()`);
  `role="grid"` on `.zc-dtp__days`, `role="gridcell"` with a full-date `aria-label` on each day button,
  `role="dialog"` labelled by `label` (falls back to `'Pick a date range'`); roving focus via the
  shared `useDayFocus` hook.
- Reduced motion - the month-slide keyframe (`drp-month-in-l` / `drp-month-in-r`) in
  `date-picker.css` sits entirely inside `@media (prefers-reduced-motion: no-preference)`, so it is
  skipped outright (not merely shortened) under reduced motion; the `Motion` `layoutId` pill between
  the start/end caps uses `UIMotion.t.settle`, which resolves through the same `--duration-*` tokens
  `src/tokens/motion.css` collapses to `1ms` under the same media query.

One pre-existing inconsistency worth flagging, not fixed here (out of this task's scope - two files
only): `apps/docs/content/registry.tsx`'s `date-range` entry's `heroCode` string uses
`startDate={start} endDate={end} onRangeChange={setRange}`, which does not match the component's
actual props (`value`, `defaultValue`, `onChange` returning a `DateRange`). Every code sample in
this record and in `date-range.ts` uses the verified real API instead.

## Tooling

`kwr` mint server on `127.0.0.1:9502`. No throttling this round - every batch returned varied real
numbers (never all-zero), so no known-good control run was needed. Two URLs
(`m3.material.io/components/date-pickers`, `untitledui.com/react/components/date-pickers`) returned
`?/mo` on every one of two attempts each, both times sitting in a batch alongside rows that returned
real numbers - not a throttle, marked `n/a` and excluded from the Kept table's proof column (neither
was load-bearing for a shipped keyword; `untitledui.com` is cited in the Rejected-clusters discussion
only via its `serp` ranking position, not a traffic number). All 12 `kd` candidates returned real
scores on the first attempt.

Raw artifacts:
`/tmp/claude-1000/-home-tabsir-ap-reactp-zyncat-ui/84d4d32b-155d-4e54-921b-e491cc040419/scratchpad/seo/date-range/`
(`seeds.json`, `merged.json`, `merged_sorted.txt`, `serp.json`, `traffic1.json`, `traffic2.json`,
`traffic3.json`, `kd.json`, plus the `plan-*.json` batch inputs for each step).
