# time-field - SEO record

Page: https://ui.zyncat.app/time-field · Component: `TimeField` (`@zyncat/ui/time-field`)

Fourth of four date/time pages. `date-field` shipped first and fenced off `time picker`, `react
time picker`, `input type time`, `clock input`, `time input`, `12 hour time picker`, `time
selector`, `hour minute picker` as this page's ground - see `docs/seo/date-field.md`. `datetime-field`
and `date-range` have not shipped yet; nothing here claims their ground (`datetime picker`, `date
time picker`, `datetime-local`, `date range picker`, `booking calendar`).

## The homograph call - read this first

The brief warned that bare `time` is one of the highest-volume, least relevant words on the web,
and the `generator` mine proved it harder than expected. Every seed built from a generic English
word collapsed into real-world literal search intent, not component search intent:

- `time` itself: 1M+/mo, entirely `what time is it`, `time in india`, `military time`, `adventure
time`, `time change 2026` - zero component signal.
- `opening hours`, `booking time`, `appointment time`, `meeting time`, `schedule time`, `alarm
time`, `reminder time`, `send time`, `publish time`, `book appointment` - the full angle-E
  (trigger moment) seed set - returned **zero** on-topic rows across roughly 180 keyword ideas.
  Every single one resolved to people checking a literal time (Walmart's opening hours, a DMV
  appointment, the FOMC meeting, Outlook's default reminder offset, Klaviyo send-time
  optimization), never to someone searching for a picker component. This contradicts the general
  heuristic that E carries volume - it does not for this subject, and the brief's own homograph
  warning is why that was checked instead of assumed.
- `clock input` (explicitly granted territory): serp returned **0 results** - untracked. The
  generator seed was dominated by digital electronics (flip-flop clock-signal pins, DAC/audio-gear
  10MHz clock inputs, Arduino, HackRF). Rejected outright, joining `odometer` and `otp` as bare
  terms that lose to a homograph.
- `time field` (the component's own name): generator noise was Airtable's Created-time column,
  Salesforce/Rockset schema docs, NFL/NBA "field goal" stat pages and library-assistant job
  listings. But `serp time field` p1 is `react-aria.adobe.com/TimeField` - Adobe React Aria ships a
  component with the exact same name - so unlike `date field` (rejected outright in the sibling
  record as a Word/watch homograph with no component-search reading at all), this term has a real,
  proven component-search reading alongside the noise. Kept, with the mixed picture documented
  below.
- `12 hour time picker`, `hour minute picker` (explicitly granted territory), `time picker npm`,
  `best time picker`: all serp'd 0 results - untracked, no provable volume either direction. Used
  in FAQ prose (format prop, minuteStep) since they describe real props; not shipped as keywords.

Where the homograph warning did **not** hold: the moment "time" is compounded into a genuine UI
noun - `time picker`, `timepicker`, `time selector`, `time input`, `html time picker` - the actual
Google SERP is clean. Every one of the 7 successful `serp` head-term calls returned 100% on-topic
design-system, npm-package and MDN/w3schools results, with no homograph bleed at all. The
contamination lives in the _generator_'s single-word-adjacent suggestions, not in the ranked SERP
for the compound phrases people actually type. Angle B (behaviour: `pick time`, `select time`,
`set time`) fared no better than E - `set time` collapsed into watch/appliance manuals and
certificate-of-deposit banking ("money stuck for a set time"); `pick time` into NFL/NBA/MLB draft
pick order; `select time` into SQL `SELECT TIME` and YouTube-downloader clip trimming. The angles
that actually produced this page's keywords were **D** (artifact: time picker/timepicker/time
field), **C** (stack: react time picker), and **F** (platform: html time picker/input type
time/time input) - not B or E as the brief predicted, and that reversal is the single most
important finding in this record for whoever mines the next time-adjacent page.

## Primary and secondary

| role      | keyword           | proven traffic | kd          | best competitor position | proof URL                                  |
| --------- | ----------------- | -------------- | ----------- | ------------------------ | ------------------------------------------ |
| primary   | timepicker        | 1,300/mo       | 18 (medium) | p2                       | developer.android.com/.../time-pickers     |
| primary   | time picker       | 500/mo         | 16 (medium) | p2                       | m3.material.io/components/time-pickers     |
| secondary | react time picker | 400/mo         | 7 (easy)    | p1                       | mui.com/x/react-date-pickers/time-picker/  |
| secondary | html time picker  | 250/mo         | 0 (easy)    | p1                       | developer.mozilla.org/.../input/time       |
| secondary | html time input   | 250/mo         | 1 (easy)    | p4                       | bionicjulia.com/blog/html-time-input-field |

KD came back as real integers for all 15 title/description candidates this round - no throttle, no
`null`, unlike the sibling `date-field` run. See **Tooling**.

## Kept

| keyword           | source                                                                 | volume | traffic/mo | kd  | cluster      | placed in                         |
| ----------------- | ---------------------------------------------------------------------- | ------ | ---------- | --- | ------------ | --------------------------------- |
| timepicker        | serp+traffic (not a generator hit) · developer.android.com p2          | n/a    | 1300       | 18  | picker       | title, keywords                   |
| time picker       | A bare head · m3.material.io/components/time-pickers p2                | >100   | 500        | 16  | picker       | title, description, keywords, faq |
| react time picker | C stack · mui.com/x/react-date-pickers/time-picker/ p1                 | >100   | 400        | 7   | picker       | title, keywords                   |
| html time picker  | F platform · developer.mozilla.org/.../input/time p1                   | >100   | 250        | 0   | native input | keywords, faq                     |
| html time input   | F platform · bionicjulia.com/blog/html-time-input-field p4             | >100   | 250        | 1   | native input | title, keywords                   |
| time picker html  | serp+traffic (not a generator hit) · MDN p1                            | n/a    | 200        | 0   | native input | keywords                          |
| time picker ui    | D artifact · m3.material.io/components/time-pickers p3                 | <100   | 150        | 2   | picker       | keywords                          |
| input type time   | serp+traffic (not a generator hit; explicit territory) · MDN p1        | n/a    | 150        | 2   | native input | keywords, faq                     |
| input time        | serp+traffic (not a generator hit) · designsystem.digital.gov p6       | n/a    | 100        | 2   | native input | keywords                          |
| time field        | D artifact (component's own name) · react-aria.adobe.com/TimeField p1  | <100   | 100        | 0   | own-name     | keywords, faq                     |
| time picker react | D artifact · npmjs.com/package/react-time-picker p2                    | <100   | 50         | 6   | picker       | keywords                          |
| timefield         | serp+traffic (not a generator hit) · react-aria.adobe.com/TimeField p1 | n/a    | 50         | 2   | own-name     | keywords                          |
| time selector     | B behaviour (explicit territory) · designsystem.digital.gov p5         | <100   | 50         | 22  | picker       | keywords, faq                     |
| time input        | F platform (explicit territory) · designsystem.digital.gov p3          | <100   | 40         | 10  | native input | keywords, faq                     |
| react timepicker  | C stack · github.com/react-component/time-picker p3                    | n/a    | 30         | 6   | picker       | keywords                          |

Six of the fifteen (`timepicker`, `time picker html`, `input type time`, `input time`, `timefield`,
`react timepicker`) never surfaced as a `generator` idea at all - they were found only by mining
what actually ranks (`serp` the head terms, then `traffic` every ranking URL). `timepicker`, the
single highest-traffic keyword in the whole set, is one of them. This is the load-bearing reason
the skill mandates both mining passes: seed-matrix generation alone would have missed the best
keyword on the page.

Proven but not shipped (kept the array at 15; all clear the gate and are safe for a future pass):
`time input in html` 90, `input time in html` 90, `input type time 24 hour format` 70 (used in FAQ
instead), `time selector ui` 40, `time picker in react` 40, `react time picker component` 40,
`timepicker react` 40 (near-dupe of shipped `react timepicker`), `html input time` 40, `time ui`
30, `time picker in react js` 30, `time picker ux` 20, `time selection ui` 20, `react time picker
example` 20, `time input html` 20.

Failed the >=20 gate, dropped: `time picker in html` 10, `react time selector` 10, `input type time
12 hour format` 10, `input type=time 24 hour format` 0, `timepiker` (typo) 0.

## Rejected clusters

### Sibling-owned - do not claim on this page

Confirmed against `apps/docs/content/seo/date-field.ts` before seeding: `date picker` (1,100/mo,
m3.material.io p2) is date-field's primary and stays there. No date-only, datetime, or range terms
were seeded here.

### Different subject - homograph (bare `time`, and `time` + generic word)

The highest-volume ground in the entire mine is not this component, exactly as the brief predicted:

- `time` bare (>1M), `what time is it` (>100K), `time in india` / `india time` (>100K), `military
time` (>100K), `time calculator` (>100K), `time change` / `time change 2026` (>100K, daylight
  saving), `adventure time` (>100K, cartoon), `sunset time` (>100K), `once upon a time in
hollywood` (>100K), `part time jobs` (>100K). **Never put a bare `time` in this page's title or
  description.**
- `opening hours` cluster: `target opening hours`, `costco opening hours`, `walmart opening hours`,
  `disneyland opening hours` (all >1K) - literal store hours, not a component.
- `set time` cluster (>1K): `armitron watch set time`, `money market account money stuck for a set
time` (banking term-deposit sense of "time"), `how to set time on apple watch/fitbit/g-shock`.
- `meeting time` / `schedule time` clusters (>1K each): FOMC/Fed meeting times, Trump-Putin/Xi/
  Zelensky summit times, Grand Slam tennis and F1 schedules, Bank of America appointment scheduling.
- `appointment time`, `booking time`, `book appointment` clusters: DMV, dentist, doctor, Sephora,
  Aveda, IRCTC Tatkal train tickets, Disneyland Lightning Lane - literal service-booking intent.
- `alarm time`, `reminder time`: iPhone/Apple Watch alarm settings, Outlook default-reminder-offset
  support articles, an NYT crossword clue (`alarm time hour nyt`).
- `time library`: Python's/Java's `time` module, and separately part-time/full-time library-job
  listings and library story-time events - three unrelated readings, none a UI component.
- `time widget`: iPhone/Android/Notion/Windows 11 home-screen widgets and, more sharply, Screen
  Time/Digital Wellbeing usage-tracking widgets (`screen time widget` >100/mo) - same rejection
  shape as the sibling record's `calendar widget`, not a web form component.
- `time component`: Oracle/Snowflake date-datatype semantics ("does DATE include a time
  component"), aircraft maintenance ("hard time component"), generic "real-time" business jargon.
  One low-signal `time component react` row surfaced; not worth shipping alone.
- `react time` bare: rejected despite two independent proofs at exactly the 20/mo floor (npmjs.com
  p2, coreui.io p4). The generator cluster behind it is a second, React-specific homograph layer -
  `react time slicing` (React's own concurrent-rendering scheduler term), `react time series chart`
  (a charting library), `nike air max 270 react time capsule pack` (Nike's React shoe line),
  `react time to learn` ("time to learn React") - on top of the general `time` noise. Sitting
  exactly at the floor with that much documented ambiguity is not worth the placement.
- `clock input`: serp 0 results (untracked). Generator entirely digital-electronics: flip-flop and
  synchronous-counter clock-signal pins, DAC/audio-streamer "10MHz clock input" gear, Arduino,
  HackRF, Quartus. Rejected on the same shape as `odometer`/`otp` - a bare term that loses outright
  to a homograph, documented so no future agent re-litigates it despite it being named as owned
  territory in the brief.

### Other-platform and other-stack qualified

Rejected because the page cannot answer "how do I use _theirs_", or targets a platform this
component doesn't run on:

- Other JS stacks: `angular time picker` (70/mo), `angular material time picker` (20/mo),
  `timepicker angular` (50/mo), `time picker in angular` (20/mo), `angular date time picker`
  (30/mo - also crosses into datetime-field's ground), `mui time picker` (100/mo, competitor
  brand), `xamarin time picker`, `asp.net mvc time picker`, `bootstrap time input`, `shadcn time
picker` / `shadcn time input` / `shadcn time selector`, `vue time selector`, `javafx time
selector`, `ios time selector`, `ios alarm time picker`, `iphone alarm time picker`.
- Native mobile, not web: `time picker in android` (60/mo, m3.material.io ranks for it via the
  Jetpack Compose page, but Compose is not React/web).
- Hyphenated package brand name: `react-time-picker` (60/mo) - the specific npm package at
  npmjs.com/package/react-time-picker, same rejection as the sibling record's
  `react-datepicker`/`react-calendar`.

### Ambiguous, resolved

- **`time field` / `timefield` - kept, with the mixed picture stated plainly.** `serp time field`
  returns react-aria.adobe.com/TimeField at p1 (a real sibling component, same name) and
  shopify.dev's POS UI-extensions `time-field` web component at p7 - genuine component-search
  hits - alongside ibm.com enterprise docs and a Craft CMS field-type page (schema/form-builder
  sense of "field") and a Reddit Airtable thread (database-column sense). Kept in keywords/FAQ on
  the strength of the p1 hit; not used in the title, matching the sibling record's treatment of the
  component's own bare name.
- **`time picker` / `timepicker` bare - kept as primary despite the general homograph warning.**
  Every one of the 9 and 8 serp results respectively is an on-topic design-system, npm, or UX-blog
  page (Material Design 3, MUI X, Uber Base, USWDS, ArcGIS Calcite, Android Compose, Mantine,
  Ant Design, Dribbble, eleken.co, eleken.co). Zero contamination in the ranked SERP even though
  the `generator` seed for `time picker` itself returned a stray reality-TV row (`matt part time
picker kids where are they now`). The lesson: `generator`'s single-word-adjacent noise does not
  predict SERP contamination for the compound phrase - only `serp` on the exact phrase does, which
  is why every head term was serp'd before this call was made.
- **`html time picker` / `html time input` / `input type time` / `input time` / `time input` -
  kept.** `<input type="time">` is the native single-time HTML control, this page's explicit
  territory. Its cousins `<input type="date">` (date-field) and `<input type="datetime-local">`
  (datetime-field) belong to the other two pages.
- **`time selector` - kept.** Explicit territory; serp is identical in composition to `time
picker`'s (MUI, M3, Uber Base, USWDS, Android, eleken, Dell Design System) - Google treats it as
  a near-synonym query, not a distinct subject.

## FAQ sourcing

Verbatim-question yield was effectively zero this round, unlike the sibling record's 5-of-6 reuse.
459 unique question rows were pulled from the 25 generator seeds; grepped against every
time-picker-relevant term (time picker, time input, time selector, time field, html time, 12/24
hour, am/pm, keyboard, min/max, format, controlled, default, step) plus the keyword-ideas array
itself for `how`-prefixed rows. The matches were Excel/Google-Sheets/Word insert-a-time-picker
instructions, Python/C#/Windows time-formatting how-tos, and one reality-TV tangent (`matt part
time picker` - a nickname, not this component) - the same homograph pattern as the keyword mine,
carried into the question pool. None were reusable. All six FAQs below are authored directly from
the component source, then checked against the angle coverage the brief asked for (E via the
business-hours/booking framing of FAQ 3, F via FAQ 2 and FAQ 6, the accessibility invariant via
FAQ 4):

| shipped question                                                             | grounding                                                                                                                                 | angle                                                                                                                                         |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| How do I add a time picker to a React form?                                  | authored from `TimeField.tsx` - no popover, inline segments, live commit                                                                  | D / A                                                                                                                                         |
| Does the value change between 12-hour and 24-hour format?                    | authored from the `format` prop JSDoc + Playground's own note                                                                             | F (proven: `input type time 24 hour format` 70/mo, `12-hour time format hh:mm am/pm example` >1K but format-reference, not component, intent) |
| Can I restrict the time to a range, like business hours or a booking window? | authored from `min`/`max` JSDoc + `tryCommit`'s saturating clamp                                                                          | E (the angle that failed as a keyword source still earns its place in prose)                                                                  |
| Can you type or use the keyboard to set the time?                            | authored from `onHKey`/`onMKey`/`onPaste` in `time-core.tsx`                                                                              | invariant (a11y/keyboard)                                                                                                                     |
| Can I limit the minute options to something like every 15 minutes?           | authored from the `minuteStep` JSDoc + arrow-key rounding in `onMKey`                                                                     | D (differentiator)                                                                                                                            |
| How is this different from the native `<input type="time">`?                 | authored from `date-picker.css`'s `.tsg`/`.tfd` rules (system tokens only, no component-scoped custom property) + zero-dependencies claim | F (proven: `html time picker` 250/mo, `html time input` 250/mo, `input type time` 150/mo - the page's strongest genuine cluster)              |

## Claim provenance

Every FAQ claim is read off the source, not inferred:

- No popover, inline segments, live commit - `TimeField.tsx` renders `TimeSegments` directly inside
  `.tfd__box` (no `Popover` import, unlike `DateField.tsx`); `tryCommit` in `time-core.tsx` calls
  `onCommit` as soon as both `nh` and `nm` are non-null.
- Canonical `'HH:mm'`, 24h always - `TimeFieldProps.value/defaultValue` JSDoc: "canonical 'HH:mm'
  (24h)"; `format` JSDoc: "Display only; storage stays 24h"; confirmed independently by the
  `TimeFieldPlayground` demo's own note: "Display only - the committed value stays canonical 24h
  'HH:mm' either way."
- `min`/`max` saturate - `tryCommit`: `if (min && t < min) t = min; if (max && t > max) t = max;`,
  run before the `onCommit` call, so an out-of-range keystroke clamps rather than errors.
- Keyboard - `onHKey`/`onMKey` in `time-core.tsx`: digit entry via `tsgFeed`'s two-key buffer
  (auto-advances to minutes once a second digit would overflow the format's max hour), Arrow
  Up/Down (hour ±1, minute ± `minuteStep` via `Math.floor`/`Math.ceil` rounding to the step
  boundary), Backspace/Delete clears, Left/Right or `:`/`;` moves focus between segments; `onPaste`
  regex-parses `"2:30pm"`/`"14:30"`/`"930a"` shapes. Every segment carries `role="spinbutton"` with
  `aria-valuemin/max/now/valuetext`; the wrapper is `role="group"` with `aria-label`.
- `minuteStep` - `TimeFieldProps.minuteStep` JSDoc: "↑/↓ step granularity in minutes (typing is
  exact). Default 5"; `onMKey`'s arrow branch rounds to the nearest step multiple, the digit-entry
  branch (`tsgFeed`) does not use `minuteStep` at all.
- Zero dependencies - root `package.json` has no `dependencies` key, only `react`/`react-dom` `^19`
  peers (`peerDependencies`), confirmed identically to the sibling record.
- Tokens, no component-scoped property - `date-picker.css` lines ~535-598: `.tsg`/`.tsg__seg`/
  `.tfd__box` read `--font-mono`, `--size-caption`, `--text-strong`, `--accent-subtle`,
  `--text-accent`, `--text-disabled`, `--text-subtle`, `--accent`, `--bg-surface`, `--ring-accent`,
  `--danger`, `--danger-text`, `--bg-muted`, `--radius-sm` - all system tokens. Unlike `DateField`'s
  `--dtp-cell`, `TimeField` defines no `--tfd-*`/`--tsg-*` custom property of its own.
- `'use client'` - top of both `TimeField.tsx` and `time-core.tsx`.

## Tooling

`kwr` mint server on `127.0.0.1:9502`, `--country us`, per this round's override. All four batch
phases (25-seed generator matrix, 8+6 serp head terms, 5×7-8 traffic batches, 15-candidate kd)
completed with real integers and zero throttling - no `null` kd, no all-zero traffic batch. A
control was not needed since every batch returned varied nonzero numbers throughout.

Raw artifacts:
`/tmp/claude-1000/-home-tabsir-ap-reactp-zyncat-ui/84d4d32b-155d-4e54-921b-e491cc040419/scratchpad/seo/time-field/`
(`seeds.json`, `merged.json`, `serp.json`, `serp2.json`, `traffic1-5.json`, `kd.json`, plus each
`plan-*.json` batch file and matching `.md`).
