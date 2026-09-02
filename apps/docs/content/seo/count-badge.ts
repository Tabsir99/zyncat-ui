import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Count Badge Component',
  description:
    'A React count badge for unread notification counts and totals: mono tabular figures by default, plus a roll mode that rolls each digit like an odometer.',
  keywords: [
    'count badge',
    'react count badge',
    'notification badge',
    'unread count badge',
    'badge counter',
    'notification count',
    'cart count badge',
  ],
  lede: 'A React count badge for unread counts and totals - roll animates each digit like an odometer.',
  faq: [
    {
      q: 'How do I show a numeric count in a badge?',
      a: 'Pass value - a string or number - to CountBadge; it stringifies the value and renders it inside a regular Badge, so tone, size, pill and the other Badge props still apply. The default tone is neutral.',
    },
    {
      q: 'How do I animate the count when it changes, like an odometer?',
      a: 'Set roll. Each digit becomes its own column that slides vertically to the new figure, instead of the whole number just re-rendering; non-digit characters such as a slash or a space stay fixed in place.',
    },
    {
      q: 'Why do the digits not shift width as the count changes?',
      a: "Badge renders in a monospace font with tabular figures by default, so every digit takes the same width - a count going from 9 to 10 doesn't jiggle the surrounding layout.",
    },
    {
      q: 'Can I format the count, like adding a separator?',
      a: 'Yes - value accepts any string, so format it yourself before passing it in, for example <CountBadge value="7 / 10" />. Whatever string you pass is what gets stringified and rendered, or split into rolling digit columns under roll.',
    },
  ],
};

export default seo;
