import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Badge Component',
  description:
    'A React badge component for status chips and labels: five tones, a glass or outline surface, and an optional dot, icon or pill shape for React 19.',
  keywords: [
    'badge',
    'react badge',
    'badge component',
    'react badge component',
    'pill badge',
    'badge ui',
    'label chip',
  ],
  lede: 'A React badge component - toned status chips with a dot, icon or pill shape. For labels and flags.',
  faq: [
    {
      q: 'What does the tone prop control on a badge?',
      a: "tone sets the chip's color semantics - neutral, info, success, warning or danger - and defaults to neutral. Pair it with variant, size, dot, live, pill and icon to compose the chip; children is the label text.",
    },
    {
      q: 'How do I add a leading icon or status dot?',
      a: 'Pass a node to icon for a leading icon, or set dot for a plain status dot instead. live pulses that dot for an in-progress state and implies dot on its own - icon takes priority, so if both are set the dot is not rendered.',
    },
    {
      q: "What's the difference between the glass and outline variants?",
      a: 'variant defaults to \'glass\', which gives the chip a translucent, interactive glass surface. Setting variant="outline" swaps that for a flat bordered chip instead.',
    },
    {
      q: 'How do I make a badge pill-shaped or smaller?',
      a: 'pill switches the chip to a fully-rounded shape, and size="sm" tightens the vertical padding for dense, inline use - the default size is \'md\'.',
    },
  ],
};

export default seo;
