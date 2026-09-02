import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Alert Component',
  description:
    'A React alert component for persistent in-flow status - four tones, an optional action button, a dismiss control, and a banner variant for app-wide strips.',
  keywords: [
    'alert',
    'react alert',
    'alert component',
    'react alert component',
    'alert banner',
    'dismissible alert',
    'alert message',
  ],
  lede: "A persistent in-flow status message, not a toast - reach for it when the notice should stay until it's dismissed.",
  faq: [
    {
      q: 'What tones does Alert support, and how do they affect accessibility?',
      a: 'Four: info, success, warning and danger. info and success render role="status", a polite live-region announcement; warning and danger render role="alert", which is assertive, matching the tones meant to interrupt.',
    },
    {
      q: 'How do I add a dismiss button or an action to an Alert?',
      a: "Set dismissible for the always-visible close button - it's uncontrolled unless you also pass open - and give action a { label, onClick } for one action max, rendered as a small button tinted to the alert's own tone rather than Button's secondary variant.",
    },
    {
      q: 'How does Alert animate in and out?',
      a: 'It opens by easing its own height from 0 while fading in, and on dismiss it scales down and fades rather than collapsing - the space it occupied stays reserved until the exit finishes, so content below shifts up once, not mid-animation.',
    },
    {
      q: 'Can I change or remove the tone icon?',
      a: 'Yes - icon accepts any node to override the default tone glyph (info, check-circle, warning or warning-circle), and passing icon={null} removes the icon slot entirely.',
    },
  ],
};

export default seo;
