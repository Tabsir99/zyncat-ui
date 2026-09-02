# select - keyword research

Primary: react select dropdown (KD 31, <100 bucket, **150/mo proven** - react-select.com #1, npmjs.com/package/react-select #2)
Secondary: combobox (KD 24, 800/mo), dropdown with search (KD 7, 150/mo), select box (KD 24, 100/mo), react combobox (KD 8, 70/mo), select with search (KD 4, 30/mo)

Candidates collected: 351 generator ideas + 279 generator questions + 107 competitor
`topKeywords` rows = 737 rows, 712 unique. 82 of the competitor rows clear the >=20/mo
`traffic` gate; 38 of those are on this page's assigned territory. Shipped: 15.

## The head term: `react select` is 5900/mo and it is not winnable

The brief said to `serp` it early and decide honestly. Here is the SERP:

| #   | URL                                        | What it is               |
| --- | ------------------------------------------ | ------------------------ |
| 1   | `react-select.com/`                        | the react-select package |
| 2   | `npmjs.com/package/react-select`           | the react-select package |
| 3   | `react.dev/reference/react-dom/components` | the React docs           |
| 4   | `blog.logrocket.com/...`                   | a react-select tutorial  |
| 5   | `github.com/tbleckert/react-select-search` | a react-select fork      |
| 6   | `github.hubspot.com/react-select-plus`     | a react-select fork      |
| 8   | `mui.com/material-ui/react-select`         | MUI's Select             |

`traffic https://react-select.com/` returns **5900/mo at #1** for `react select` and
**2700/mo at #1** for `react-select`; `npmjs.com/package/react-select` takes the same two
at #2. Six of the eight results are the package, a fork of it, or a tutorial about it.
`kd react select` = **46**, which the skill's own rule puts in copy and never in the title.

Google has resolved `react select` as navigational to one npm package. A component page
does not win that, and the one page in the whole set that tried - LogRocket's "best React
select component libraries" - ranks **#2 for `react-select alternatives` and earns 0/mo
from it**. The alternatives angle is measured, and it is empty.

So the title takes the modifier instead. `react select dropdown` is a different keyword
with a different KD (**31**) and 150/mo of proven traffic, and it sits inside the phrase
`React Select Dropdown` so the head term is still contiguous in the title for anything
that matches on substrings. The head itself lives in `keywords` and the description.

## The searchable angle is uncontested, and it is what the component actually is

`serp searchable select` returned **zero rows** - no established page owns it. But the
demand is real and it is phrased differently: `select2.org/searching/` earns **150/mo at
#8 for `dropdown with search`** and **30/mo at #1 for `select with search`**, and both come
back KD 7 and KD 4. That is a 20-year-old jQuery plugin holding the whole cluster.

`searchable` is one boolean prop on this component. The title leads with it.

## `combobox` is the highest-traffic winnable term and it is literally the role

`combobox` is 800/mo at KD 24, proven twice: `w3.org/WAI/ARIA/apg/patterns/combobox/` #1
and `base-ui.com/react/components/combobox` #3. `combo box` is another 600/mo (W3C #10).
The trigger in `Select.tsx` renders `role="combobox"` with `aria-haspopup="listbox"`, so
the claim is not a stretch - it is the source.

It did not go in the title for two reasons. The #1 result is the ARIA spec, which means the
query is definitional rather than shopping; and the generator shows the same homograph
problem `odometer` had - `wpf combobox`, `tkinter combobox`, `javafx combobox`,
`lightning-combobox`, `how to add items to combobox in c#`. Bracketed by `React` and
`listbox` in the description and the FAQ, the ARIA sense is unambiguous. Bare in a title it
is not. `multi-select` explicitly ceded this cluster to this page.

## Kept

| keyword                | source (angle · competitor)                                                  | volume | traffic/mo | kd  | cluster  | placed in                    |
| ---------------------- | ---------------------------------------------------------------------------- | ------ | ---------- | --- | -------- | ---------------------------- |
| react select           | C stack · react-select.com #1                                                | >1K    | **5900**   | 46  | head     | title, keywords              |
| combobox               | A bare head · w3.org/WAI/ARIA/apg/patterns/combobox #1, base-ui.com #3       | >100   | **800**    | 24  | combobox | description, keywords, faq   |
| combo box              | A bare head · w3.org/WAI/ARIA/apg/patterns/combobox #10                      | <100   | **600**    | 24  | combobox | keywords                     |
| react select dropdown  | B behaviour · react-select.com #1, npmjs.com/package/react-select #2         | <100   | **150**    | 31  | dropdown | title, description, keywords |
| dropdown with search   | E trigger · select2.org/searching/ #8                                        | <100   | **150**    | 7   | search   | keywords, faq                |
| select box             | H assistant · select2.org/dropdown/ #9                                       | <100   | **100**    | 24  | head     | keywords                     |
| combobox ui            | D artifact · headlessui.com/react/combobox #1, base-ui.com #2                | <100   | **80**     | n/a | combobox | keywords                     |
| react combobox         | D artifact · headlessui.com #1, base-ui.com #2, react-aria.adobe.com #4      | <100   | **70**     | 8   | combobox | keywords, faq                |
| select ui              | D artifact · heroui.com/docs/react/components/select #6                      | <100   | **50**     | 12  | head     | keywords                     |
| react select onchange  | I use case · react-select.com/advanced #3                                    | <100   | **50**     | n/a | api      | keywords, faq                |
| aria combobox          | B behaviour · w3.org APG #1, react-aria.adobe.com/ComboBox #3                | <100   | **40**     | n/a | a11y     | keywords, faq                |
| select component       | D artifact · heroui.com/docs/react/components/select #3                      | <100   | **30**     | 39  | head     | lede, keywords               |
| custom select dropdown | E trigger · developer.chrome.com/blog/a-customizable-select #1, w3schools #4 | <100   | **30**     | n/a | styling  | description, keywords, faq   |
| select with search     | E trigger · select2.org/searching/ #1                                        | <100   | **30**     | 4   | search   | keywords, faq                |
| select js              | G shopping · tom-select.js.org #1                                            | <100   | **30**     | n/a | library  | keywords                     |

All fifteen clear the >=20/mo gate. Zero string overlap with `multi-select.ts` or
`date-field.ts`, the two siblings researched in the same round, or with the thirteen
already shipped.

Past the gate but cut, all safe for a future pass:

- `combo box ui` **70** (base-ui.com #2), `select onchange react` **30** (react-select.com/advanced #3)
  and `dropdown with search box` **20** (select2.org/searching/ #6) - near-duplicates of rows
  already kept.
- `role combobox` **30** (w3.org APG #2), `aria listbox` **20** (react-aria.adobe.com/ListBox #3),
  `list boxes` **20** (nngroup.com/articles/listbox-dropdown/ #1) - the a11y cluster, represented
  by `aria combobox`.
- `combobox component` **20** (base-ui.com #4), `tailwind combobox` **20** (headlessui.com #5),
  `dropdown select` **20** (select2.org/dropdown/ #1), `optgroup html` **20** (tom-select.js.org #4),
  `react select set value` **20** (react-select.com/advanced #4).
- `reactselect` **20**, `react select npm` **70**, `react-select npm` **70**, `react-select` **2700**
  (all react-select.com or npmjs #1-#2) - the package's own name. Navigational; nothing to take.

## Rejected clusters

- **The `select` homograph.** Bare `select` is >10K and none of it is software: Delta Premium
  Select, Select Physical Therapy, SelectQuote, Select Portfolio Servicing, Select Blinds, Select
  Home Warranty, ESPN Select, Priority Pass Select, small pet select, song select. Its question
  set is worse - `how to select all in word` >1K, `how to select multiple files on mac` >1K,
  `select all factors that are ways in which you might become the victim of a terrorist attack`

  > 1K, plus dozens of school-quiz stems ("select two options", "select three choices"). The bare
  > word is unrankable and the clicks would be worthless. It never appears alone anywhere on the page.

- **`custom select`, same problem.** The generator's top rows for that seed are the Cuisinart
  Custom Select toaster (>1K), Gibson Custom Select, Kincaid Custom Select furniture and Coverking
  Custom Select seat covers. The software sense is proven at **10/mo** (developer.chrome.com #1,
  css-tricks.com #5) - below the gate on its own. `custom select dropdown` (30/mo, three
  independent proofs) carries the cluster instead.

- **Native `<select>` tutorial intent.** `dropdown in html` **2300**, `select tag in html`
  **1800**, `select html` **800**, `select in html` **500**, `html dropdown` **500**, `drop down
list in html` **450**, `select option` **150** - all W3Schools #1 or MDN #1. The largest
  unclaimed volume in the candidate set and the correct answer to every one of them is the native
  element, not a React component. Two DR-90 reference docs hold the top slots. Different subject.

- **Restyling the native element.** `select arrow css` **200** (filamentgroup.com/lab/select-css
  #1), `select option css` **50** (css-tricks #6, w3schools #2), `select dropdown css` **40**,
  `styling select dropdown` **40** (developer.chrome.com #3), `css select` **40** (moderncss.dev
  #3), `style select option css` **30**. Every one asks how to style a native `<select>` and its
  OS-drawn menu. This component's honest answer is that you cannot, which is why it replaces the
  element rather than styling it - so the answer is in the FAQ ("How do I style a select dropdown
  in React?") but the keywords are not claimed. Shipping `select arrow css` would be a bounce.

- **Autocomplete.** `mui autocomplete` **900**, `react autocomplete` **200**, `material ui
autocomplete` **150**, `react-autocomplete` **50** (mui.com/material-ui/react-autocomplete #1).
  An autocomplete accepts free text; `Select` has no text entry and `onChange` can only ever
  return a `value` that already exists in `options`. Adjacent, tempting, and a different component.

- **Desktop toolkits.** `tkinter listbox` >100, `wpf listbox`, `vba listbox`, `asp net core
listbox`, `wpf combobox`, `javafx combobox`, `lightning-combobox`, and every `what is a listbox`
  / `what is a combobox` / `how to add items to combobox in c#` question in the set. The listbox
  and combobox nouns are owned by C#, VB and tkinter outside the ARIA context. Kept the ARIA sense
  only, always next to `React` or `aria`.

- **`react select alternative`.** Measured and dead. `serp react select alternative` returned zero
  rows; `blog.logrocket.com/best-react-select-component-libraries/` ranks **#2 for `react-select
alternatives` and earns 0/mo**; the `select alternative` generator seed returned Select
  Alternative Investments (a fund), `deutsche select alternative allocation fund` and `paint 3d
magic select alternative`. No page should spend a keyword slot here.

- **Other libraries' brand names.** `mui select` **700**, `mui dropdown` **250**, `material ui
select` **150**, `select2` **600**, `select 2` **150**, `select2 cdn` **100**, `select2 jquery`
  **90**, `tom select` **150**, `tomselect` **80**, `selectize` **150**, `baseui` **700**,
  `dropdown antd` **100**, `mantine select` **20**, `radix select` **10**. Navigational to a
  specific package.

- **Territory ceded (assigned in the brief).** To `dropdown`: `dropdown` **2100**, `dropdowns`
  **150**, `dropdown ui` **150**, `react dropdown` **450**, `react dropdown menu` **150**, `react
dropdown component` **100**, `dropdown react` **80**, `drop down ui` **70**, `custom dropdown`
  **40**. To `multi-select`: `html multiselect` **100**, `mui multiselect` **100**, `select 2
multiselect` **20**, and everything else carrying multi/multiple. `multi-select.md` left
  `multiselect combobox` **20** to this page as the combobox owner; it keeps the "multiselect"
  string, so under the standing split it stays theirs and is not shipped here.

## FAQ sources

Five of the six questions are generator question rows, lightly normalised:

| Shipped question                                        | Generator row                                                                |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| How do I add a search box to a select dropdown?         | `how do i add a search option to a drop-down list?`                          |
| Is this a combobox or a listbox?                        | `listbox vs combobox`, `what is a combobox`                                  |
| How do I style a select dropdown in React?              | `how to style select dropdown` (Medium)                                      |
| How do I get the selected value?                        | `how to get select value in react`, `react select how to get selected value` |
| Can I put icons on the options, or group them?          | `how to add icon in select dropdown`                                         |
| Which keys does it support, and does it run in Next.js? | angle F/platform; no generator row                                           |

Every claim in the answers is checked against `src/components/composites/select/` -
`Select.tsx` for the props, `core/use-listbox.ts` for the key handling and focus return,
`core/trigger.tsx` for the ARIA wiring, `core/panel.tsx` for the search input and the empty
state, `core/menu.tsx` for the portal, and `src/tokens/motion.css` for the 1ms reduced-motion
collapse.

## Tooling note

The Ahrefs `kd` and `traffic` endpoints returned `null`/empty intermittently for the whole
middle of this run - three agents against a six-widget mint on port 9501, with `ready: 0` and
a standing queue whenever it happened. A `null` there is not a real zero: `react select` came
back `null` twice and **46** on the third call, and `headlessui.com/react/listbox` returned
data, then empty, then data. Every number in this file comes from a call that returned a
value. Rows marked `kd n/a` returned `kd: null` on three or more separate attempts, which for
those low-volume terms is Ahrefs having no score rather than the service being down.
