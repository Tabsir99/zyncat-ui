# datetime-field - SEO record

Page: https://ui.zyncat.app/datetime-field · Component: `DateTimeField` (`@zyncat/ui/datetime-field`)

Second of four date/time pages. Reads `date-field.md` first - this page owns date+time-together
ground only; date-only, range and time-only stay fenced off to `date-field`, `date-range` and
`time-field` per the brief that launched this run.

## Primary and secondary

| role                 | keyword               | proven traffic | best competitor position | proof URL                                      | kd  |
| -------------------- | --------------------- | -------------- | ------------------------ | ---------------------------------------------- | --- |
| primary              | react datetime picker | 150/mo         | p1                       | npmjs.com/package/react-datetime-picker        | 12  |
| primary (title head) | date time picker      | 150/mo         | p1                       | mui.com/x/react-date-pickers/date-time-picker/ | 3   |
| secondary            | datetimepicker (bare) | 200/mo         | p1                       | mui.com/x/react-date-pickers/date-time-picker/ | 17  |
| secondary            | react datetimepicker  | 100/mo         | p1                       | npmjs.com/package/react-datetime-picker        | 7   |
| secondary            | date and time picker  | 90/mo          | p1                       | mui.com/x/react-date-pickers/date-time-picker/ | 1   |
| secondary            | datetime-local        | 70/mo          | p9                       | dofactory.com/html/input/datetime-local        | 0   |

This niche is small and easy: every KD that returned a number came back under 20 (`date and time
picker` KD 1, `datetime-local` KD 0), confirming the skill's "under 20 is winnable" bar with room
to spare - the whole cluster is winnable, not just the head.

## Kept

| keyword                | source                                                                                                                  | volume | traffic/mo | kd                | cluster      | placed in                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------ | ---------- | ----------------- | ------------ | ---------------------------------------------------- |
| datetimepicker         | A bare head (compound) · mui.com/x/react-date-pickers/date-time-picker/ p1, lightningdesignsystem.com p1                | <100   | 200        | 17                | datetime     | keywords                                             |
| react datetime picker  | C stack · npmjs.com/package/react-datetime-picker p1, github.com/arqex/react-datetime p6, telerik.com p8, dev.to p5     | >100   | 150        | 12                | datetime     | title, description, lede, keywords, faq              |
| date time picker       | A bare head (spaced) · mui.com/x/react-date-pickers/date-time-picker/ p1, lightningdesignsystem.com p1                  | <100   | 150        | 3                 | datetime     | title, keywords                                      |
| react datetimepicker   | C stack · npmjs.com/package/react-datetime-picker p1, github p3, telerik p6, dev.to p10                                 | <100   | 100        | 7                 | datetime     | keywords                                             |
| date and time picker   | B behaviour · mui.com/x/react-date-pickers/date-time-picker/ p1, atlassian.design/components/datetime-picker p3         | <100   | 90         | 1                 | datetime     | description, keywords                                |
| react date time picker | C stack · npmjs.com/package/react-datetime-picker p1, telerik p8, dev.to p6                                             | <100   | 70         | 12                | datetime     | keywords                                             |
| datetime-local         | F platform · dofactory.com/html/input/datetime-local p9                                                                 | <100   | 70         | 0                 | native input | keywords, faq                                        |
| datetime picker        | A bare head · npmjs.com p4, developer.mozilla.org/.../input/datetime-local p3, ui.refinitiv.com p9, atlassian.design p7 | <100   | 60-70      | 11                | datetime     | title (as "date time picker"), description, keywords |
| react date time        | C stack · github.com/arqex/react-datetime p1, telerik.com p6                                                            | <100   | 20         | 4                 | datetime     | keywords                                             |
| datepicker with time   | B behaviour · ui.refinitiv.com/elements/datetime-picker p4                                                              | <100   | 20         | n/a (see Tooling) | datetime     | keywords                                             |
| html datetime          | F platform · developer.mozilla.org/.../input/datetime-local p1                                                          | <100   | 20         | 3                 | native input | keywords                                             |

`datetime picker` cited twice in the mine at 60/mo (npmjs, MDN, refinitiv) and once at 70/mo
(atlassian) - both real, both from independent competitor pages; the table above uses the
lower, more-repeated figure as the conservative proof point.

Proven but not shipped (kept the array at 11 rather than pad to 15 - the proven universe here is
genuinely smaller than date-field's): `react datetime` 20/mo (github.com/arqex/react-datetime p1) -
one keyword short of the already-shipped `react date time`, dropped as near-duplicate rather than
padding the array with a spacing variant.

Failed the >=20 gate, dropped: `html5 datetime picker` 10/mo (MDN), `datetime picker react` 10/mo
(dev.to), `vaadin date picker` 0/mo (vaadin.com).

## Rejected clusters

### Sibling-owned - do not claim on this page

Per the launch brief, confirmed against `date-field.md`'s own fence:

| cluster                                                                                                     | proven traffic seen                                                                                                          | owner          |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `date picker`, `react date picker`, `react calendar`, `calendar component`, `date input`, `input type date` | `html input type date` 80/mo on the very MDN datetime-local page I mined (developer.mozilla.org/.../input/datetime-local p9) | **date-field** |
| `date range picker`, `booking calendar`, `range calendar`                                                   | not remeasured this round                                                                                                    | **date-range** |
| `time picker`, `react time picker`, `input type time`, `clock input`                                        | `time picker react` 50/mo (telerik.com p10, dev.to p8), `time picker ui` 150/mo (atlassian.design p6)                        | **time-field** |

The MDN datetime-local reference page ranking for date-field's own `input type date` (p9, 80/mo)
is the same cross-ranking pattern date-field.md flagged for untitledui and rsuite - one page,
several siblings' keywords. Left on the table for date-field, not reopened here.

### Different subject - homograph, the trap in this mine

Bare `datetime` was the single highest-volume seed run (`datetime` >1K, `datetime format` >1K,
`datetime python` >1K, `pandas to_datetime` >1K) and it is not this component - it is the Python
`datetime` module and pandas' `to_datetime` function. Same shape as date-field's bare `calendar`
warning, and the reason every shipped keyword here is qualified (`react `, `date and time `, a
platform prefix) rather than the bare noun.

Five more full clusters mined and rejected as different subjects, in descending volume:

- **`unix timestamp`** (>1K, the highest-traffic cluster in the entire mine: `unix timestamp
converter` >1K, `unix timestamp` >1K, plus a wall of `what date is unix timestamp <number>`
  and Discord-formatting questions). An epoch-to-date **converter** tool, not a picker. Tempting
  because `timestamp picker` sits one word away lexically - rejected anyway; see below.
- **`date time`** bare (>1K) - pop-culture release-date queries (`nba 2k26 release date time`,
  `super bowl 2026 date time`, `forza horizon 6 release date time`), `date time calculator`
  (>1K), and OS clock-setting questions (`how to change date and time on iphone/mac`, `windows 11
how to change date time format`). The spaced two-word bare form is a reference/pop-culture
  homograph exactly like unqualified `calendar` was for date-field - never shipped bare.
- **`sql datetime`** (>100 per sub-term) - SQL column type and query syntax
  (`sql datetime to string`, `sql datetime vs timestamp`, `sql select datetime between`). A
  database data type, not a UI control.
- **`datetime type`** (>100 per sub-term) - programming-language type systems (C#, Python, Go,
  TypeScript, GraphQL, MySQL/Postgres/SQLite column types: `what data type is datetime`). Type
  reference, not a picker.
- **`select datetime`** - 100% SQL `SELECT ... WHERE datetime` syntax across MySQL/Postgres/
  Oracle/SQL Server. Seeded on the B-behaviour angle expecting "select a datetime" UI intent;
  returned zero UI intent.
- **`iso datetime`** - format reference (`what does z mean in iso 8601 datetime`, `python parse
iso datetime`, `zod iso datetime`), not a component. Same "format reference, not a component"
  trap date-field logged for `date format`. The fact still earns its place in FAQ 2: the
  committed value is deliberately the `datetime-local` **local** profile (no `Z`, no offset), not
  full ISO 8601 with a timezone designator - worth being precise about in prose even though the
  keyword itself is rejected.

### This component's own name is a homograph

`datetime field` (the literal component subpath) is dominated by backend ORM model-field types -
Django (`datetime field django`, `django datetime field format`), Rails, Pydantic, SQLAlchemy,
msgspec, plus Salesforce formula fields and raw SQL column updates
(`how to get time from datetime field in salesforce formula`). A class called `DateTimeField` in
a backend framework, not a frontend picker. Same trap date-field flagged for bare `date field`
(the Microsoft Word/watch homograph) - rejected here for the same reason, on this page's own name.
`datetime widget` was checked alongside it and is the same story one level down (Django admin/
form widget classes, Drupal, Flutter), plus it's uniformly `<100` per sub-term - rejected.

### Zero SERP, zero evidence - named in the brief but not provable

- **`timestamp picker`** - the brief names this as owned ground. `serp timestamp picker` returned
  **zero** ranking entries (no stable top-10 exists for the exact phrase), the `generator` seed
  returned exactly one idea (itself, `<100`), and it never appeared as a `topKeywords` row on any
  of the 17 URLs traffic-mined this round. Territory grants first claim, not exemption from the
  > =20 proof gate - there is no URL to point `traffic` at, so there is no evidence, so it is not
  > shipped. `kd` was attempted three times and returned `null` every time (see Tooling); mark
  > `kd n/a`. Kept out of the array entirely rather than shipped on the strength of the brief alone.
- **`appointment picker`** and **`datetime component`** - both legitimate on-topic angles (I
  product-use-case and D artifact) that returned **zero** SERP entries when tested directly. No
  ranking page, no traffic evidence, dropped for the same reason as `timestamp picker`.

### Competitor-brand and other-platform qualified

Package/brand names, rejected as brand terms even though they clear the gate:
`react-datetime-picker` (20/mo, npmjs.com p1 - the exact package name) and `react-datetime`
(the arqex package on github, folded into the bare `react datetime` figure above). Same policy
date-field applied to `react-datepicker`/`react-calendar`.

Other-platform, rejected: `@react-native-community/datetimepicker` (100/mo) and
`react-native-community/datetimepicker` (30/mo, both on docs.expo.dev) plus `expo date picker`
(30/mo) - React Native/Expo, not web. `android datetime picker`, `xamarin datetime picker`,
`android compose time-pickers` (developer.android.com) - native mobile. Microsoft's
`system.windows.forms.datetimepicker` (learn.microsoft.com) - desktop .NET WinForms.

Competitor-brand qualified, rejected: `mui date time picker` (50/mo) and `mui datetimepicker`
(40/mo, both on mui.com itself), `lightning-formatted-date-time` (30/mo, Salesforce LWC tag name),
`flatpickr` / `flatpickr example` / `react-flatpickr` / `datepicker plugin` (flatpickr.js.org - a
specific competing vanilla-JS library, and its broader keyword profile skews date-only, closer to
date-field's stack-word ground than this page's).

Design-inspiration intent, rejected (different searcher goal, not "get this component"):
`time picker ui` (150/mo, atlassian.design - also sibling-owned, see above), `date and time ui`
(30/mo), `date and time design` (50/mo) - Dribbble/Mobbin-style visual-inspiration browsing.

### Ambiguous terms resolved to the datetime-together reading

Recorded so `date-range` and `time-field` do not re-litigate them:

- **`datetimepicker` (bare, one word) / `datetime picker` / `date time picker` / `date and time
picker` - kept here.** Every one of these describes a single control that resolves both a date
  and a time in one interaction, which is exactly `DateTimeField`'s popover (`DtpPanel` plus the
  `TimeSegments` slot) - not two separate controls, not a range.
- **`datetime-local` - kept here.** `DateTimeField`'s committed value (`'YYYY-MM-DDTHH:mm'`) is
  byte-for-byte the native `<input type="datetime-local">` value format. `date-field` mapped to
  `<input type="date">`; `time-field`'s presumed native counterpart is `<input type="time">`. No
  overlap between the three.
- **`datepicker with time` - kept here, despite containing "datepicker."** The literal proven
  string (ui.refinitiv.com p4) is one word "datepicker" plus "with time" - date-field owns bare
  `datepicker`, but the full phrase's intent (a date picker that _also_ does time) is unambiguously
  this page's subject; the trailing qualifier changes searcher intent decisively, the same way
  date-field kept `date picker in react` despite containing "date picker."

## FAQ sourcing

Two of the six questions have direct verbatim roots in the `generator` question rows; the rest
answer real behavioural questions the props raise, same as date-field's authored keyboard FAQ:

| shipped question                                                                  | verbatim source rows                                                                                                                                                        | angle      |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| How do I add a combined date and time picker to a React form?                     | (no verbatim row - `date time picker` seed's questions were all Excel/Google-Sheets flavoured) authored for the E-trigger angle, covers the commit-on-both-halves behaviour | E trigger  |
| Why is the value a string like '2026-09-02T14:30' instead of a Date object?       | `how to set value for input type datetime-local`, `how to change datetime-local format`                                                                                     | F format   |
| Can I limit the time picker to a window on a specific day, not just a date range? | authored - covers the min/max-on-time-of-day behaviour, a prop shape unique to this component                                                                               | E trigger  |
| Does the timezone prop convert the time I pick?                                   | authored - covers the invariant the brief specifically asked to verify from source, not by analogy                                                                          | invariant  |
| Does it need dayjs, date-fns or Moment for the time math?                         | (no verbatim row this round) mirrors date-field's own zero-deps FAQ for family consistency                                                                                  | G shopping |
| Can I type the time instead of clicking, or only use the arrow keys?              | authored - covers the `TimeSegments` spinbutton a11y, this component's own invariant                                                                                        | invariant  |

The `date time picker` seed's question rows (`how to add date and time picker in excel`, `...in
google sheets`, `how to add microsoft date and time picker control`) are Excel/Office-flavoured,
not React - read for the underlying E-trigger shape ("how do I add this") rather than quoted, same
adaptation date-field made for its own off-platform verbatim rows.

## Claim provenance

Every FAQ claim is read off the source, not inferred:

- Popover + segmented time slot -
  `src/components/composites/date-picker/DateTimeField.tsx` wraps `DtpPanel` in
  `<Popover side="bottom" align="start">` and passes a `slot` containing `<TimeSegments>`
  (`time-core.tsx`) inside a `.zc-dtp__time` wrapper.
- `'YYYY-MM-DDTHH:mm'` value, commit only when both halves exist - `DateTimeFieldProps.value` /
  `defaultValue` JSDoc; `commitIf(d, t)` returns early `if (!d || !t)`, confirmed by reading the
  full function (lines 95-103 of `DateTimeField.tsx`).
- `'use client'` on `DateTimeField.tsx`, `calendar-panel.tsx`, `time-core.tsx`, `field-shell.tsx` -
  App Router-ready, same as date-field.
- min/max accept either shape, time-of-day clamp only on the boundary date -
  `dttfSplit(min)`/`dttfSplit(max)` in `DateTimeField.tsx`; `minTime`/`maxTime` computed as
  `date === minL.date ? minL.time : null` (and the `max` mirror); passed into `TimeSegments`'
  `min`/`max` props, clamped in `tryCommit()` (`time-core.tsx` lines 93-94).
- `timezone` is display-only - `DateTimeFieldProps.timezone` JSDoc says so verbatim ("display
  context, shown in the footer"); `DtpPanel` renders `tzLabel(timezone, selKey)` only inside the
  footer (`calendar-panel.tsx` line 222); `tzLabel()` (`date-utils.ts` lines 47-56) builds a
  `GMT` offset string via `Intl.DateTimeFormat(..., { timeZoneName: 'shortOffset' })` and never
  touches `commit`/`val`. Verified directly from this component's own source, not by analogy to
  `DateField`.
- `format` display-only, storage stays 24h - `DateTimeFieldProps.format` JSDoc states it
  explicitly; `disp12()` in `time-core.tsx` converts only the displayed hour text, `tryCommit`
  always stores 24h `pad(nh) + ':' + pad(nm)`.
- `minuteStep` - `TimeSegmentsProps.minuteStep`, default `5`; used only in the `ArrowUp`/
  `ArrowDown` handler for the minute segment (`onMKey`, `time-core.tsx` lines 154-166); typed
  digits bypass it entirely (`onHKey`/`onMKey`'s digit branch).
- Zero dependencies, React 19 peer only - root `package.json` has no `dependencies` key (checked
  directly with `json.load`, not grep), `peerDependencies` is exactly `{"react": "^19",
"react-dom": "^19"}`. `date-utils.ts` has zero imports; `time-core.tsx` imports only React and
  two internal helpers; `Intl.DateTimeFormat` appears once, inside `tzLabel`.
- Keyboard - calendar grid: `onGridKeyDown` in `calendar-panel.tsx` (shared with `DateField`,
  confirmed same file). Time segments: `role="spinbutton"` per segment with full
  `aria-valuemin/max/now/text` (`time-core.tsx` lines 244-289); digit-typing two-digit buffer via
  `tsgFeed()` (lines 32-38) auto-advances focus on completion (`onHKey`/`onMKey`); `ArrowUp`/
  `ArrowDown` step; `Backspace`/`Delete` clears; `ArrowLeft`/`ArrowRight` moves between segments;
  paste parses `H:MM[am/pm]`-shaped text via regex (`onPaste`, lines 206-221) - "3:45 PM" traced
  through by hand against the regex and `tsgToH24`.
- Reduced motion - shared with `DateField`: `src/tokens/motion.css` collapses every
  `--duration-*` to `1ms` under `prefers-reduced-motion: reduce`, flipping `UIMotion.reduced` and
  settling the month-slide `animate()` call and the `Motion` `layoutId` pill at `duration: 0`.
  `TimeSegments` itself runs no WAAPI animation - pure keyboard/DOM state.

## Tooling

`kwr` mint server on `127.0.0.1:9502` (per this run's override), `--country us`. No throttling
observed - every batch this round returned real integers on the first pass, unlike date-field's
run. Two URLs (`rsuitejs.com/components/date-picker/`, `untitledui.com/react/components/
date-pickers`) returned `monthlyTrafficRaw: 0` with an empty `topKeywords` array; not a throttle
signal, since every other URL in the same two batches (14 of 16) returned rich non-zero data in
the same run - these two pages simply have no Ahrefs-tracked keywords in common with this mine's
candidate set.

Four `kd` targets returned `null` on all three attempts (the retry-twice-more rule in the brief):
`date picker with time` (the natural-language proxy for the shipped exact string `datepicker with
time`), `react datetime component`, `timestamp picker`, `datetime field react`. All four are
either already excluded from the shipped array (`timestamp picker`, `react datetime component`,
`datetime field react` - see Rejected clusters) or stand in for a shipped keyword whose own KD
call is what's recorded in the Kept table (`datepicker with time`). Marked `kd n/a`, no numeric
score obtained for any of the four.

Raw artifacts:
`/tmp/claude-1000/-home-tabsir-ap-reactp-zyncat-ui/84d4d32b-155d-4e54-921b-e491cc040419/scratchpad/seo/datetime-field/`
(`seeds.json`/`.md`, `merge.py`, `serp.json`/`.md`, `serp2.json`/`.md`, `traffic1.json`/`.md`,
`traffic2.json`/`.md`, `traffic-atlassian.json`/`.md`, `kd.json`/`.md`, `kd-retry1.json`,
`kd-retry2.json`).
