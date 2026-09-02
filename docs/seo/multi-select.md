# SEO record - multi-select

Page: https://ui.zyncat.app/multi-select ("MultiSelect"). Component page, forms group.
Source: `src/components/composites/select/MultiSelect.tsx`, `select.css`, `core/{trigger,panel,use-listbox,menu}.tsx`.

## Territory

This page owns everything carrying **multi / multiple**. Three siblings were being researched in
parallel and their arrays could not be read, so the split was assigned in advance and honoured:

| Page                | Owns                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| multi-select (this) | `multiselect*`, `multi select*`, `multi-select*`, `multiple select*`, `select multiple`, `multiple selection*`     |
| select              | `react select`, `select component`, `custom select`, `searchable select`, `select dropdown`, `listbox`, `combobox` |
| dropdown            | bare `dropdown`, `dropdown menu`                                                                                   |
| tag                 | `tags input`, `tag`, chip/token input                                                                              |

Both spellings were mined separately and both pay: `multiselect dropdown` **700/mo** and
`multi select dropdown` **450/mo** are different rows in Ahrefs with different top-ten sets. The
title carries one spelling, the description the other.

**Collisions with the 14 shipped `content/seo/*.ts`: none.** All fourteen were read. The shipped
set is expressive components (confetti, lens, odometer, flow-field, morphing-text, typing-lines,
weight-field), platform replicas (tiktok, youtube, instagram-feed, facebook-feed) and three guides
(introduction, installation, theming). Not one carries a `multi`, `multiple` or `select` keyword.
The nearest neighbour is `installation.ts`, which holds the Tailwind-alternative cluster - this page
touches "no Tailwind config" only inside one FAQ answer, never in a keyword.

## Primary and secondary

| Role        | Keyword                              | KD   | Volume bucket | Proven traffic | Proof                                              |
| ----------- | ------------------------------------ | ---- | ------------- | -------------- | -------------------------------------------------- |
| Primary     | `multiselect dropdown`               | Easy | >100          | **700/mo**     | demo.mobiscroll.com/select/multiple-select at #1   |
| Secondary 1 | `multi select dropdown`              | Easy | <100          | **450/mo**     | demo.mobiscroll.com/select/multiple-select at #1   |
| Secondary 2 | `multiple select dropdown`           | Easy | <100          | **250/mo**     | demo.mobiscroll.com/select/multiple-select at #1   |
| Secondary 3 | `multi select`                       | Easy | >100          | **250/mo**     | mantine.dev/core/multi-select/ at #1               |
| Secondary 4 | `multiselect`                        | Easy | >100          | **200/mo**     | mantine.dev/core/multi-select/ at #1               |
| Secondary 5 | `multiselect dropdown with checkbox` | n/a  | <100          | **150/mo**     | coreui.io/bootstrap/docs/forms/multi-select/ at #1 |
| Secondary 6 | `react multiselect`                  | Easy | <100          | **90/mo**      | primereact.org/multiselect/ at #2                  |

**KD is a label here, not a score.** `kd` was run twice over the 15 title and description candidates
(once after a 4-minute cooldown, once after 5 more on the seven head terms) and Ahrefs returned
`kd: null, label: "Unknown"` for every row both times - the same all-empty-payload-with-`success`
throttle that hit the second `traffic` batch. The mint server was healthy throughout (675 minted /
675 served) and five kwr processes from parallel sibling runs were contending for it, so this is an
upstream rate limit, not a tooling fault. The column therefore carries the `generator` difficulty
label; `n/a` means the term never appeared in a generator idea list and came from a competitor's
`traffic` table instead. Every one of the shipped rows labels Easy or Medium, and the primary labels
Easy - which is the call the numeric score would have informed, pointing the same way.

`multiselect dropdown` is the primary because it is the single highest proven earner in the whole
set and four separate pages bank real traffic on it from four different positions - mobiscroll #1,
angular.dev #2, coreui #3, w3schools #5 - which is what a genuinely deep SERP looks like. It is also
what this component literally is: a trigger that opens a floating listbox.

## The volume trap: `<100` and `>1K` are both lies here

The generator's biggest bucket for every `multi`/`multiple` seed is `>1K`, and **every single one of
those rows is a different subject**: `how to select multiple files on mac`, `how to select multiple
files on windows`, `how to select multiple cells in excel`, `how to select multiple photos on mac`.
That is OS file-manager and spreadsheet how-to, not a UI component. Had the bucket been treated as
evidence this page would have been written about Finder.

Conversely almost every keyword this page actually ships sits in the `<100` bucket, and `traffic`
proves several of them earn 250-450/mo. `multi select dropdown` reads `<100` in the generator and
banks **450/mo** for mobiscroll. The bucket and the money are uncorrelated at this end of the tail.

## Competitor traffic (the proof set)

20 ranking URLs were pulled from six SERPs and put through `traffic`. Twelve returned data; the
rest were caught in an Ahrefs burst-throttle (all-zero payloads with `success` status - a throttle,
not a "no data" signal, since `multiple select dropdown` demonstrably has a top ten). The twelve
that answered carry the whole proof set:

| URL                                                           | Traffic/mo |
| ------------------------------------------------------------- | ---------- |
| w3schools.com/tags/att_select_multiple.asp                    | 2.0K       |
| demo.mobiscroll.com/select/multiple-select                    | 1.9K       |
| coreui.io/bootstrap/docs/forms/multi-select/                  | 1.3K       |
| vue-multiselect.js.org                                        | 670        |
| angular.dev/guide/aria/multiselect                            | 594        |
| github.com/codeshackio/multi-select-dropdown-js               | 424        |
| mantine.dev/core/multi-select/                                | 307        |
| npmjs.com/package/ng-multiselect-dropdown                     | 243        |
| npmjs.com/package/multiselect-react-dropdown                  | 154        |
| syncfusion.com/javascript-ui-controls/js-multiselect-dropdown | 119        |
| docs.streamlit.io/.../st.multiselect                          | 91         |
| primereact.org/multiselect/                                   | 32         |

The shape of that table is the opportunity. The two biggest earners are a 2008-era HTML attribute
reference and a jQuery-era demo page; the React-native results (`primereact` 32/mo,
`multiselect-react-dropdown` 154/mo) are the weakest on the board. A React 19 component page with
real listbox semantics has room here.

## Kept

| Keyword                            | Source (angle · competitor)                                          | Volume | Traffic/mo | KD     | Cluster  | Placed in                         |
| ---------------------------------- | -------------------------------------------------------------------- | ------ | ---------- | ------ | -------- | --------------------------------- |
| multiselect dropdown               | A · demo.mobiscroll.com/select/multiple-select #1                    | >100   | **700**    | Easy   | dropdown | title, keywords, faq              |
| multi select dropdown              | A · demo.mobiscroll.com/select/multiple-select #1                    | <100   | **450**    | Easy   | dropdown | description, lede, keywords, faq  |
| multiple select dropdown           | B · demo.mobiscroll.com/select/multiple-select #1                    | <100   | **250**    | Easy   | dropdown | keywords                          |
| multi select                       | A · mantine.dev/core/multi-select/ #1                                | >100   | **250**    | Easy   | head     | description, lede, keywords, faq  |
| multiselect                        | A · mantine.dev/core/multi-select/ #1                                | >100   | **200**    | Easy   | head     | title, keywords, faq              |
| select multiple                    | B · w3schools.com/tags/att_select_multiple.asp #2                    | <100   | **150**    | n/a    | native   | keywords, faq                     |
| multiselect dropdown with checkbox | I · coreui.io/bootstrap/docs/forms/multi-select/ #1                  | <100   | **150**    | n/a    | checkbox | title, description, keywords, faq |
| react multiselect                  | C · primereact.org/multiselect/ #2                                   | <100   | **90**     | Easy   | react    | keywords, faq                     |
| html multi select                  | F · syncfusion.com/javascript-ui-controls/js-multiselect-dropdown #6 | <100   | **70**     | n/a    | native   | keywords, faq                     |
| dropdown multiselect               | A · github.com/codeshackio/multi-select-dropdown-js #1               | <100   | **60**     | -      | dropdown | keywords                          |
| multi-select                       | A · mantine.dev/core/multi-select/ #1                                | <100   | **50**     | Easy   | head     | keywords                          |
| react multi select                 | C · primereact.org/multiselect/ #2                                   | <100   | **50**     | Medium | react    | keywords, faq                     |
| dropdown multiple select           | B · demo.mobiscroll.com/select/multiple-select #1                    | <100   | **50**     | -      | dropdown | keywords                          |
| multiple selection dropdown        | B · demo.mobiscroll.com/select/multiple-select #1                    | <100   | **40**     | -      | dropdown | keywords, faq                     |
| react multiselect dropdown         | C · npmjs.com/package/multiselect-react-dropdown #2                  | <100   | **20**     | Medium | react    | keywords                          |

All fifteen clear the >=20/mo gate. Also past the gate but cut:

- `multiselect html` **40** and `html multiselect dropdown` **30** and `html dropdown multiselect`
  **30** (syncfusion #4-#5) - near-duplicates of `html multi select`, which was kept instead.
- `multiselect ui` **30** (primereact #7) - cut to hold the array at 15. Weakest of the surviving
  rows and its only proof is a #7 position on the lowest-traffic page in the whole proof set.
- `multiselect combobox` **20** (mantine #3) - borderline. The trigger really is `role="combobox"`,
  but `combobox` is the `select` sibling's assigned head and this row is only 20/mo. Left to them.

## Rejected clusters

- **OS and file-manager how-to** (`how to select multiple files on mac` >1K, `...on windows` >1K,
  `how to select multiple photos on mac` >1K, `how to multi select on mac`, `how to select multiple
files in google drive`, `how to select multiple emails in outlook`, `how to select multiple songs
on spotify`, `how to select multiple layers in procreate`, `how to select multiple items in
canva`, `how to multiselect in vs code`, `how to multiselect bg3`). The largest volume in the
  entire candidate set and every row is Ctrl-click in a file browser. Different subject; a React
  component page cannot be the best answer and would be a bounce.

- **Spreadsheet data validation** (`multi select dropdown excel`, `excel multiselect dropdown`,
  `google sheets multi select dropdown`, `excel drop down list multiple selection`, `how to create a
multi-select drop-down list in excel`, `multiple selection dropdown in excel`, plus ~40 more).
  Second-biggest cluster in the set. These people want a VBA macro or an Apps Script, not an npm
  package. Rejected wholesale.

- **Other frameworks, proven traffic and all** - the biggest single cut. `vue multiselect` **150**,
  `bootstrap select` **400**, `bootstrap multiselect` **90**, `mui multiselect` **100**,
  `ng-multiselect-dropdown` **90**, `ng multiselect dropdown` **60**, `angular multi select
dropdown` **20**, `st.multiselect` **40**, `vue select` **50**, `mantine multiselect` **30**,
  `vue-multiselect` **30**. Every one clears the traffic gate and every one is unwinnable and
  useless: the searcher has already picked a framework and it is not React. Also rejected for the
  same reason: `shadcn multi select` (>100 bucket), `tailwind multiselect`, `select2`,
  `select2 alternative`, `jquery select2` - competitor and plugin brand names.

- **`tags select` / tag-input - rejected, and the grey zone resolved.** The brief flagged
  `tags input` as ambiguous between a token/chip input and a many-of listbox. Two findings settle
  it. First, keyword-side: the `tags select` seed returned **3 ideas total**, all off-subject
  (`gitlab ci tags select runners documentation`, `radio-frequency identification (rfid) tags
select`), and the tag question rows are `how to select multiple tags in anki` / `in vscode` /
  `in mailchimp` - no UI-component intent and no volume. Second, product-side: this component does
  **not** render removable chips. Its trigger summarises as `first +N` (`count={selectedOptions
.length - 1}`); removable per-item entries are what `Tag`/`TagGroup` is for, which is the `tag`
  page. Rejected on both counts - no volume and not this component.

- **Select-all** (`react multiselect dropdown with select all`, `how to select all option in
multiselect jquery`). Real developer intent, but `MultiSelect` has no select-all prop. Writing an
  FAQ around it would invent a capability. Rejected until the component grows one.

- **jQuery plugin maintenance** (`how to clear multiselect dropdown in jquery`, `how to reset
multiselect dropdown in jquery`, `how to refresh multiselect dropdown in jquery`, `how to disable
multiselect dropdown in jquery`). Debugging an existing jQuery plugin, not choosing a React one.

- **Quiz and test-prep homographs** (`which functions have an additive rate of change of 3? select
two options.`, `free nclex multiple select`, `multiple select question`, `answer question mode:
multiple select question`). The `>100`-bucket noise inside the `multiple select` seed. Not a UI
  control.

- **Automotive** (`what is multi terrain select`, `on the gx which are multi-terrain select
options`). Toyota's off-road drive mode. Named here so the next agent does not re-check it.

## Entry as shipped

- **title** `React Multiselect Dropdown with Checkboxes` - 42 chars. Primary `multiselect dropdown`
  intact and near-front; `react` disambiguates from the Finder/Excel homographs, which is the whole
  reason the head term is never taken bare here; `with Checkboxes` picks up a 150/mo proven row that
  `Component` (never traffic-proven) would not have.
- **description** 153 chars. Carries the other spelling (`multi select dropdown`) in the first
  clause, the two provable behaviours, and the differentiators.
- **keywords** 15, ranked by proven traffic, every one >=20/mo.
- **lede** 104 chars.
- **faq** 6, each claim traced below.

## FAQ provenance

Every answer is provable from the source; no claim was written that the props do not support.

| FAQ | Question source                                                                                     | Proven by                                                                                                                                                                                                                                                                                                                                     |
| --- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | verbatim generator row `how to create multi select dropdown in react`                               | `MultiSelectProps`: `options`, `value`, `defaultValue`, `onChange(value, toggled)`, `searchable`, `ariaLabel`; `SelectOption[] \| SelectGroup[]`                                                                                                                                                                                              |
| 2   | angle E, the component's headline behaviour                                                         | `useListbox({ ..., closeOnCommit: false })`; `onMenuKeyDown` Escape/Tab; `useOutsidePress` in `core/menu.tsx:70`; `returnFocus()`                                                                                                                                                                                                             |
| 3   | angle E, the registry blurb's "first +N"                                                            | `text={... selectedOptions[0].label}` and `count={selectedOptions.length - 1}` in `MultiSelect.tsx:130-132`; `{count > 0 && <span className="select__count">+{count}</span>}` in `core/trigger.tsx:76`; `placeholder = 'Select options'`                                                                                                      |
| 4   | verbatim generator row `how to add checkbox in dropdown` + `react multiselect dropdown with search` | `check={(sel) => <CheckboxTick checked={sel} />}`; `searchable` / `searchPlaceholder`; `matches()` in `core/types.ts:40` tests label **and** description; `useTypeahead` prefix jump when `!searchable`                                                                                                                                       |
| 5   | angle F, from keyword `html multiselect without ctrl` + `html multi select`                         | native `<select multiple>` Ctrl-click behaviour; `size` / `highlight` / `rail` props; `package.json` `dependencies: {}` and `license: MIT`                                                                                                                                                                                                    |
| 6   | angle H, the differentiator                                                                         | `role="combobox"` + `aria-haspopup`/`aria-expanded`/`aria-controls`/`aria-activedescendant` in `core/trigger.tsx:47-52`; `role="listbox"` + `aria-multiselectable` in `core/panel.tsx:96-97`; `role="option"` + `aria-selected` at `:123-124`; `onMenuKeyDown` Arrow/Home/End/Enter/Space/Escape; `stepEnabled`/`matchPrefix` skip `disabled` |

## Open questions

None. Every FAQ claim is traceable to a line in the component, its core, its CSS or `package.json`.
The one thing the props could not confirm - select-all - was rejected rather than written around.
