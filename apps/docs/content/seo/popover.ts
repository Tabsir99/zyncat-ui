import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'Headless React Popover Component',
  description:
    'A headless React popover - an anchored panel that flips sides and clamps to the viewport on scroll and resize, with no built-in styling of its own content.',
  keywords: [
    'popover',
    'react popover',
    'popover component',
    'react popover component',
    'anchored popover',
    'headless popover',
    'popover ui',
  ],
  lede: 'A non-modal anchored panel you style yourself - flips sides and clamps to the viewport as the trigger moves.',
  faq: [
    {
      q: 'How do I close a Popover from inside its own content, like a menu item?',
      a: "Drive it yourself with open and onOpenChange - children is a plain ReactNode, not a function that hands you a close callback, so a row's own onClick calls your own setOpen(false). Left uncontrolled, dismissible (on by default) already closes it on Escape or an outside press with no extra wiring.",
    },
    {
      q: 'How do I anchor a Popover to something other than its trigger?',
      a: 'Pass anchor - anything with a getBoundingClientRect() method, which a plain element also satisfies - and drive open yourself; trigger becomes optional. Passing a new anchor object re-places it, which is how you follow a moving target like a context-menu point.',
    },
    {
      q: 'Does the popover avoid getting clipped near the edge of the screen?',
      a: 'Yes - it flips to the opposite side when the preferred side is cramped and the opposite side has more room, and it clamps both axes so the panel never renders past the viewport edge. Position re-runs on scroll and resize.',
    },
    {
      q: "What's the difference between Popover, Dropdown and Tooltip?",
      a: 'Popover is headless - children is the entire surface, paint and semantics both, so you build the menu or card yourself. Dropdown is the pre-styled menu built on that same anchored positioning, with grouped rows, shortcuts and nested submenus; Tooltip is a single transient hint bubble that travels between triggers rather than a persistent panel.',
    },
  ],
};

export default seo;
