import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Variable Font Animation on Hover',
  description:
    'A variable font animation for React 19: hover one letter and its font weight ramps to 900, spilling onto its neighbours. Pure CSS, zero dependencies.',
  keywords: [
    'font weight',
    'css font weight',
    'css text outline',
    'font-weight',
    'variable fonts',
    'what is font weight',
    'css text stroke',
    'font animation',
    'text stroke css',
    'variable font',
    'font weights',
    'what is a variable font',
    'hover animation css',
    'text stroke',
    'what are variable fonts',
  ],
  lede: 'A React variable font component where hovering one letter ramps its weight. For display headlines.',
  faq: [
    {
      q: 'How do I add a variable font animation to a React or Next.js page?',
      a: "Import it per subpath and pass the headline: import { WeightField } from '@zyncat/ui/weight-field', then <WeightField text=\"Nostalgia\" />. It holds no state and runs no effect, so it renders on the server in the Next.js App Router with no 'use client' boundary; link @zyncat/ui/styles.css once at the root for the tokens.",
    },
    {
      q: 'What is a variable font, and do I need one for this?',
      a: 'A variable font ships one file whose weight is a continuous wght axis rather than a handful of separate files, so a browser can render 437 as readily as 400. You do need one here: the ramp animates font-weight through 300, 400, 600 and 900, and on a static family the browser jumps between the installed cuts instead of gliding. The headline inherits --font-sans, so setting that to a variable face - a next/font/google or next/font/local one included - is all the setup there is.',
    },
    {
      q: 'Can I make a font weight animation with CSS alone?',
      a: 'This one is CSS alone. Every character is its own span, and :hover plus the + sibling and :has() selectors pick out the hovered letter, the two beside it and the two beyond, while a transition on font-weight runs the ramp. There is no pointer listener, no requestAnimationFrame and no JavaScript per frame, so it costs nothing while the pointer sits still.',
    },
    {
      q: 'How do I slow the hover effect down, or change the weights and the text stroke?',
      a: 'speed multiplies the ramp rate against a 400ms default - 2 halves the settle, 0.5 doubles it. The four steps are --weight-field-rest-weight (300), --weight-field-far-weight (400), --weight-field-near-weight (600) and --weight-field-peak-weight (900); flatten the near and far values onto rest and only the hovered letter answers. --weight-field-stroke-peak sets the doubled -webkit-text-stroke the peak letter takes, and --weight-field-duration and --weight-field-ease retime the transition itself.',
    },
    {
      q: 'Is this a font animation generator like an After Effects or GIF preset?',
      a: 'No. It is a React component animating a live variable font in the DOM, so the headline stays real text rather than pixels in a video, a GIF or an After Effects, Premiere Pro or Canva preset, and you can retype it without re-rendering anything. The playground on this page is the generator: type your headline, set the speed, then copy the JSX from the Code tab.',
    },
    {
      q: 'Is the variable font animation accessible and does it respect reduced motion?',
      a: 'Yes. The complete headline is rendered once into a visually hidden label for screen readers while every glyph span is aria-hidden, so assistive tech reads the word instead of spelling it out. Under prefers-reduced-motion the 400ms ramp collapses to 1ms, and because the effect is a decorative pointer hover the headline is fully legible at its rest weight whether or not anyone hovers it.',
    },
  ],
};

export default seo;
