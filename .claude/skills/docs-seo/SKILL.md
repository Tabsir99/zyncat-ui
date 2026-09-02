---
name: docs-seo
description: Research and write the SEO/AEO entry for one docs page of ui.zyncat.app - mine keywords from every angle via kwr (Ahrefs), keep only what competitor traffic proves, then write the title, description, keyword set, lede and FAQ in apps/docs/content/seo/<slug>.ts. One page per run. Give it the slug.
---

# docs-seo - one page, researched properly

Optimise one page: `https://ui.zyncat.app/<slug>`. Goal: any search about this
subject, from any angle, lands here. Never invent a capability the component
lacks, never drag in a different subject. Write two files and nothing else -
`apps/docs/content/seo/<slug>.ts` and `docs/seo/<slug>.md` - never touching
`content/seo/index.ts`, the registry, or a page component. Report in the format
at the bottom.

## Tool and volume rules

- Pass absolute `--out`/`--md` paths under your research directory; never let
  `kwr` default to `temp/`. Results cache one hour. Use `batch <plan.json>` for
  every multi-query step.
- A `kwr mint` server runs at `127.0.0.1:9500`; your calls find it and launch no
  browser. Check `/health` before a long batch, report it if down, never pass
  `--browser` or `--port`.
- `generator` returns <=20 ideas + <=20 questions per seed; `--limit` cannot
  raise it. Seeds are ONE OR TWO BROAD WORDS - three words returns zero, and so
  do over-specific pairs. Seed the head term, not the phrase you want to rank
  for.
- `serp` rows live under `entries`, `traffic` rows under `topKeywords` and
  `topPages` - never `results`. `serp` has data only for head terms; an empty
  table is a signal, not an error.

- `generator` volume is a bucket (`<100`, `>100`, `>1K`, `>10K`). A bucket is
  never evidence; `<100` spans 1 to 99. `traffic <url>` returns a real integer
  per keyword, the only proof that exists.
- **A keyword ships only if `traffic` proves >=20 monthly visits.** Collect
  widely (100+ candidates), ship narrowly. Most candidates die here.

## Step 1 - know the page

Read the `registry.tsx` entry, the page component under
`apps/docs/components/pages/`, and `get_component` from the zyncat-ui MCP server
(guide pages: the page component and `README.md`). Note what it is, the words
its props and variants use, and the platform facts (React 19, no Tailwind, zero
deps, SSR, reduced motion, MIT). Every FAQ claim must be provable here.

## Step 2 - seed matrix

Rows are the subject's names, including what people call it when they do not
know its name. Columns are the angles below. Twelve seeds minimum, one per angle
minimum, every seed one or two broad words.

`A` bare head term · `B` the behaviour described · `C` the stack word people add
· `D` artifact (component, library, npm, code) · `E` the trigger moment · `F`
platform/format (gif, powerpoint, lottie, overlay) · `G` shopping (best,
alternatives, free) · `H` how they ask an assistant · `I` the product use case.
`F` is mandatory - a designer searching `confetti gif` still wants confetti.

Read the shipped `apps/docs/content/seo/*.ts` too: keywords already in a
sibling's array are taken, so pick different ground and record the collision.

## Step 3 - seeds, then proof

Batch every seed, merge, dedupe. Under 100 unique rows means the seeds overlap -
add angles, not synonyms. Keep each seed's `questions` array; it is the FAQ raw
material. Then mine what ranks, the only source of proof: `serp` the 3-5 head
terms, collect every ranking URL, then `traffic <url>` on each (limit 20) and
`traffic <domain>` on the 2-3 strongest competitors, recording keyword, position
and traffic for every row. Finally `kd` the 10-15 title and description
candidates - under 20 is winnable, 20-40 needs the best answer on the page, over
40 belongs in copy and never the title.

## Step 4 - the record

`docs/seo/<slug>.md`: primary and secondary with KD, volume and proof; a kept
table with columns keyword, source, volume, **traffic/mo**, kd, cluster, placed
in; then rejected clusters with reasons, which stop the next agent re-litigating
them. `source` names the seed angle and competitor URL; `placed in` is one of
title, description, lede, faq, keywords, none.

## Step 5 - write the entry

Contract: `apps/docs/content/seo/types.ts`.

- **title** - <=45 chars, primary first, no suffix. Bare head terms lose to
  homographs (`odometer` is car mileage): keep the page's own name only if it
  earns its place, never bare, never first.
- **description** - 140-158 chars: primary first clause, one secondary, one
  differentiator.
- **keywords** - 10-15, ranked by proven traffic, every one past the >=20 gate.
  Google ignores this tag; it feeds the JSON-LD for answer engines, so tight
  beats long.
- **lede** - the line under the H1, replacing the blurb. **At most 115 chars**,
  two lines at its 58ch measure: what the component is, then when to reach for
  it. Natural words only - React, component, the subject noun, a real use case.
  Never a mined phrase forced into a sentence.
- **faq** - 4 to 6, preferring verbatim `generator` question rows, filled from
  angles E and F. Each answer 1-3 sentences, self-contained, naming a prop or a
  code shape, true to Step 1. It renders as an accordion, so each stands alone.

Coverage beats density: every surviving angle appears somewhere in prose. Prove
it with `pnpm --filter zyncat-ui-docs typecheck` and `prettier --write`, then:

```
slug: confetti
primary: confetti animation (KD 1, 400/mo proven, magicui #3)
secondary: react confetti, confetti effect, canvas confetti
candidates: 513 | past the >=20 gate: 41 | shipped: 15
title: React Confetti Animation Component (34 chars) | description: 151 chars
faq: 6 | rejected: confetti cake (different subject); powerpoint kept, in FAQ
open questions: <anything the props could not confirm>
```
