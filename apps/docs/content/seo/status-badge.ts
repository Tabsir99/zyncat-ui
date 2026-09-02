import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Status Badge Component',
  description:
    'A React status badge for post lifecycles: draft, scheduled, processing, published or failed, each a fixed tone, with a morph mode animating changes in place.',
  keywords: [
    'status badge',
    'react status badge',
    'status indicator',
    'react status indicator',
    'status label',
    'status pill',
    'status chip',
  ],
  lede: 'A React status badge - draft to published, each status a fixed tone and label. Morph animates changes in place.',
  faq: [
    {
      q: 'Which status values does StatusBadge support?',
      a: "Five: draft, scheduled, processing, published and failed. Each maps to a fixed tone and one-word label - failed renders the danger tone with the label 'Failed', for example - and an unrecognized value falls back to draft.",
    },
    {
      q: 'How do I animate a status change instead of swapping the label abruptly?',
      a: 'Set morph. The old label slides out while the new one slides in and the chip resizes to fit it, rather than the label just replacing itself on the next render.',
    },
    {
      q: 'Why does the badge pulse for a processing status?',
      a: "processing is the one status wired to a pulsing dot internally, the same effect as Badge's own live prop - a visual cue that work is still in progress.",
    },
    {
      q: 'Is there a visual effect when a status reaches its final state?',
      a: 'Yes, but only with morph on: landing on published or failed - the two terminal statuses - plays a one-off glint sweep across the chip once the new label finishes animating in.',
    },
  ],
};

export default seo;
