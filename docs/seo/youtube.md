# youtube - keyword research

Primary: youtube clone (KD 0, >100, ranks for: youtube-clone-app-fay.vercel.app #1 / 600 mo,
dev.to/soorajsnblaze333 #4 / 600 mo, github.com/topics/youtube-clone #7 / 600 mo)

Secondary: youtube ui (KD 3, >100, dribbble.com/tags/youtube-ui #3 / 150 mo, figma.com
"YouTube UI - Free UI Kit (recreated)" #1 / 150 mo), youtube mockup (KD 0, >100, six pages
ranking at 150 mo), youtube shorts ui (KD 0, figma.com #2 / 80 mo, halgatewood.com #3 / 80 mo),
youtube interface (figma.com #5 / 70 mo), video ui (figma.com #10 / 50 mo)

## The word is the problem

`youtube` is one of the highest-volume strings on the internet and essentially none of it is
this page. The bare seed returns `youtube` (>10M), `youtube tv` (>1M), `youtube music` (>1M),
`youtube to mp3` (>1M), `youtube kids` (>1M), `youtube downloader`, `youtube premium`,
`is youtube down` (>100K) and `why is youtube not working` (>10K). Every one of those is a
person who wants to watch, download or fix YouTube. The research therefore spent its effort on
proving which _narrow_ terms are ours, not on sizing the head term.

Three whole crowds stand in front of the developer this page is for, and one of them is a
genuinely adjacent developer.

**The viewer.** Watching, music, downloaders and converters, Premium, TV activation, "youtube
not working". The largest block by an order of magnitude and none of it is ours. It also
contaminates the terms that look like ours: `youtube shorts` (>100K) is almost entirely
`how to disable youtube shorts` / `how to block youtube shorts` / `youtube shorts downloader`.

**The creator and the marketer.** `youtube thumbnail` (>10K), `youtube thumbnail size` (>10K),
`youtube thumbnail maker`, `youtube template` (>1K, meaning channel art, intros, outros and end
screens), `youtube studio`, `how to make money on youtube`, `how much does youtube pay per
view`. Asset specifications and channel growth, not interface code.

**The embedder.** `youtube embed` (>100, Hard), `youtube embed code`, `youtube embed generator`,
`how to embed a youtube video` (>100), `how to embed youtube video in html`, `responsive
youtube embed`, plus the React half - `react youtube player`, `react youtube iframe api`,
`how to play youtube video in react js`. See the decision below; this is the one rejected
cluster that is a real developer with a real problem.

## Why `youtube ui` cannot lead, unlike its siblings

On the Instagram and Facebook pages, `<platform> ui` was the clean term - the SERP was Figma
files, Dribbble tags and PSD freebies, i.e. our crowd. **YouTube is different.** `youtube ui`
returns, in order: a Reddit thread "what is with these new UI changes", two YouTube videos, the
Google support thread "New visual updates for YouTube", androidauthority.com's "the new YouTube
UI is a mess", and only at #6 `dribbble.com/tags/youtube-ui`. The generator agrees: `new
youtube ui`, `youtube ui change`, `youtube ui update`, `old youtube ui`, `revert youtube ui`,
`new youtube ui sucks` are the whole >100 band. Same story for `youtube layout` (>100,
`old youtube layout`, `how to change youtube layout back to normal`), `youtube interface`
(`what happened to youtube interface`, `how to get old youtube interface`) and `youtube
redesign` (`youtube redesign sucks`, `youtube redesign extension`).

So the redesign-complaint crowd owns the `<platform> ui` shape on this platform, which is the
single biggest structural difference between this page and its two siblings. `youtube ui` is
still kept and still worth 150/mo - dribbble and the recreated Figma UI kit both earn from it -
but it cannot carry the title alone.

## Why `youtube clone` leads instead

It is the one term in this subject where the SERP is 100% our crowd and the traffic is real:
KD **0**, >100 volume, **600/mo** proven across three pages, and the top ten is a deployed
clone (`youtube-clone-app-fay.vercel.app`, #1), a dev.to author page (#3) and
`github.com/topics/youtube-clone` (#6). Nothing on it is a product page, a support thread or a
static asset. The `X clone` pattern is proven across the neighbourhood too - the `ui clone`
seed returned `chatgpt ui clone`, `discord ui clone`, `spotify ui clone`, `whatsapp ui clone`
and, organically, **`youtube ui clone`**; the `clone react` seed returned `twitter clone
react`, `netflix clone react`, `slack clone react`, `notion clone react`.

The title is `YouTube Clone UI - React Feed & Shorts` rather than bare `YouTube Clone` for the
same reason facebook-feed said `Facebook UI Clone`: `youtube clone script`, `best youtube clone
script` and `youtube clone app development` are offshore turnkey-app lead-gen, and `how to
clone a youtube channel` / `how do i clone my voice for youtube videos` are something else
again. The word `UI` collapses all of that in the title itself.

## The embed cluster - deliberately rejected, answered once

This is the hardest call on the page, because unlike the viewer and the creator, the person
searching `how to embed youtube video in html` or `how to play youtube video in react js` **is**
a React developer building a video interface. The volume is real (`youtube embed` >100 Hard,
`how to embed a youtube video` >100, and a full generator page of `youtube embed code`,
`youtube embed generator`, `responsive youtube embed`, `youtube embed url format`).

It is rejected as a target anyway, and the reason is not competition - it is that the claim
would be false. The component has no YouTube API call, no iframe, no player and no play path:
`YouTube.tsx` renders three static surfaces, `media.tsx` renders an `<img>` for a string or
wraps your node, and the Shorts play control only flips its own glyph and calls
`onPausedChange` - the prop doc says in as many words that "the component never touches the
media element itself". Ranking for `embed youtube video` would put a person one click from a
page that cannot do the thing they asked for. That is the same line facebook-feed drew at Smash
Balloon's embed-widget market.

What the page does instead is answer the boundary once, in an FAQ that names the real answer
(the YouTube iframe player, or `react-youtube`) and then says what this is: the interface
_around_ the video. That converts the adjacency into a correct hand-off rather than a bounce,
and it means the words `embed`, `iframe` and `play` appear on the page attached to a true
sentence. No embed term is in the `keywords` array.

## The split with instagram-feed and facebook-feed

The two shipped social pages hold the shared social-UI vocabulary (`social feed ui`, `news feed
ui`, `social media post ui`, `post card`), so none of it appears here. That cost nothing: the
proof says YouTube's own half of the vocabulary is a different set of words entirely - `clone`,
`mockup`, `shorts ui`, `shorts overlay` and `video ui`. The one live collision is in the
competitor data, not the keyword set: `halgatewood.com/shorts-previewer` earns 90/mo from
`instagram reels overlay png` and `createcomfy.com` earns 200/mo from `instagram reel safe zone
template` alongside their YouTube terms. Those Instagram rows are the sibling's ground and are
not claimed here.

## Kept (147 keywords)

| keyword                                       | source                                                                                                                     | volume | kd  | traffic/mo | cluster           | placed in                               |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------ | --- | ---------- | ----------------- | --------------------------------------- |
| youtube clone                                 | generator:A (youtube clone); traffic:vercel #1/600, dev.to #4/600, github.com/topics #7/600                                | >100   | 0   | 600        | primary           | title, description, lede, keywords, faq |
| youtube clones                                | traffic:youtube-clone-app-fay.vercel.app #2/100                                                                            | -      | -   | 100        | primary           | keywords                                |
| youtube clone site                            | generator:A; traffic:vercel #2/50                                                                                          | <100   | -   | 50         | secondary         | keywords                                |
| youtube ui clone                              | generator:D (ui clone)                                                                                                     | <100   | -   | -          | primary           | title, faq                              |
| youtube clone website                         | generator:A (youtube clone)                                                                                                | <100   | -   | -          | secondary         | faq                                     |
| youtube clone app                             | generator:A (youtube clone)                                                                                                | <100   | -   | -          | secondary         | none                                    |
| youtube clone project                         | constructed: youtube clone + clone project                                                                                 | -      | -   | -          | use-case          | faq                                     |
| youtube clone react                           | serp: 0 entries; constructed from youtube clone + clone react                                                              | -      | -   | -          | secondary         | none                                    |
| react youtube clone                           | constructed word-order variant                                                                                             | -      | -   | -          | secondary         | none                                    |
| open source youtube clone                     | generator:A (youtube clone)                                                                                                | <100   | -   | -          | long-tail         | none                                    |
| youtube clone open source                     | generator:A (youtube clone)                                                                                                | <100   | -   | -          | long-tail         | none                                    |
| youtube clone source code                     | generator:A (youtube clone)                                                                                                | <100   | -   | -          | long-tail         | none                                    |
| youtube clone github html css                 | generator:A (youtube clone)                                                                                                | <100   | -   | -          | long-tail         | none                                    |
| youtube clone vercel                          | generator:A (youtube clone)                                                                                                | <100   | -   | -          | long-tail         | none                                    |
| youtube clone free                            | generator:A (youtube clone)                                                                                                | <100   | -   | -          | long-tail         | none                                    |
| old youtube clone                             | generator:A (youtube clone)                                                                                                | <100   | -   | -          | long-tail         | none                                    |
| youtube clone development tutorial            | generator:A (youtube clone)                                                                                                | <100   | -   | -          | use-case          | faq                                     |
| make a youtube clone from scratch             | generator:A (youtube clone)                                                                                                | <100   | -   | -          | use-case          | faq                                     |
| how to build a youtube clone                  | generator:A question                                                                                                       | <100   | -   | -          | question          | faq                                     |
| how to make a youtube clone                   | generator:A question                                                                                                       | <100   | -   | -          | question          | faq                                     |
| how to build a youtube clone tutorial         | generator:A question                                                                                                       | <100   | -   | -          | question          | faq                                     |
| how to make a website like youtube            | generator:A (youtube website) question                                                                                     | <100   | -   | -          | question          | faq                                     |
| how to build a website like youtube           | generator:A (youtube website) question                                                                                     | <100   | -   | -          | question          | faq                                     |
| youtube ui                                    | generator:A (youtube ui); traffic:dribbble.com/tags/youtube-ui #3/150, figma.com recreated-ui-kit #1/150                   | >100   | 3   | 150        | primary           | title, description, lede, keywords, faq |
| youtube ui design                             | generator:A (youtube ui); traffic:dribbble #3/20, figma.com recreated-ui-kit #2/20                                         | <100   | 0   | 20         | secondary         | keywords                                |
| youtube interface                             | generator:B (youtube interface); traffic:figma.com recreated-ui-kit #5/70                                                  | >100   | -   | 70         | secondary         | keywords, faq                           |
| video ui                                      | generator:I (video ui); traffic:figma.com recreated-ui-kit #10/50                                                          | <100   | -   | 50         | secondary         | keywords, faq                           |
| ui video                                      | traffic:figma.com recreated-ui-kit #8/20                                                                                   | -      | -   | 20         | long-tail         | none                                    |
| youtube video ui                              | generator:I (video ui)                                                                                                     | <100   | -   | -          | long-tail         | none                                    |
| youtube ui kit                                | serp: 0 entries; kd Unknown; constructed from youtube ui + ui kit                                                          | -      | -   | -          | secondary         | faq                                     |
| youtube feed ui                               | constructed; kd Unknown                                                                                                    | -      | -   | -          | secondary         | none                                    |
| youtube ui figma                              | generator:B (youtube figma)                                                                                                | <100   | -   | -          | platform-adjacent | faq                                     |
| youtube ux                                    | traffic:medium.com/@navjhot0171 #5/10 - below the >=20 gate                                                                | -      | -   | 10         | long-tail         | none                                    |
| youtube design system                         | generator:B (youtube design)                                                                                               | <100   | -   | -          | long-tail         | none                                    |
| youtube design system figma                   | generator:B (youtube design)                                                                                               | <100   | -   | -          | long-tail         | none                                    |
| youtube redesign                              | generator:B (youtube redesign)                                                                                             | >100   | -   | -          | long-tail         | none                                    |
| youtube redesign concept                      | generator:B (youtube redesign)                                                                                             | <100   | -   | -          | long-tail         | none                                    |
| youtube redesign dribbble                     | generator:B (youtube redesign)                                                                                             | <100   | -   | -          | long-tail         | none                                    |
| youtube layout                                | generator:B (youtube layout)                                                                                               | >100   | -   | -          | long-tail         | none                                    |
| new youtube layout                            | generator:B (youtube layout)                                                                                               | >100   | -   | -          | long-tail         | none                                    |
| youtube homepage interface                    | generator:B (youtube homepage)                                                                                             | <100   | -   | -          | long-tail         | none                                    |
| youtube watch page                            | generator:B (watch page)                                                                                                   | <100   | -   | -          | secondary         | description, faq                        |
| what is the youtube watch page                | generator:B (watch page) question                                                                                          | <100   | -   | -          | question          | none                                    |
| youtube mockup                                | generator:F; traffic:magnific #1/150, figma.com #2/150, mediamodifier #5/150, mockey.ai #6/150, unblast #2/100, rotato #10 | >100   | 0   | 150        | primary-adjacent  | keywords, faq                           |
| mockup youtube                                | traffic:unblast.com #3/150                                                                                                 | -      | -   | 150        | platform-adjacent | none                                    |
| youtube video mockup                          | traffic:magnific #1/40, figma.com #2/40, rotato #4/40, mockey.ai #7/40                                                     | -      | 0   | 40         | secondary         | keywords                                |
| youtube mockup generator                      | generator:F; traffic:mediamodifier #1/20, mockey.ai #2/20, magnific #4/20                                                  | <100   | -   | 20         | platform-adjacent | faq                                     |
| youtube mockup tool                           | generator:F; traffic:mockey.ai #3/10 - below the >=20 gate                                                                 | <100   | -   | 10         | platform-adjacent | none                                    |
| youtube mock up                               | traffic:magnific #1/10, figma.com #2/10 - below the >=20 gate                                                              | -      | -   | 10         | long-tail         | none                                    |
| youtube mockup psd                            | generator:F (youtube mockup)                                                                                               | <100   | -   | -          | platform-adjacent | faq                                     |
| free youtube mockup psd                       | generator:F (youtube mockup)                                                                                               | <100   | -   | -          | platform-adjacent | faq                                     |
| youtube mockup free download                  | generator:F (youtube mockup)                                                                                               | <100   | -   | -          | platform-adjacent | faq                                     |
| free youtube mockup                           | generator:F (youtube mockup)                                                                                               | <100   | -   | -          | platform-adjacent | none                                    |
| figma youtube mockup                          | generator:F (youtube mockup)                                                                                               | <100   | -   | -          | platform-adjacent | faq                                     |
| youtube mockup figma                          | generator:F (youtube mockup)                                                                                               | <100   | -   | -          | platform-adjacent | faq                                     |
| youtube mockup template                       | generator:F (youtube mockup)                                                                                               | <100   | -   | -          | platform-adjacent | faq                                     |
| youtube mockup vector                         | generator:F (youtube mockup)                                                                                               | <100   | -   | -          | platform-adjacent | none                                    |
| youtube mockup png                            | generator:F (youtube mockup)                                                                                               | <100   | -   | -          | platform-adjacent | none                                    |
| youtube mockup phone                          | generator:F (youtube mockup)                                                                                               | <100   | -   | -          | long-tail         | none                                    |
| youtube mockup mobile                         | generator:F (youtube mockup)                                                                                               | <100   | -   | -          | long-tail         | none                                    |
| live youtube mockup                           | generator:F (youtube mockup)                                                                                               | <100   | -   | -          | long-tail         | none                                    |
| how to create a youtube thumbnail mockup      | generator:F question                                                                                                       | <100   | -   | -          | question          | none                                    |
| youtube screenshot                            | generator:F (youtube screenshot)                                                                                           | >1K    | -   | -          | platform-adjacent | faq                                     |
| youtube screenshot generator                  | generator:F (youtube screenshot)                                                                                           | <100   | -   | -          | platform-adjacent | faq                                     |
| youtube screenshot tool                       | generator:F (youtube screenshot)                                                                                           | <100   | -   | -          | platform-adjacent | none                                    |
| youtube screenshot example                    | generator:F (youtube screenshot)                                                                                           | <100   | -   | -          | platform-adjacent | none                                    |
| youtube interface screenshot                  | generator:B (youtube interface)                                                                                            | <100   | -   | -          | platform-adjacent | faq                                     |
| youtube homepage screenshot                   | generator:B (youtube homepage)                                                                                             | >100   | -   | -          | platform-adjacent | none                                    |
| youtube homepage desktop screenshot           | generator:B (youtube homepage)                                                                                             | <100   | -   | -          | platform-adjacent | none                                    |
| youtube video watch page screenshot desktop   | generator:B (watch page)                                                                                                   | <100   | -   | -          | platform-adjacent | none                                    |
| youtube video watch page screenshot dark mode | generator:B (watch page)                                                                                                   | <100   | -   | -          | platform-adjacent | none                                    |
| youtube video watch page screenshot realistic | generator:B (watch page)                                                                                                   | <100   | -   | -          | platform-adjacent | none                                    |
| youtube shorts ui                             | generator:B (shorts ui); traffic:figma.com/youtube-shorts-ui #2/80, halgatewood.com #3/80, michaelghelfistudios #9/80      | <100   | 0   | 80         | secondary         | keywords, faq                           |
| youtube shorts overlay                        | traffic:halgatewood.com/shorts-previewer #1/80                                                                             | -      | 26  | 80         | secondary         | keywords, faq                           |
| youtube short overlay                         | traffic:halgatewood.com/shorts-previewer #1/20                                                                             | -      | -   | 20         | secondary         | keywords                                |
| youtube shorts layout                         | traffic:figma.com/youtube-shorts-ui #9/50, magnific shorts-template #8/50                                                  | -      | -   | 50         | secondary         | keywords                                |
| youtube shorts overlay png                    | generator:B (shorts ui); traffic:halgatewood.com #1/20                                                                     | <100   | -   | 20         | asset             | faq                                     |
| youtube shorts ui overlay                     | generator:B (shorts ui)                                                                                                    | <100   | -   | -          | secondary         | faq                                     |
| youtube shorts ui template                    | generator:B (shorts ui)                                                                                                    | <100   | -   | -          | secondary         | faq                                     |
| youtube shorts ui figma                       | generator:B (shorts ui)                                                                                                    | <100   | -   | -          | platform-adjacent | faq                                     |
| youtube shorts ui example                     | generator:B (shorts ui)                                                                                                    | <100   | -   | -          | secondary         | none                                    |
| youtube shorts ui png                         | generator:B (shorts ui)                                                                                                    | <100   | -   | -          | asset             | none                                    |
| youtube shorts ui phone                       | generator:B (shorts ui)                                                                                                    | <100   | -   | -          | long-tail         | none                                    |
| new youtube shorts ui                         | generator:B (shorts ui)                                                                                                    | <100   | -   | -          | long-tail         | none                                    |
| old youtube shorts ui                         | generator:B (shorts ui)                                                                                                    | <100   | -   | -          | long-tail         | none                                    |
| yt shorts ui                                  | generator:B (shorts ui)                                                                                                    | <100   | -   | -          | long-tail         | none                                    |
| youtube shorts vertical video ui              | generator:I (video ui)                                                                                                     | <100   | -   | -          | long-tail         | none                                    |
| yt shorts template                            | traffic:figma.com #2/10, magnific #8/10 - below the >=20 gate                                                              | -      | -   | 10         | long-tail         | none                                    |
| youtube component                             | generator:D (youtube component)                                                                                            | <100   | -   | -          | secondary         | none                                    |
| react youtube component                       | generator:D (youtube component)                                                                                            | <100   | -   | -          | secondary         | none                                    |
| angular youtube component                     | generator:D (youtube component)                                                                                            | <100   | -   | -          | long-tail         | none                                    |
| vue youtube component                         | generator:D (youtube component)                                                                                            | <100   | -   | -          | long-tail         | none                                    |
| framer youtube component                      | generator:D (youtube component)                                                                                            | <100   | -   | -          | long-tail         | none                                    |
| youtube react                                 | generator:C (youtube react)                                                                                                | <100   | -   | -          | long-tail         | none                                    |
| youtube react js                              | generator:C (youtube react)                                                                                                | <100   | -   | -          | long-tail         | none                                    |
| react youtube                                 | generator:C (react youtube)                                                                                                | >100   | -   | -          | long-tail         | none                                    |
| youtube html                                  | generator:C (youtube html)                                                                                                 | <100   | -   | -          | long-tail         | none                                    |
| youtube html code                             | generator:C (youtube html)                                                                                                 | <100   | -   | -          | long-tail         | none                                    |
| youtube css                                   | generator:C (youtube css)                                                                                                  | <100   | -   | -          | long-tail         | none                                    |
| youtube css grid                              | generator:C (youtube css)                                                                                                  | <100   | -   | -          | long-tail         | none                                    |
| youtube css themes                            | generator:C (youtube css)                                                                                                  | <100   | -   | -          | long-tail         | none                                    |
| youtube tailwind                              | generator:C (youtube tailwind)                                                                                             | <100   | -   | -          | long-tail         | none                                    |
| youtube tailwind css                          | generator:C (youtube tailwind)                                                                                             | <100   | -   | -          | long-tail         | none                                    |
| youtube grid                                  | generator:B (youtube grid)                                                                                                 | <100   | -   | -          | long-tail         | none                                    |
| youtube grid layout                           | generator:B (youtube grid)                                                                                                 | <100   | -   | -          | long-tail         | none                                    |
| youtube grid css                              | generator:B (youtube grid)                                                                                                 | <100   | -   | -          | long-tail         | none                                    |
| youtube video grid                            | generator:B (video grid)                                                                                                   | <100   | -   | -          | long-tail         | none                                    |
| youtube video grid layout                     | generator:B (video grid)                                                                                                   | <100   | -   | -          | long-tail         | none                                    |
| video grid                                    | generator:B (video grid)                                                                                                   | <100   | -   | -          | long-tail         | none                                    |
| bootstrap video grid template                 | generator:B (video grid)                                                                                                   | <100   | -   | -          | long-tail         | none                                    |
| youtube page template                         | generator:B (youtube page)                                                                                                 | <100   | -   | -          | long-tail         | none                                    |
| youtube website template free                 | generator:A (youtube website)                                                                                              | <100   | -   | -          | long-tail         | none                                    |
| ui kit                                        | generator:D (ui kit)                                                                                                       | >100   | -   | -          | long-tail         | none                                    |
| react ui kit                                  | generator:D (ui kit)                                                                                                       | <100   | -   | -          | long-tail         | none                                    |
| web ui kit                                    | generator:D (ui kit)                                                                                                       | >100   | -   | -          | long-tail         | none                                    |
| figma ui kit                                  | generator:D (ui kit)                                                                                                       | >100   | -   | -          | long-tail         | none                                    |
| shadcn ui kit                                 | generator:D (ui kit)                                                                                                       | >100   | -   | -          | long-tail         | none                                    |
| ui clone                                      | generator:D (ui clone)                                                                                                     | <100   | -   | -          | pattern           | none                                    |
| chatgpt ui clone                              | generator:D (ui clone)                                                                                                     | <100   | -   | -          | pattern           | none                                    |
| discord ui clone                              | generator:D (ui clone)                                                                                                     | <100   | -   | -          | pattern           | none                                    |
| spotify ui clone                              | generator:D (ui clone)                                                                                                     | <100   | -   | -          | pattern           | none                                    |
| whatsapp ui clone                             | generator:D (ui clone)                                                                                                     | <100   | -   | -          | pattern           | none                                    |
| chatgpt ui clone react                        | generator:D (ui clone)                                                                                                     | <100   | -   | -          | pattern           | none                                    |
| twitter clone react                           | generator:C (clone react)                                                                                                  | <100   | -   | -          | pattern           | none                                    |
| netflix clone react                           | generator:C (clone react)                                                                                                  | <100   | -   | -          | pattern           | none                                    |
| slack clone react                             | generator:C (clone react)                                                                                                  | <100   | -   | -          | pattern           | none                                    |
| notion clone react                            | generator:C (clone react)                                                                                                  | <100   | -   | -          | pattern           | none                                    |
| instagram clone react native                  | generator:C (clone react) - sibling ground                                                                                 | <100   | -   | -          | pattern           | none                                    |
| twitter clone project                         | generator:E (clone project)                                                                                                | <100   | -   | -          | pattern           | none                                    |
| instagram clone project                       | generator:E (clone project) - sibling ground                                                                               | <100   | -   | -          | pattern           | none                                    |
| youtube embed                                 | generator:B (youtube embed) - see the embed decision                                                                       | >100   | -   | -          | rejected-adjacent | faq                                     |
| how to embed a youtube video                  | generator:B (youtube embed) question                                                                                       | >100   | -   | -          | rejected-adjacent | faq                                     |
| how to embed youtube video in html            | generator:C (youtube html) question                                                                                        | <100   | -   | -          | rejected-adjacent | faq                                     |
| how to play youtube video in react js         | generator:C (react youtube) question                                                                                       | <100   | -   | -          | rejected-adjacent | faq                                     |
| how to add youtube video in react js          | generator:C (react youtube) question                                                                                       | <100   | -   | -          | rejected-adjacent | faq                                     |
| youtube embed player                          | generator:B (youtube embed)                                                                                                | <100   | -   | -          | rejected-adjacent | none                                    |
| responsive youtube embed                      | generator:B (youtube embed)                                                                                                | <100   | -   | -          | rejected-adjacent | none                                    |
| react youtube player                          | generator:C (react youtube)                                                                                                | <100   | -   | -          | rejected-adjacent | faq                                     |
| react youtube iframe api                      | generator:C (react youtube)                                                                                                | <100   | -   | -          | rejected-adjacent | none                                    |
| youtube api                                   | generator:A (youtube api)                                                                                                  | >1K    | -   | -          | rejected-adjacent | description, faq                        |
| does youtube have an api                      | generator:A (youtube api) question                                                                                         | <100   | -   | -          | question          | faq                                     |
| is youtube api free                           | generator:A (youtube api) question                                                                                         | <100   | -   | -          | question          | none                                    |
| youtube api create community post             | generator:A (youtube api)                                                                                                  | <100   | -   | -          | rejected-adjacent | none                                    |
| youtube card                                  | generator:D (youtube card); traffic:ytbcard.vercel.app #5/200 - YouTube's info-cards feature, see rejected                 | >100   | -   | 200        | rejected          | none                                    |
| youtube shorts template                       | traffic:magnific.com/youtube-shorts-template #6/250 - video template, see rejected                                         | -      | 1   | 250        | rejected          | none                                    |
| youtube short template                        | traffic:figma.com #10/80, magnific #7/80 - video template, see rejected                                                    | -      | -   | 80         | rejected          | none                                    |
| youtube shorts safe zone                      | traffic:createcomfy.com #3/200 - overlay asset, see rejected                                                               | -      | -   | 200        | rejected          | none                                    |
| youtube shorts safe zone template             | traffic:createcomfy.com #3/90 - overlay asset, see rejected                                                                | -      | -   | 90         | rejected          | none                                    |
| youtube shorts safe zones                     | traffic:createcomfy.com #2/80 - overlay asset, see rejected                                                                | -      | -   | 80         | rejected          | none                                    |
| youtube video player template                 | traffic:figma.com/free-youtube-video-player-mockups #1/20 - implies a player, see rejected                                 | -      | -   | 20         | rejected          | none                                    |
| mockup capa youtube                           | traffic:unblast.com #3/30 - Portuguese channel-art mockup                                                                  | -      | -   | 30         | rejected          | none                                    |

## Rejected clusters

- **The viewer.** `youtube` (>10M), `youtube tv` (>1M), `youtube music` (>1M), `youtube to
mp3` (>1M), `youtube kids` (>1M), `youtube to mp4`, `youtube downloader`, `youtube video
downloader`, `youtube premium`, `youtube tv login`, `youtube tv cost`, `is youtube down`
  (>100K), `why is youtube not working` (>10K), `how to download youtube videos` (>10K),
  `youtube shorts downloader` (>10K), `download youtube shorts`, `youtube shorts to mp4`,
  `how to disable youtube shorts` (>1K), `how to block youtube shorts` (>1K), `how to turn off
youtube shorts` (>1K), `unblocked youtube website`, `how to block youtube website`. Enormous
  volume, all wrong. This is the entire head term and most of the `youtube shorts` seed.
- **The creator and the marketer.** `youtube thumbnail` (>10K), `youtube thumbnail size`
  (>10K), `youtube thumbnail downloader` (>10K), `youtube thumbnail maker`, `youtube thumbnail
generator`, `youtube thumbnail template`, `canva youtube thumbnail`, `youtube template` (>1K -
  channel art, banners, intros, outros, end screens), `youtube template banner`, `outro youtube
template`, `youtube page banner size`, `how to make money on youtube` (>10K), `how much does
youtube pay per view` (>10K), `youtube shorts monetization`, `how to rank youtube videos on
first page`, `how to promote your youtube page`, `youtube studio`. Growing a channel and making
  assets for it. Not interface code. The whole `youtube thumbnail`, `youtube template` and
  `youtube design` seeds are this crowd (`youtube design` returned twenty variants of "how to
  design a youtube thumbnail / banner / logo / intro").
- **Embedding and the iframe player.** `youtube embed` (>100, Hard), `youtube embed code`,
  `youtube embed code generator`, `youtube embed generator`, `youtube embed link`, `youtube
embed url format`, `responsive youtube embed`, `fast youtube embed`, `how to embed a youtube
video` (>100), `how to embed a youtube video in powerpoint / google slides / canva` (>100
  each), `how to embed youtube video in html`, `how to embed youtube shorts`, `embed youtube
html`, plus the React half - `react youtube player`, `react youtube iframe api`, `react youtube
iframe`, `npm react youtube`, `how to play youtube video in react js`, `how to embed youtube
video in react native`. **Deliberately rejected** - this is a genuinely adjacent developer, and
  the reason is honesty, not difficulty: there is no iframe, no player and no play path in the
  component, so ranking here would land someone on a page that cannot do what they asked. The
  full argument is in the section above. Answered once in the FAQ, which names the real answer
  and states plainly that this does not play YouTube content. No embed term is in `keywords`.
- **The YouTube Data API.** `youtube api` (>1K), `youtube api key` (>1K), `how to get youtube
api key` (>100), `youtube api pricing`, `youtube api v3`, `youtube api transcript`, `is youtube
api free`, `youtube api create community post`. Same boundary as the embed cluster: there is no
  API call in the component. Kept only as the FAQ that says so.
- **"YouTube changed the UI, put it back."** `new youtube ui`, `old youtube ui`, `youtube ui
change`, `youtube ui update`, `revert youtube ui`, `how to revert youtube ui`, `new youtube ui
sucks`, `why did youtube change the ui`, `youtube ui bigger`, `old youtube layout`, `how to
change youtube layout back to normal`, `2009/2010/2012/2016 youtube layout`, `what happened to
youtube interface`, `how to get old youtube interface`, `youtube redesign sucks`, `youtube
redesign extension`, `new youtube design sucks`. This owns the `youtube ui` SERP - Reddit at
  #1, the Google support thread at #3, androidauthority at #5 - and is the structural reason
  `youtube ui` could not lead this page the way `instagram ui` and `facebook ui` led theirs.
- **Shorts UI, but the "make it go away" half.** `youtube shorts ui not showing`, `youtube
shorts ui disappeared`, `youtube shorts ui missing`, `youtube shorts ui gone`, `youtube shorts
ui broken`, `how to hide ui on youtube shorts`, `how to remove ui from youtube shorts`, `why do
some youtube shorts have no ui`, and the Firefox "YouTube Shorts UI Hider" add-on that ranks
  #5. The head term `youtube shorts ui` is still kept and still proven at 80/mo through the
  Figma file and halgatewood's previewer; only these phrasings are dropped.
- **Shorts as a video-editing format.** `youtube shorts template` (250/mo proven, KD 1),
  `youtube short template` (80/mo), `youtube shorts safe zone` (200/mo), `youtube shorts safe
zones` (80/mo), `youtube shorts safe zone template` (90/mo), `yt shorts template`, the Canva
  and Adobe Express template galleries that own the `youtube shorts layout` SERP. These are
  proven and they are about the same rectangle we draw, which makes them tempting - but the
  searcher wants a downloadable overlay or a video-editor template to cut footage against, not
  a React component. `youtube shorts overlay` and `youtube shorts layout` are kept because a
  live replica genuinely answers "what does the Shorts chrome look like"; `template` and
  `safe zone` are not, because they name an asset we do not ship.
- **Fake and prank generators.** `fake youtube channel` (150/mo proven), `fake youtube video
maker` (100/mo), `fake youtube video meme maker` (100/mo), `fake youtube video generator`
  (70/mo), `fake youtube video template` (30/mo), `fake youtube channel maker` (30/mo), `fake
youtube website` (>100), `best fake youtube website`, `fake youtube page`, `fake youtube
screenshot`. mediamodifier and social.rotato.app earn real traffic here. Rejected on the same
  grounds facebook-feed rejected `fake facebook post`: the intent is deception, and the honest
  half of it (`youtube mockup`) is kept and answered instead.
- **`youtube card` = info cards.** 200/mo proven and it looks like ours, but the SERP is
  Google's own `support.google.com/youtube/answer/6140493`, wistia's "how YouTube cards work",
  `youtube info cards guide` and artlist's blog - the creator feature that pops a suggested
  video mid-playback. Plus the generator's `youtube gift card`, `youtube card tricks`, `youtube
card making stampin up` and `youtube card collection roblox codes`. Four unrelated subjects on
  one string.
- **`video card` = GPU.** `video card benchmarks`, `best video card for gaming`, `rtx 3060 lhr
video card`, `update video card driver`, `is a video card a gpu`. The entire seed. The reason
  the copy never says "video card" for the feed tile.
- **`video component` = RCA cables.** `video component cable`, `hdmi to video component`,
  `is s video better than component`, `does component video support 1080p`, `audio video
component rack`. Same shape as the GPU collision.
- **`video player` and `media player` = desktop software.** `vlc media player` (>100K),
  `windows media player` (>10K), `media player classic`, `best video player`, `mp4 video player`,
  `how to trim video in windows media player`. Nothing in either seed is a UI component.
- **Alternative YouTube front-ends.** `youtube frontend` (>100, Medium), `piped youtube
frontend`, `invidious youtube frontend`, `alternative youtube frontend`, `self hosted youtube
frontend`, `open source youtube frontend`, `materialious`, `cloudtube`. These are proxies that
  fetch and play real YouTube content - the opposite of what this is, and the closest thing to
  a genuine false positive in the set.
- **Clone-script sales and account cloning.** `youtube clone script`, `best youtube clone
script`, `youtube clone apk`, `how to clone a youtube channel`, `how to clone youtube app`.
  Rides in on `youtube clone` and is why the title reads `YouTube Clone UI`, not `YouTube
Clone`.
- **`clone` = something else entirely.** `how do i clone my voice for youtube videos`, `how to
clone a marijuana plant youtube`, `how to clone cannabis plants youtube`, `youtube how to use
clone stamp tool`, `how to clone a hard drive youtube`, `how to clone a sim card youtube`,
  `how to clone a project in jira`, `how to clone project from github`, `clone react element`.
  YouTube as the tutorial medium, plus git and Jira.
- **YouTube as the medium, not the subject.** `youtube figma tutorial`, `kevin powell youtube
css`, `youtube html tutorial channel`, `best react youtube channels`, `youtube react tutorial`,
  `freecodecamp react youtube`. The `youtube figma` and `youtube css` seeds are almost entirely
  this. Also the reaction-video half of `react youtube` - `how to react to youtube videos`,
  `can you react to youtube videos on twitch`, `youtube react try not to laugh`.
- **Shared social vocabulary held by the siblings.** `instagram reels overlay png` (90/mo on
  halgatewood), `instagram reel safe zone template` (200/mo on createcomfy), `reels safe zone
template` (150/mo), `instagram clone react native`, `instagram clone project`, `tiktok video
ui`, `tiktok short video feed`. Not rejected on intent - rejected on ownership. instagram-feed
  and facebook-feed hold the social-feed vocabulary and the tiktok page is in the same round.
- **Noise.** `youtube grid trading bot mexc tutorial`, `youtube card collection roblox codes`,
  `meta vibes ai video feed`, `drones with live video feed`, `nike epic react youtube`,
  `youtube react girls nude`, `youtube design to the nines`, `video ui exe how to close`,
  `chud the builder youtube page`, `eva draconis youtube page`, and a physics word problem
  about decibels that the question generator returned twice.

## Method

- 43 `generator` seeds across three waves, every one a single word or a broad pair: youtube,
  youtube ui, youtube clone, youtube shorts, youtube component, youtube template, youtube
  mockup, youtube figma, youtube thumbnail, youtube design, youtube layout, youtube interface,
  youtube embed, youtube css, youtube screenshot, youtube api, youtube page, youtube website,
  youtube homepage, youtube redesign, youtube react, youtube html, youtube tailwind, youtube
  card, youtube grid, youtube frontend, react youtube, video card, video feed, video component,
  video player, video ui, video grid, video thumbnail, watch page, shorts ui, media player,
  thumbnail preview, ui kit, ui clone, shorts clone, clone react, clone project. **1,457 unique
  rows** - 827 keywords, 630 questions.
- 13 `serp` head terms. `youtube clone react`, `youtube ui clone`, `youtube ui kit` and
  `youtube clone github` all returned an empty table - no SERP data at all, which is the same
  finding instagram-feed made: nobody is answering "I want the YouTube UI as a component".
- 22 `traffic` pulls - 19 ranking URLs plus three competitor domains. One domain pull
  (`mockey.ai`) failed upstream; its ranking page pull succeeded and is what the table cites.
- 15 exact `kd` scores on the title and description shortlist.

## Notes for whoever ships this

- Every FAQ claim was read out of the source, not the usage doc: the three surfaces and the
  full prop set (`YouTube.tsx`), `Media` rendering an `<img>` for a string and wrapping your
  node otherwise with `.zc-youtube__media > *` at `width/height: 100%` (`media.tsx`,
  `youtube.css`), the 533px card / 16:9 thumbnail / 36px avatar / two-line `-webkit-line-clamp`
  title (`youtube.css`), the 477px 9:16 Shorts stage and its `--youtube-progress` track
  (`short.tsx`, `youtube.css`), and the 638px post card around a 508px 1:1 carousel viewport
  with rubber-banding at `travel / 6`, a 25% commit ratio and a flick at 8px / 420px-per-second
  (`post.tsx`, `youtube.css`).
- The reduced-motion claim is indirect and worth knowing: `youtube.css` has no
  `prefers-reduced-motion` block of its own. The carousel transition uses `--duration-slower`
  and the Shorts progress bar uses `--duration-slow`, and `src/tokens/motion.css` collapses
  both to `1ms` under `prefers-reduced-motion: reduce`. That is why the FAQ says they "snap
  into place" rather than claiming a dedicated guard.
- `views` is a pre-formatted string the consumer passes ("2m views"), not a number - unlike
  `likes` (`compactCount`: 187000 -> "187k") and `comments` (`groupedCount`: 3539 -> "3,539").
  No copy implies the component formats view counts.
- `paused` and `progress` are consumer state. The Shorts control fires `onPausedChange` and
  moves its own glyph; nothing plays, nothing ticks. This is the single most important thing
  the page has to say, given the embed cluster standing next to it.
