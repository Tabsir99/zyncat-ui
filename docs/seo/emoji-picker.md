# SEO research - emoji-picker

Page: https://ui.zyncat.app/emoji-picker (EmojiPickerPanel, `src/components/composites/emoji-picker/`)

## Intent warning, confirmed

`emoji picker` and its siblings carry huge consumer volume that never converts on a docs
page: the Windows `Win + .` panel, the macOS viewer, an iPhone keyboard, or a copy-paste
site. Every seed and every serp pull in this round confirms it directly - see Rejected
below. The winnable ground is narrow and entirely inside the `react emoji picker` /
`emoji picker react` cluster, corroborated by nine independent competitor pages.

## Primary and secondary

- **Primary: `react emoji picker`** - KD 12 (Medium label, numeric winnable), traffic
  70-80/mo proven across 9 independent URLs (ealush.com, missive/emoji-mart on GitHub,
  npmjs.com/emoji-picker-element, npmjs.com/emoji-picker-react, react-aria.adobe.com,
  velt.dev, the r/reactjs thread, the Medium walkthrough, the Liveblocks blog post).
  SERP for this exact phrase is 9/9 developer pages - no consumer result at all.
- **Secondary: `emoji picker react`** - KD 12, traffic 60-90/mo proven across the same
  9 URLs plus one more (Medium at 90). SERP 8/8 developer.
- **Secondary: `emoji picker`** (bare) - KD 40 (right at "belongs in copy, not the
  title"). Traffic is real and large - 150-600/mo across 7 sources - but SERP is
  mixed: 4 of 9 results are consumer/native-platform (a copy-paste tool, macOS-style
  pickers, emojipicker.com, Android's own Emoji Picker view). Kept as a keyword,
  qualified by "React" everywhere it appears, never used bare or first.
- **Secondary: `react emoji`** - KD 5, traffic 150/mo proven twice (the
  emoji-picker-react npm page, and a Stack Overflow "How to display Emoji in React
  App" thread). SERP is mixed (a copy-paste "React Emojis" glyph site outranks
  everything) but real dev traffic lands on both proof pages.
- **Minor: `emoji selector`** (alt name for the same subject) - KD 46 (Hard), traffic
  60/mo, one source (github.com/jmadler/emoji-picker).
- **Minor: `react emojis`** (plural) - KD 1 (Easy), traffic 30/mo, one source (the
  Liveblocks blog post), corroborated by the "React Emojis" SERP result at position 1
  for `react emoji`.

## Candidates and gate

Generator batch: 20 seeds (1-2 words, one or more per angle A-I), `--mint
http://127.0.0.1:9502`, `--limit 20`. 314 unique keyword ideas after dedup, comfortably
over the 100-candidate floor. The generator's own **question** rows (raw FAQ material)
were pulled for every seed - almost all of them platform-support howtos (see Rejected).

Past the >=20-traffic gate: **6** kept, all listed above. Everything else in the 314
either never got measurable traffic in three rounds of `traffic <url>` (13 distinct
URLs tested total, capped at 5 keyword rows each) or was disqualified on intent before
traffic was even worth checking (see Rejected).

A fourth `serp` round specifically chased the angle-B "input" framing that the brief's
"chat input, comment box" use case suggested might rank on its own -
`emoji textarea`, `react input emoji`, `emoji autocomplete react`, `react emoji
search` - all four returned 0 rows. Ahrefs has no ranking-page data for that framing
at all, not even a mixed or consumer one. That use case survives in the lede as prose
("chat inputs, comment boxes") rather than as its own keyword cluster.

`kd` was queried for 15 title/description candidates in one batch; 11 came back `null`.
Per the hard rule those were retried with `--no-cache` - all 11 came back `null` again,
consistently, each labelled "Easy - ~0 referring domains needed." That is a real
**kd n/a**, not a zero: these long-tails (`emoji picker component`, `emoji picker npm`,
`emoji picker library`, `react 19 emoji picker`, `accessible emoji picker`,
`searchable emoji picker`, `emoji reaction picker`, `react chat emoji picker`,
`emoji picker for react`, `emoji picker component react`, `react emoji picker
component`) have no Ahrefs difficulty data at all, consistent with the same terms
returning zero rows from `serp` and zero rows from every `traffic` pull.

Throttle check: not needed - no batch returned all-zeros. `emojipedia.org` was pulled
as a side control and returned 7,953,557 monthly traffic (see Rejected: emoji library),
which also rules out any mint/token throttling for this round.

## Kept

| keyword            | source                                                                                                                                                                                                   | volume              | traffic/mo | kd  | cluster         | placed in                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ---------- | --- | --------------- | ---------------------------------- |
| emoji picker       | seed A "emoji picker"; serp "emoji picker" (mixed 5 consumer/4 dev of 9); traffic: ealush 150, frimousse 150, nolanlawson 600, npmjs-epr 150, ferrucc.io 600, jmadler/emoji-picker 600, rickstaa.dev 600 | >100                | 150-600    | 40  | A, mixed intent | keywords, description (qualified)  |
| react emoji        | seed C "react emoji"; serp "react emoji" (mixed); traffic: npmjs-epr 150, stackoverflow 150                                                                                                              | >100                | 150        | 5   | C               | keywords                           |
| emoji picker react | seed A hit; serp "emoji picker react" (8/8 dev); traffic: ealush 90, frimousse 90, npmjs-epr 90, npmjs-epe 90, emoji-mart(GH) 60, react-aria 60, velt 60, reddit 60, medium 90                           | <100 (bucket wrong) | 60-90      | 12  | D/A             | title, description, lede, keywords |
| react emoji picker | seed A hit; serp "react emoji picker" (9/9 dev); traffic: ealush 80, emoji-mart(GH) 70, npmjs-epe 80, npmjs-epr 80, react-aria 70, velt 70, reddit 70, medium 80, liveblocks blog 70                     | <100 (bucket wrong) | 70-80      | 12  | D/C             | title, description, lede, keywords |
| emoji selector     | seed A "emoji selector" (alt name); traffic: jmadler/emoji-picker 60                                                                                                                                     | <100                | 60         | 46  | A               | keywords                           |
| react emojis       | found in traffic pull, not a seed; corroborated by serp "react emoji" #1 (dreamyguy.github.io/react-emojis)                                                                                              | n/a                 | 30         | 1   | C               | keywords                           |

Two of the kept rows (`emoji picker react`, `react emoji picker`) prove the skill's own
warning about generator buckets: both bucketed `<100` by the generator, both actually
running 60-90/mo real traffic once `traffic <url>` was checked. Bucket was not evidence
here either way - it undersold these two as much as it oversold the rejected ones below.

## Rejected

- **`emoji keyboard`** - generator bucket `>10K`, by far the largest bucket seen. `serp`
  is 8/8 consumer: emojikeyboard.io, emojikeyboard.top, two app-store listings, a
  Google "how to use EMOJI Keyboard on Windows" result, getemoji.com, two Chrome Web
  Store extension pages. Zero developer results. This is the exact trap named in the
  brief - rejected outright, no traffic pull needed.
- **`emoji library`** (bare) - generator bucket `>1K`. `serp` 9/9 consumer/reference:
  emojipedia.org, getemoji.com, unicode.org's emoji chart, emojicopy.com, Wikipedia's
  emoticon list, PyPI's `emoji` (a Python string-processing package, different subject
  entirely), openmoji.org, joypixels.com, flaticon.com. `emojipedia.org` alone pulls
  7,953,557 monthly traffic on queries like "crying emoji" (115K/mo) and "emoji"
  (365K/mo) - none of it developer-relevant. `react emoji library` (the qualified
  long-tail) stayed in the generator's `<100` bucket and never surfaced in any of the
  13 competitor `traffic` pulls - no proof either way, rejected.
- **`chat emoji`** - generator bucket `>1K`. `serp` 7/7 consumer: emojipedia's
  speech-balloon meaning, emojidb, emojiterra, a Google Chat support article,
  getemoji.com, Adobe Stock, Pinterest. Rejected as a keyword; the underlying use case
  survives as "chat inputs" in the lede, a different, developer-shaped phrase.
- **`emoji reaction`** (bare) - generator bucket `>100`. `serp` 7/7 consumer: Pinterest,
  emojipedia's Facebook-reacts page, stock-photo sites, emojidb, Facebook itself, a
  YouTube "change your Instagram reaction emoji" tutorial. Rejected; "reactions"
  survives in the lede and the demo's own "Add reaction" framing informs FAQ #1 and #4
  without shipping the consumer-dominated bare phrase.
- **`twemoji`** - generator bucket `>1K`. `serp` 9/9 about the Twemoji asset project
  itself (a Chrome extension, a Reddit thread on "the fate of Twemoji," a design
  agency's case study, a Figma plugin, a freeCodeCamp tutorial) - adjacent subject, not
  picker components. We do use Twemoji + Noto for rendering (verified in
  `getEmojiUrl.ts`), so it is named once in FAQ #3, but it is not a target keyword.
- **`best emoji`**, **`emoji alternative`** (angle G, shopping) - `best emoji`'s 20
  question rows are exclusively Snapchat best-friend-emoji and "best emoji for
  birthday/thank you" - consumer, no serp pull needed. `emoji alternative` returned
  zero generator ideas and zero questions - no measurable data at all. Both rejected.
- **`animated emoji`**, **`emoji gif`** (angle F, format) - both generator buckets are
  large (`>100` / `>1K`), but every one of their 40 combined question rows is a
  Discord/Slack/VRChat/Telegram/iMessage "how do I upload/send a custom emoji" howto -
  100% consumer platform support. Angle F is mandatory to check, and it was checked;
  unlike `confetti gif`, this subject has no static-asset form factor to capture that
  traffic, so F is empty for this page.
- **`emoji picker component`**, **`emoji picker library`**, **`emoji picker npm`**,
  **`react emoji picker component`**, **`react emoji component`**, **`emoji picker
component react`** (angle D long-tails, the ones named in the brief as target ground)
  - tested three independent ways and came back empty every time: `serp` returned 0
    ranking rows for all of them; `kd` returned `null` on first pass and again on a
    `--no-cache` retry (genuine kd n/a, not zero); and none of them ever appeared in the
    top-5 traffic keywords of any of the 13 distinct URLs pulled across three `traffic`
    batches. No proof obtainable by any method available this round. The angle is not
    abandoned, though - "component" sits in the title and description, and "npm package"
    sits in FAQ #6, as prose, not as claimed keywords.
- **`emoji-picker-react`**, **`emoji mart`** / **`emoji-mart`**, **`emojimart`**,
  **`picmo`** (competitor product names) - all proved real traffic (`emoji-picker-react`
  70-100/mo across 6 of the 13 URLs; `emoji-mart` 30/mo on its own GitHub repo). These
  are other projects' brand names, not generic descriptive phrases - someone typing a
  specific competitor's name wants that project. Excluded from `keywords` on that
  editorial basis despite clearing the traffic gate; not named in FAQ copy either,
  since this round did not verify either competitor's internals (data bundling,
  rendering approach) closely enough to make a fair comparative claim.
- **`emojipicker`** (no space) - technically proven at exactly 20/mo, one source
  (frimousse.liveblocks.io). Right at the floor, single-sourced, and not a shape any
  person actually types. Excluded on quality grounds despite clearing the numeric gate.

## Differentiators verified against source (Step 1)

All read first-hand from `src/components/composites/emoji-picker/` - no `get_component`
calls this round (per the brief, the MCP tool was unreliable this session), and no file
in that directory was written to, only read (another session was mid-edit on
`EmojiPickerPanel.tsx`/`.usage.md`; both were re-read at final draft time and were
stable).

- **Not bundled, contra the brief's hypothesis** - `data.ts`'s `loadEmojiData(url |
EmojiData)` must be called once before first open or `picker.ts` throws `'Emoji data
not found'`. The docs demo fetches `/emojis.json` (593,187 bytes, 1,923 emoji keys,
  counted directly). This is the opposite of "bundled dataset" - the brief's suggested
  differentiator does not hold and is not claimed anywhere in the copy.
- **Image rendering, not native glyphs** - `getEmojiUrl.ts` maps `(hexId, source) =>
url` through Twemoji (SVG for `inline`, 72x72 PNG for `picker-grid`) and Google's
  animated Noto emoji (webp) for `category-bar`/`callout-icon`. `dom.ts` swaps a tile
  back to the native Unicode glyph (the button's `alt` text) on image load error.
- **Word-based search, not fuzzy** - `search.ts`'s own comment states the reasoning
  (~1800-item dataset, a subsequence tier would drown the tail); it scores
  exact/prefix/mid-word hits across shortcodes > name words > tags, caps at 90 results.
- **Full keyboard grid navigation** - `navigation.ts` implements 2D arrow-key movement
  across category-aware sections (`COLUMN_COUNT = 8`), Enter commits. Roving
  `aria-activedescendant` pattern: `role="listbox"` on the scroll region, `role="option"`
  per tile (`dom.ts`), `aria-selected` toggling and `aria-activedescendant` set on the
  focus host (`picker.ts`).
- **Skin tone is data-modeled but not a feature** - `Emoji.skins: EmojiSkin[]` and
  `EmojiSkin.tone` exist on the type/dataset shape, but a full grep of the component
  tree shows `.skins` is never read anywhere in rendering or selection. There is no
  skin-tone picker UI. Not claimed anywhere in the copy - this was the brief's other
  hypothesis to verify, and it does not hold either.
- **Reduced motion** - `scaffold.ts`'s `positionMarker` skips the FLIP `animate`/`flip`
  call when `SM.reduced` (the shared motion-tokens flag) is set; the marker still snaps
  to position via `set()`.
- **Responsive by composition** - `EmojiPickerPanel.tsx` renders a `Popover` above
  `breakpoint` (default `(max-width: 40rem)`) and a `Sheet` below it, both from the
  library's own composites, not reimplemented.
- **Zero runtime dependencies, React 19 peer only** - root `package.json` has no
  `"dependencies"` key, only `peerDependencies: { react: ^19, react-dom: ^19 }`.
  `EmojiPickerPanel.tsx` line 1 is `'use client'`.
- **Query-driven / caret-anchored mode** - `query` prop plus `popoverProps.anchor` plus
  the imperative `ref` (`handleKey`, `selectFocused`, `renderAll`, `renderFiltered`)
  let a consumer drive the grid entirely from their own input - documented in
  `EmojiPickerPanel.usage.md` and exercised by the docs site's own demo
  (`EmojiPickerHero` in `apps/docs/components/pages/overlays.tsx`), which frames the
  whole component as "Add reaction."

## Report

```
slug: emoji-picker
primary: react emoji picker (KD 12, 70-80/mo proven across 9 URLs)
secondary: emoji picker react, emoji picker, react emoji, emoji selector, react emojis
candidates: 314 unique (20 seeds) | past the >=20 gate: 6 | shipped: 6
title: Searchable React Emoji Picker (29 chars) | description: 152 chars
faq: 6 | rejected: emoji keyboard, emoji library, chat emoji, emoji reaction, twemoji,
  best emoji, emoji alternative, animated emoji, emoji gif (all consumer-intent,
  serp/question-proven); emoji picker component/library/npm and siblings (angle D,
  zero data via serp+kd+traffic, three methods tried); emoji-picker-react/emoji-mart/
  emojimart/picmo (competitor brand names, proven traffic but excluded on editorial
  grounds); emojipicker no-space (proven at exactly the 20 floor, one source, excluded
  on quality)
open questions: none outstanding. `emoji selector` (KD 46) is genuinely harder than the
  primary cluster - kept anyway since the 60/mo is real and it is a true alt name, not a
  stretch. If a future round wants a larger keyword set, the ceiling found here is 13
  distinct developer-relevant URLs plus a fourth serp-only round (all 0 rows) converging
  on the same 6 phrases - widening further likely needs a genuinely new angle (e.g. a
  specific chat-SDK integration guide) rather than more URLs on the same angles.
```
