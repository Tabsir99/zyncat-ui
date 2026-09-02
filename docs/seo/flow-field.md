# flow-field - keyword research

Primary: react animated background (KD 1, <100, ranks for: reactbits.dev/backgrounds/grid-motion #1, shadcn.io/background #2)
Secondary: interactive background (KD 0, vantajs.com #1 on SERP), animated background (KD 12, >1K, vantajs.com #7 / 2.5K mo), background animation for website (vantajs.com #1 / 200 mo), react background animation (KD 33, grid-motion #1)

50 seeds across four `generator` waves, 1124 unique keyword rows and 681 unique
question rows before filtering. Six `serp` runs and 23 `traffic` runs supplied
the proven set. Seeds were kept to one or two words throughout - three-word
seeds return nothing.

## What the page actually is (Step 1)

`src/components/expressive/flow-field/FlowField.tsx`. A 2D canvas
(`getContext('2d')`) laying line-segment "needles" on a centred grid. Each
needle rotates toward a field angle
`(sin(x*0.011 + t*1.7) + cos(y*0.014 - t*1.2)) * 1.15` at its own jittered turn
rate. Inside `radius` of the pointer it turns to face away, grows from 7 to 18
px, and moves up a twelve-stop `--flow-field-ramp-*` colour ramp. Props:
`speed` (live), `spacing` (12-72, default 26), `radius` (40-640, default 210),
`className`, `style`, `htmlProps`. Caps: 1600 needles, DPR 2. The `loop`
primitive pauses on `IntersectionObserver` and `visibilitychange`; under
`prefers-reduced-motion` it paints one settled frame and never starts. Canvas is
`aria-hidden`; children keep their semantics. React 19, MIT, zero runtime
dependencies, no Tailwind, `'use client'` in the file.

Two honesty constraints this forced into the FAQ: it is **not** WebGL/three.js
(no shader, no extra bundle), and it is **not** Perlin or simplex noise (a sine
plus a cosine with time in the phase). Both were verified in source before the
answers were written.

## The SERP split (why `flow field` is not the target)

`serp "flow field"` returns, in order: redblobgames flow field pathfinding,
tylerxhobbs.com Flow Fields, r/gamedev flow field pathfinding, medium/bit101
Flow Fields Part I, Wikipedia Flow (mathematics), a YouTube creative-coding
video, and Embry-Riddle aero coursework. Zero product or component results. The
term is owned by generative-art tutorials, game-dev pathfinding and fluid
dynamics. `flow field` therefore appears in the FAQ and lede as the mechanism,
never as the title or the primary.

`serp "react background"` is the SERP this page belongs to: 21st.dev "365+
Background Components for React & Tailwind" #1, shadcn.io/background "100+
Animated React Background Components" #2, reactbits.dev/backgrounds/galaxy #3,
animate-ui.com #4, ui.aceternity.com/categories/background #7,
reactbits.dev/backgrounds/grid-motion #9.

## Kept (131 keywords)

| keyword                                       | source                                            | volume | kd  | cluster           | placed in                     |
| --------------------------------------------- | ------------------------------------------------- | ------ | --- | ----------------- | ----------------------------- |
| react animated background                     | generator:C, traffic:reactbits grid-motion #1     | <100   | 1   | primary           | title, keywords               |
| animated background react                     | generator:C, traffic:reactbits grid-motion #1     | <100   | 2   | primary           | keywords                      |
| interactive background                        | generator:E, serp:vantajs #1                      | <100   | 0   | primary           | title, description, lede, faq |
| react background animation                    | generator:C, traffic:reactbits grid-motion #1     | <100   | 33  | primary           | keywords, faq                 |
| animated background                           | generator:B, traffic:vantajs #7 / 2.5K            | >1K    | 12  | primary           | title, description, lede, faq |
| background animation for website              | traffic:vantajs #1 / 200                          | <100   | -   | primary           | description, keywords, faq    |
| website background animation                  | traffic:vantajs #1 / 150, sliderrev #6 / 150      | <100   | -   | secondary         | keywords                      |
| react background                              | generator:C, traffic:aceternity beams #4 / 40     | <100   | 0   | secondary         | keywords                      |
| react backgrounds                             | generator:C, traffic:grid-motion #2 / 70          | <100   | 0   | secondary         | keywords                      |
| background animation                          | generator:B, traffic:freefrontend #8 / 200        | >100   | 7   | secondary         | keywords, faq                 |
| background animations                         | traffic:shadcn.io/background #4 / 40              | <100   | 0   | secondary         | keywords                      |
| animated backgrounds                          | generator:B, traffic:shadcn.io #21 / 3.7K         | >1K    | 0   | secondary         | none                          |
| canvas background animation                   | generator:C                                       | <100   | -   | secondary         | keywords, description         |
| particle background                           | generator:B, traffic:shadcn.io/particles #9 / 100 | <100   | 0   | secondary         | keywords, faq                 |
| particles background                          | traffic:shadcn.io/particles #6 / 150              | <100   | 0   | secondary         | faq                           |
| react particle background                     | generator:C                                       | <100   | -   | secondary         | keywords                      |
| particle animation                            | generator:B, traffic:reactbits particles #2 / 60  | <100   | -   | secondary         | faq                           |
| particles animation                           | traffic:reactbits particles #1 / 20               | <100   | -   | long-tail         | none                          |
| react particles                               | traffic:magicui particles #3 / 30                 | <100   | -   | long-tail         | none                          |
| interactive background website                | generator:E                                       | <100   | -   | secondary         | keywords                      |
| interactive background for website            | generator:E                                       | <100   | -   | secondary         | faq                           |
| interactive background react                  | generator:C+E                                     | <100   | -   | secondary         | keywords                      |
| interactive backgrounds react                 | generator:E                                       | <100   | -   | long-tail         | none                          |
| interactive backgrounds for websites          | generator:E                                       | <100   | -   | long-tail         | faq                           |
| interactive background javascript             | generator:C                                       | <100   | -   | long-tail         | keywords                      |
| js interactive background                     | generator:C                                       | <100   | -   | long-tail         | none                          |
| interactive background codepen                | generator:D                                       | <100   | -   | long-tail         | none                          |
| javascript background animation               | generator:C                                       | <100   | -   | secondary         | keywords                      |
| javascript background animations              | generator:C                                       | <100   | -   | long-tail         | none                          |
| css background animation                      | generator:C, traffic:prismic #1 / 100             | <100   | -   | platform-adjacent | keywords, faq                 |
| background animation css                      | traffic:sliderrevolution #2 / 150                 | <100   | -   | platform-adjacent | faq                           |
| animated background css                       | traffic:prismic #1 / 60                           | <100   | -   | platform-adjacent | faq                           |
| css animated background                       | traffic:prismic #1 / 100                          | <100   | -   | platform-adjacent | faq                           |
| css background effects                        | traffic:freefrontend #3 / 50                      | <100   | -   | platform-adjacent | none                          |
| css background animations                     | generator:C                                       | <100   | -   | platform-adjacent | none                          |
| html animated background                      | traffic:freefrontend #4 / 40                      | <100   | -   | platform-adjacent | none                          |
| animated background component                 | generator:D                                       | <100   | -   | secondary         | keywords                      |
| react animated background component           | generator:D                                       | <100   | -   | long-tail         | none                          |
| react background component                    | generator:D                                       | <100   | -   | secondary         | keywords                      |
| background component react                    | generator:D                                       | <100   | -   | long-tail         | none                          |
| react background components                   | generator:D                                       | <100   | -   | long-tail         | none                          |
| react background animation library            | generator:D+G                                     | <100   | -   | long-tail         | none                          |
| react background animations                   | generator:C                                       | <100   | -   | long-tail         | none                          |
| react background effects                      | generator:B                                       | <100   | -   | long-tail         | none                          |
| react background particles                    | generator:C                                       | <100   | -   | long-tail         | none                          |
| cool react backgrounds                        | generator:G                                       | <100   | -   | long-tail         | none                          |
| animated react backgrounds                    | generator:C                                       | <100   | -   | long-tail         | none                          |
| react backgrounds animated                    | generator:C                                       | <100   | -   | long-tail         | none                          |
| generative background                         | angle B, matrix                                   | <100   | -   | secondary         | keywords                      |
| generative art                                | generator:A                                       | >1K    | -   | platform-adjacent | faq                           |
| interactive generative art                    | generator:A                                       | <100   | -   | long-tail         | faq                           |
| generative art algorithms                     | generator:A                                       | >100   | -   | platform-adjacent | none                          |
| processing generative art                     | generator:A                                       | <100   | -   | platform-adjacent | none                          |
| flow field                                    | generator:A, serp                                 | <100   | 12  | long-tail         | lede, faq                     |
| flow field animation                          | angle B, matrix                                   | <100   | -   | long-tail         | keywords                      |
| flow field visualization                      | generator:A                                       | <100   | -   | long-tail         | none                          |
| what is a flow field                          | generator:H                                       | <100   | -   | question          | faq                           |
| vector field                                  | generator:A                                       | >1K    | -   | long-tail         | faq                           |
| perlin noise                                  | generator:A                                       | >1K    | -   | platform-adjacent | faq                           |
| perlin noise animation                        | generator:B                                       | <100   | -   | platform-adjacent | faq                           |
| perlin noise field                            | generator:A                                       | <100   | -   | long-tail         | faq                           |
| simplex noise vs perlin noise                 | generator:G                                       | <100   | -   | platform-adjacent | faq                           |
| what is perlin noise                          | generator:H                                       | <100   | -   | question          | faq                           |
| what is perlin noise used for                 | generator:H                                       | <100   | -   | question          | faq                           |
| noise animation                               | generator:B                                       | <100   | -   | long-tail         | none                          |
| css background noise animation                | generator:C                                       | <100   | -   | long-tail         | none                          |
| grid noise animation                          | generator:B                                       | <100   | -   | long-tail         | none                          |
| fractal noise animation                       | generator:B                                       | <100   | -   | long-tail         | none                          |
| webgl background                              | generator:C                                       | <100   | 0   | platform-adjacent | faq                           |
| webgl background animation                    | generator:C                                       | <100   | -   | platform-adjacent | faq                           |
| webgl background effects                      | generator:C                                       | <100   | -   | platform-adjacent | none                          |
| threejs background                            | generator:C                                       | <100   | -   | platform-adjacent | faq                           |
| three.js particle animation website           | generator:C                                       | <100   | -   | platform-adjacent | faq                           |
| three js cursor effect                        | generator:C                                       | <100   | -   | platform-adjacent | none                          |
| canvas animation                              | generator:C                                       | >100   | -   | secondary         | description, lede, faq        |
| html5 canvas animation                        | generator:C                                       | <100   | -   | long-tail         | none                          |
| html canvas animation                         | generator:C                                       | <100   | -   | long-tail         | none                          |
| javascript canvas animation                   | generator:C                                       | <100   | -   | long-tail         | none                          |
| canvas animation library                      | generator:D                                       | <100   | -   | long-tail         | none                          |
| javascript canvas particle animation tutorial | generator:C                                       | <100   | -   | long-tail         | none                          |
| html5 canvas particle animation tutorial      | generator:C                                       | <100   | -   | long-tail         | none                          |
| particle animation website                    | generator:I                                       | <100   | -   | use-case          | none                          |
| particle animation codepen                    | generator:D                                       | <100   | -   | long-tail         | none                          |
| particle animation background                 | generator:B                                       | <100   | -   | long-tail         | none                          |
| react particle animation                      | generator:C                                       | <100   | -   | long-tail         | none                          |
| react particle animation libraries            | generator:G                                       | <100   | -   | long-tail         | none                          |
| javascript particle animation                 | generator:C                                       | <100   | -   | long-tail         | none                          |
| particles js                                  | generator:C, traffic:particles.js.org #2 / 100    | <100   | -   | platform-adjacent | keywords, faq                 |
| particle js                                   | traffic:vincentgarreau #1 / 600                   | <100   | -   | platform-adjacent | faq                           |
| particles js background                       | generator:C                                       | <100   | -   | platform-adjacent | keywords                      |
| particles js react background                 | generator:C                                       | <100   | -   | platform-adjacent | none                          |
| react particles js background                 | generator:C                                       | <100   | -   | platform-adjacent | none                          |
| particles js library                          | generator:D                                       | <100   | -   | platform-adjacent | none                          |
| particles js alternatives                     | angle G, matrix                                   | <100   | -   | platform-adjacent | none                          |
| tsparticles                                   | generator:C                                       | <100   | -   | platform-adjacent | faq                           |
| react-tsparticles                             | generator:C                                       | <100   | -   | platform-adjacent | none                          |
| how to use tsparticles in react               | generator:H                                       | <100   | -   | question          | none                          |
| vanta js                                      | generator:C, traffic:vantajs #1 / 200             | <100   | -   | platform-adjacent | faq                           |
| vanta js background                           | generator:C                                       | <100   | -   | platform-adjacent | faq                           |
| vanta js alternatives                         | generator:G                                       | <100   | -   | platform-adjacent | keywords                      |
| vanta js react                                | generator:C                                       | <100   | -   | platform-adjacent | none                          |
| how to use vanta js                           | generator:H                                       | <100   | -   | question          | none                          |
| hero background                               | generator:I                                       | >100   | -   | use-case          | lede                          |
| hero background animation                     | angle I, matrix                                   | <100   | -   | use-case          | keywords                      |
| hero section                                  | generator:I                                       | >100   | -   | use-case          | faq                           |
| website hero section                          | generator:I                                       | >100   | -   | use-case          | none                          |
| animated header background                    | generator:I                                       | <100   | -   | use-case          | none                          |
| background animation website                  | generator:I                                       | <100   | -   | use-case          | none                          |
| background animations for website             | generator:I                                       | <100   | -   | use-case          | none                          |
| background animations for websites            | generator:I                                       | <100   | -   | use-case          | keywords                      |
| website background animations                 | generator:I                                       | <100   | -   | use-case          | none                          |
| backgrounds for websites                      | traffic:reddit r/webdev #3 / 300                  | <100   | -   | use-case          | none                          |
| cool website backgrounds                      | traffic:reddit r/webdev #1 / 100                  | <100   | -   | use-case          | none                          |
| cool backgrounds for websites                 | traffic:reddit r/webdev #1 / 60                   | <100   | -   | use-case          | none                          |
| lovable.dev homepage background effect        | generator:G                                       | <100   | -   | use-case          | none                          |
| recreate lovable.dev background effect        | generator:G                                       | <100   | -   | use-case          | none                          |
| moving background                             | generator:B                                       | >1K    | -   | platform-adjacent | keywords                      |
| moving background animation                   | generator:B                                       | <100   | -   | long-tail         | none                          |
| css moving background                         | generator:C                                       | <100   | -   | platform-adjacent | none                          |
| dynamic background                            | generator:B                                       | >100   | -   | platform-adjacent | none                          |
| motion background                             | generator:B                                       | >100   | -   | platform-adjacent | none                          |
| nextjs background animation                   | generator:C                                       | <100   | -   | long-tail         | faq                           |
| tailwind background animations                | generator:C                                       | <100   | -   | long-tail         | faq                           |
| framer motion background animation            | generator:C                                       | <100   | -   | platform-adjacent | none                          |
| gsap background animation                     | generator:C                                       | <100   | -   | platform-adjacent | none                          |
| lottie background animation                   | generator:F                                       | <100   | -   | platform-adjacent | faq                           |
| animated svg background                       | generator:F                                       | <100   | -   | platform-adjacent | none                          |
| animated gradient background                  | traffic:aceternity gradient #3 / 80               | <100   | -   | platform-adjacent | none                          |
| moving gradient background                    | traffic:aceternity gradient #5 / 30               | <100   | -   | platform-adjacent | none                          |
| cursor animation                              | traffic:reactbits splash-cursor #1 / 150          | <100   | -   | platform-adjacent | none                          |
| animated cursor                               | traffic:reactbits splash-cursor #3 / 200          | <100   | -   | platform-adjacent | none                          |
| mouse pointer animation                       | traffic:reactbits splash-cursor #1 / 50           | <100   | -   | platform-adjacent | none                          |
| cursor animation for website                  | generator:E                                       | <100   | -   | long-tail         | none                          |
| cursor effect react                           | generator:C                                       | <100   | -   | long-tail         | none                          |
| magnetic cursor effect website                | generator:E                                       | <100   | -   | long-tail         | none                          |
| mouse effect website                          | generator:E                                       | <100   | -   | long-tail         | none                          |
| javascript follow mouse effect                | generator:E                                       | <100   | -   | long-tail         | none                          |
| what is particle background in web design     | generator:H                                       | <100   | -   | question          | faq                           |
| how to make an interactive background         | generator:H                                       | <100   | -   | question          | faq                           |
| how to make interactive website background    | generator:H                                       | <100   | -   | question          | faq                           |
| how to make an animated background            | generator:H                                       | <100   | -   | question          | faq                           |
| how to create animated background             | generator:H                                       | <100   | -   | question          | faq                           |
| how to make a moving background               | generator:H                                       | <100   | -   | question          | none                          |
| how to add particles js in background         | generator:H                                       | <100   | -   | question          | faq                           |
| how to use particle js as background          | generator:H                                       | <100   | -   | question          | faq                           |
| what is a hero section of a website           | generator:H                                       | >100   | -   | question          | none                          |
| what is a cursor trail effect in web design   | generator:H                                       | <100   | -   | question          | none                          |
| what is generative art                        | generator:H                                       | <100   | -   | question          | none                          |
| how does perlin noise work                    | generator:H                                       | <100   | -   | question          | faq                           |
| how to code generative art                    | generator:H                                       | <100   | -   | question          | none                          |

## Proven set from Step 4 (competitor traffic)

`traffic` returns at most five keywords per target on the free tier, so this is
the full harvest rather than a selection.

| page                                                | mo   | keywords earned (position / traffic)                                                                                                                       |
| --------------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| vantajs.com                                         | 966  | background animation for website #1/200, website background animation #1/150, animated background #7/2.5K, vanta js #1/200, vanta.js #1/150                |
| shadcn.io/background                                | 128  | animated backgrounds #21/3.7K, animated background #13/2.5K, react backgrounds #3/70, background animations #4/40, react animated background #2/10         |
| shadcn.io/background/particles                      | 16   | particles background #6/150, particle background #9/100                                                                                                    |
| reactbits.dev/backgrounds/particles                 | 156  | particle js #3/600, particles js #3/100, particle animation #2/60, react particles #1/30, particles animation #1/20                                        |
| reactbits.dev/backgrounds/grid-motion               | 22   | react backgrounds #2/70, react animated background #1/10, react background animation #1/10, animated background react #1/10, react background #10/20       |
| reactbits.dev/animations/splash-cursor              | 194  | cursor animation #1/150, animated cursor #3/200, mouse pointer animation #1/50                                                                             |
| vincentgarreau.com/particles.js/                    | 1.6K | particle js #1/600, particles js #1/100, particle.js #1/100, particles.js #1/80                                                                            |
| prismic.io/blog/css-background-effects              | 1.6K | css background animation #1/100, css animated background #1/100, animated background css #1/60, cool css backgrounds #1/50                                 |
| sliderrevolution.com/.../css-animated-background    | 731  | background animation css #2/150, website background animation #6/150, css background animation #2/100, animated background css #1/80                       |
| freefrontend.com/css-animated-backgrounds/          | 189  | background animation #8/200, css background animation #6/100, css background effects #3/50, background animation css #5/40, html animated background #4/40 |
| ui.aceternity.com/.../background-gradient-animation | 54   | gradient animation #4/80, animated gradient background #3/80, animated gradient #6/70, moving gradient background #5/30                                    |
| ui.aceternity.com/components/background-beams       | 4    | react background #4/40                                                                                                                                     |
| magicui.design/docs/components/particles            | 10   | particle animation #8/60, react particles #3/30, particles effect #8/30, particles animation #4/20                                                         |
| magicui.design/docs/components/dot-pattern          | 9    | dotted background pattern #3/60                                                                                                                            |
| reddit r/webdev "38 websites for backgrounds"       | 410  | backgrounds for websites #3/300, cool website backgrounds #1/100, css animated background #3/100, cool backgrounds for websites #1/60                      |

Domain-level: magicui.design 12.8K/mo, ui.aceternity.com 8.3K/mo,
reactbits.dev 6.7K/mo, vantajs.com 966/mo, particles.js.org 635/mo. Every one of
those domains earns the bulk of its traffic on its brand name and its home page;
the per-component pages that do earn non-brand traffic earn it on exactly the
phrases above, which is why they drive the title, description and FAQ here.

## Difficulty on the shortlist (Step 5)

| keyword                          | kd  | label  |
| -------------------------------- | --- | ------ |
| interactive background           | 0   | easy   |
| particle background              | 0   | easy   |
| react background                 | 0   | easy   |
| react backgrounds                | 0   | easy   |
| react animated background        | 1   | easy   |
| animated background react        | 2   | easy   |
| background animation             | 7   | easy   |
| animated background              | 12  | medium |
| flow field                       | 12  | medium |
| react background animation       | 33  | hard   |
| background animation for website | -   | easy   |
| website background animation     | -   | easy   |
| canvas background animation      | -   | easy   |
| react particle background        | -   | easy   |
| generative background            | -   | easy   |
| interactive background react     | -   | easy   |

`react background animation` at KD 33 is the one shortlist term above 20. It is
in `keywords` and answered in the FAQ, not in the title.

## Title note

`Interactive React Animated Background` (37 chars) puts the primary phrase
`react animated background` contiguous and intact, and leads with `interactive`
because that word is itself a KD 0 term whose SERP vanta.js holds at #1, and
because pointer steering is what separates this page from the ~365 static
gradient backgrounds on 21st.dev. The strict "primary first" ordering was traded
for one leading keyword; the primary trigram is unbroken either way.

## Rejected clusters

- **fluid dynamics / aerospace coursework** - `incompressible flow field`,
  `asymmetric flow field-flow fractionation`, `the velocity potential for a
certain inviscid flow field is`, `flow field plate`, `blocked serpentine flow
field redox flow battery`, `metal flow field`. Different subject entirely; the
  bare `flow field` SERP is half this.
- **game-dev pathfinding** - `flow field pathfinding`, `flow field path storage
rts`. A navigation grid, not a visual effect. Ranks #1 and #3 on the bare term.
- **vector calculus coursework** - `divergence of a vector field`, `curl of a
vector field`, `conservative vector field`, `vector field grapher`,
  `how to tell if a vector field is conservative`. `vector field` is >1K volume
  and almost entirely homework.
- **magnetic and electric fields** - the entire `flow field` question list
  (`which way does magnetic field flow`, `which way do charges flow in an electric
field`). Physics, not graphics.
- **desktop and video-call wallpaper** - `animated wallpaper windows 11`
  (>1K), `teams animated background`, `zoom animated background`,
  `animated backgrounds for powerpoint`, `xbox dynamic background`,
  `ps5 animated backgrounds`, `how to get an animated background on pc`. Huge
  volume, zero overlap with a React component. Unlike confetti, there is no
  honest bridge here - a canvas component cannot be a desktop wallpaper - so it
  is not answered in the FAQ either.
- **stock media** - `animated background videos`, `particle background 4k`,
  `free animated backgrounds`, `motion background free download`,
  `particle background stock video`, `abstract background hd`. The bare
  `animated background` SERP is Pixabay, Pexels, Adobe Express, Canva, Videezy
  and Pinterest, which is why `animated background` alone is not the title.
- **background checks** - `best website background check`,
  `what is the most accurate background check website`. `website background`
  (>1K) is polluted by this.
- **Canvas LMS and physical canvas** - `how to change canvas background color`,
  `canvas background painting ideas`, `white canvas background for photography`,
  `oil on canvas effect`. The word `canvas` is almost never the HTML element in
  search.
- **image editing** - `background remover`, `transparent background generator`,
  `ai background generator` (>1K), `blur background effect`,
  `how to remove background from svg`. A generator that removes or replaces a
  photo background, not one that animates a page.
- **notebooks and stationery** - `dot grid notebook`, `dot grid journal`,
  `printable dot grid paper`. `dot grid` looked like a sibling component and is
  entirely bullet-journalling.
- **weather** - `wind map live`, `wind map usa`, `how to read wind barbs on a
weather map`. The "wind map" visual reference has no product demand behind it.
- **misc collisions** - `mass effect` mouse sensitivity, `mickey mouse effect`,
  `clone hero background`, `episode interactive background`, `folk hero
background 5e`, `ilok background component unavailable`,
  `react flow background component` (the react-flow diagram library),
  `nextjs background jobs / workers / tasks` (server-side work queues, a
  completely different meaning of "background").
- **CSS-only kept, not rejected** - `css background animation` and its variants
  sit in `keywords` and the FAQ rather than being dropped. Someone searching it
  wants a moving page background; this page answers with a canvas one and says so
  explicitly in the "WebGL or three.js" answer, which also names CSS keyframes,
  GIFs and background video.

## Open questions

None. Every FAQ claim is verified against `FlowField.tsx`, `flow-field.css` and
`src/engine/loop.ts`.
