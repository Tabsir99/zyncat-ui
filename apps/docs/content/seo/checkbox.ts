import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Checkbox Component',
  description:
    'A React checkbox component with a real spring-in accent fill, a hand-drawn tick, indeterminate support, and sm/md sizes for dense settings rows.',
  keywords: [
    'checkbox',
    'react checkbox',
    'checkbox component',
    'input type checkbox',
    'indeterminate checkbox',
    'checkbox with label',
    'custom checkbox react',
  ],
  lede: 'A checkbox with a spring-in fill and a drawn-on tick, plus indeterminate support. For choices a form commits later.',
  faq: [
    {
      q: "How do I show an indeterminate 'select all' checkbox?",
      a: 'Pass indeterminate - it renders a short dash instead of the tick and visually wins over checked. It mirrors the native .indeterminate DOM property, which HTML exposes as a property rather than an attribute, so the component sets it imperatively through a ref rather than as a plain prop on the input.',
    },
    {
      q: 'Is the Checkbox tick a real animation, or a static icon swap?',
      a: "A real one - the tick is an SVG path animated with stroke-dasharray/stroke-dashoffset, and it's timed to draw in slightly after the accent fill has started springing into the box, rather than both firing at once.",
    },
    {
      q: 'How do I show a required-checkbox error, like a consent gate?',
      a: "Pass error as a boolean - the box and tick recolor to the danger tokens and aria-invalid is set on the input, so a screen reader announces the invalid state alongside the color change. It's a single flag, not a message prop, so pair it with your own error text elsewhere in the form.",
    },
    {
      q: "What's the difference between Checkbox and Toggle?",
      a: 'Checkbox is for a choice a form commits later, on submit; Toggle is for a setting that takes effect the instant you flip it. Both share the same label, description, checked and onChange shape, so swapping one for the other is a one-line change.',
    },
  ],
};

export default seo;
