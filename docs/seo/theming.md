# SEO record - theming

Page: https://ui.zyncat.app/theming ("Theming & Overrides"). Guide page, not a component.

## Primary and secondary

| Role        | Keyword                 | KD  | Volume bucket | Proven traffic | Proof                                                      |
| ----------- | ----------------------- | --- | ------------- | -------------- | ---------------------------------------------------------- |
| Primary     | `theming`               | 10  | >1K           | **1,400/mo**   | mui.com/material-ui/customization/theming/ at #1           |
| Secondary 1 | `design tokens`         | 39  | >100          | **600/mo**     | atlassian.design/foundations/design-tokens at #1           |
| Secondary 2 | `css variables`         | 3   | >1K           | **3,500/mo**   | developer.mozilla.org Cascading_variables at #1            |
| Secondary 3 | `dark mode toggle`      | 7   | <100          | **150/mo**     | dev.to/abbeyperini/toggle-dark-mode-in-react at #6         |
| Secondary 4 | `css custom properties` | 41  | >100          | **150/mo**     | css-tricks.com/a-complete-guide-to-custom-properties at #4 |

`theming` is the primary because a component library's theming doc already holds #1 for it and
earns 1,400/mo doing so. That is this page's exact type and exact subject, at KD 10.

## The two big-volume calls

**`css variables` - kept, but not as the title head.** 3,500/mo and KD 3 make it look like the
obvious primary. The SERP says otherwise: #1 MDN, #2 w3schools, #4 geeksforgeeks - language
reference intent, not "how do I theme this library". The one library theming doc in the top ten,
`ionicframework.com/docs/theming` at **#3**, earns **27/mo across the entire page**, and
`css variables` does not appear in its top keywords at all. Ranking there does not convert for a
library doc. So it rides in the title's second clause and in prose, where its long tail actually
pays - `variables in css` 90/mo, `css color variables` 70/mo, `css root variables` 60/mo,
`css variable` 200/mo - rather than carrying the page.

**`dark mode` - rejected as a head term, kept as its developer long tail.** The head is >10K and
KD Hard, and both the SERP and the idea set are consumer app toggles: `google docs dark mode`
(>10K), `dark mode snapchat` (>10K), `amazon dark mode` (>10K), `outlook dark mode`, `chrome dark
mode`, `gmail dark mode`. Those searchers want a settings switch in an app they already use, not a
React token swap. The developer slice is real but small and mostly branded - `dark mode toggle`
150/mo (KD 7), `light mode dark mode toggle` 50/mo, `toggle dark mode` 30/mo, against
`next-themes` 300/mo and `mui dark mode` 60/mo which belong to other packages. Kept in keywords,
description and one FAQ; never the title head.

**Net call:** the page takes the theming + design-tokens ground, with the CSS-variables long tail
as the mechanism it is described by. That is the narrower ground and it is the one this page can
actually be the best answer for.

## Kept

| Keyword                | Source (angle · competitor)                                | Volume | Traffic/mo | KD  | Cluster       | Placed in                               |
| ---------------------- | ---------------------------------------------------------- | ------ | ---------- | --- | ------------- | --------------------------------------- |
| css variables          | A · developer.mozilla.org/Cascading_variables #1           | >1K    | **3500**   | 3   | css-variables | title, description, keywords, faq       |
| theme example          | A · mui.com/material-ui/customization/theming/ #7          | <100   | **2600**   | -   | theming       | keywords                                |
| theming                | A · mui.com/material-ui/customization/theming/ #1          | >1K    | **1400**   | 10  | theming       | title, description, keywords, lede      |
| design tokens          | A · atlassian.design/foundations/design-tokens #1          | >100   | **600**    | 39  | tokens        | title, description, keywords, lede, faq |
| custom css             | B · developer.mozilla.org Properties/--\* #8               | <100   | **500**    | -   | override      | keywords, faq                           |
| css variable           | A · developer.mozilla.org Using_custom_properties #1       | <100   | **200**    | -   | css-variables | keywords                                |
| css custom properties  | F · css-tricks.com complete-guide-to-custom-properties #4  | >100   | **150**    | 41  | css-variables | keywords, faq                           |
| what are design tokens | H · designsystem.digital.gov/design-tokens/ #5             | >100   | **150**    | -   | tokens        | keywords, faq                           |
| dark mode toggle       | B · dev.to/abbeyperini/toggle-dark-mode-in-react #6        | <100   | **150**    | 7   | dark-mode     | keywords, faq                           |
| color tokens           | I · fluent2.microsoft.design/color-tokens #5               | >100   | **150**    | 4   | tokens        | keywords                                |
| what is a design token | H · design.gitlab.com/product-foundations/design-tokens #6 | <100   | **100**    | -   | tokens        | keywords                                |
| design system tokens   | D · atlassian.design/foundations/design-tokens #1          | <100   | **90**     | 29  | tokens        | keywords                                |
| css color variables    | I · developer.mozilla.org Using_custom_properties #1       | <100   | **70**     | -   | css-variables | keywords                                |
| css root variables     | F · developer.mozilla.org Using_custom_properties #1       | <100   | **60**     | -   | css-variables | keywords                                |
| theme provider         | D · emotion.sh/docs/theming #8                             | <100   | **30**     | 23  | theming       | keywords, description, faq              |

All fifteen clear the >=20/mo gate. Also past the gate but cut for redundancy or brand ownership:
`variables in css` 90, `design tokens explained` 60, `design system token` 50, `custom properties`
50, `light mode dark mode toggle` 50, `design tokens examples` 40, `color token` 40, `design
token` 100, `token design` 150, `toggle dark mode` 30, `custom properties css` 20.

## Rejected clusters

- **Consumer dark mode** (`google docs dark mode`, `dark mode snapchat`, `amazon dark mode`,
  `outlook dark mode`, `gmail dark mode`, `excel dark mode`, `how to turn on dark mode`,
  `is dark mode better for your eyes`, `does dark mode save battery`). >10K each and the largest
  volume in the whole seed set. Different subject: an end user toggling a setting in a shipped
  app. Nothing on this page answers it.
- **Seasonal colour analysis** (`soft autumn color palette`, `deep winter color palette`,
  `summer color palette`, and ~14 more at >10K from the `color palette` seed). Personal styling,
  not UI colour. The single largest volume block mined and entirely off-subject.
- **`color tokens` head SERP** - `colortokens.com` is a cybersecurity vendor and holds #1, #2
  (LinkedIn) and #6 (Gartner). The design-intent slice is real (Microsoft Fluent at #5, 150/mo) so
  the keyword ships, but the term can never carry the title.
- **`white label`** (>1K). Dominated by white-label SEO agencies and Dewar's White Label whisky.
  The rebranding trigger angle produced nothing usable.
- **`theming` homographs** (`zoo theming`, `theming companies`, `day theming`, `civ 5 theming
bonus`, `mickey theming`, `theming in research`, `google messages chat theming`). Present in the
  idea set, but the live SERP for bare `theming` is developer-resolved - MUI's doc is #1 - so the
  term survives as the primary. Recorded so this is not re-litigated.
- **Brand-owned theming terms** (`next-themes` 300/mo, `next themes` 250/mo, `mui theme` 150/mo,
  `themeprovider` 60/mo, `mui dark mode` 60/mo, `material ui themeprovider` 20/mo,
  `muithemeprovider` 30/mo, `shadcn theme generator`). Real traffic, another package's name.
- **`css @property`** 30/mo (w3schools #4). Different CSS feature - registered custom properties
  with `@property` syntax. This library uses plain custom properties and registers none, so the
  page would not be a true answer.
- **Figma / Style Dictionary tooling** (`figma tokens`, `figma design tokens`, `how to export
design tokens from figma`, `style dictionary design tokens documentation`, `w3c design tokens
community group specification`). A token pipeline this library has no part in - the types here
  are generated from the shipped CSS, not imported from Figma.
- **`styled components`, `tailwind theme`, `tailwind theme generator`** - competing stacks. The
  page's position is that it uses neither, which is a differentiator in prose, not a keyword to
  chase.
- **`css style override`** KD 0 but no competitor proved >=20/mo for it; its idea set is InDesign,
  Grafana, PrimeVue and Sims 4. Failed the traffic gate.

## Sibling collisions

None. The nine shipped `content/seo/*.ts` entries are all component-effect pages (confetti,
odometer, lens, morphing-text, typing-lines, weight-field, flow-field, the two feed replicas);
their arrays hold animation and clone terms with no overlap on theming, tokens or CSS variables.

Per the run brief, the `introduction` page is claiming the category head terms
`react component library` and `design system`. Neither appears in this page's title, description
or keywords. `design system tokens` is kept here because it is the token cluster, not the category
term, and it is proven on Atlassian's token page rather than a library homepage.

## Open questions

None. Every FAQ claim is verifiable in `src/tokens/theme.tsx`, `src/tokens/*.css`,
`apps/docs/components/pages/theming.tsx` and `README.md`.
