import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Confetti Animation Component',
  description:
    'A canvas confetti animation for React 19. Fire a burst on button click from the ref handle: paper, curls, ribbons and foil, no GIF and no dependencies.',
  keywords: [
    'confetti gif transparent',
    'confetti transparent',
    'confetti overlay',
    'confetti gif transparent background',
    'transparent confetti',
    'confetti animation',
    'transparent confetti gif',
    'canvas confetti',
    'confetti effect',
    'confetti no background',
    'canvas-confetti',
    'confetti video',
    'react confetti',
    'animated confetti',
    'confetti js',
  ],
  lede: 'A React confetti component that fires a canvas burst on click - for success screens, checkouts and sign-ups.',
  faq: [
    {
      q: 'What is a confetti animation?',
      a: 'A confetti animation is a celebration effect that throws coloured paper across the screen and lets it tumble and fall. This one is a canvas particle simulation: every piece gets its own drag, lift, gravity, spin and flip across three depth layers, so it settles like real paper rather than looping a fixed animation.',
    },
    {
      q: 'How do I fire confetti on a button click in React?',
      a: "Render <Confetti ref={confetti} /> once, then call confetti.current?.fire() from the button's onClick. fire() also takes a per-burst override - fire({ count: 300, duration: 2.5, emitter: 'top' }) - and bursts coexist rather than cancelling each other, so rapid clicks stack. Under prefers-reduced-motion the canvas renders nothing and fire() is a no-op.",
    },
    {
      q: 'Is this a confetti GIF, a Lottie file or a canvas animation?',
      a: 'It is a live canvas animation, not a confetti GIF, Lottie file or transparent overlay video. Nothing is downloaded and nothing is pre-rendered: the pieces are simulated per frame in a <canvas> element, so the burst is a different shape every time and stays sharp at any screen size or pixel density.',
    },
    {
      q: 'Can I add this confetti animation to PowerPoint or Google Slides?',
      a: 'No - this is a React component for the web, so it runs on a page, not inside a slide deck. PowerPoint and Google Slides need an animated GIF or a video file; if you want confetti on a website, a landing page or a success screen instead, this component is the one to use.',
    },
    {
      q: 'Does this confetti component work in Next.js and with server rendering?',
      a: 'Yes. It is a React 19 component with zero runtime dependencies and no Tailwind, so it drops into Next.js as-is. With field="viewport" the canvas is portalled to document.body after hydration and renders nothing on the server; with the default field="container" it fills the nearest positioned ancestor.',
    },
    {
      q: 'How do I change the confetti colours, count and duration?',
      a: 'count sets the pieces one burst sends (1-520, default 170) and duration is how long the emitter stays open in seconds - 0.15 reads as one shove, 2.5 tapers into a fall. Colours are CSS custom properties on the canvas: set --confetti-paper-1 through --confetti-paper-5, plus --confetti-weights, --confetti-gloss and --confetti-shade to retune the palette.',
    },
  ],
};

export default seo;
