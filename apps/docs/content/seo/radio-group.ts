import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Radio Group Component',
  description:
    'A React radio group component for picking exactly one option, laid out as quiet rows or selectable cards, with a marker that glides between them.',
  keywords: [
    'radio group',
    'react radio group',
    'radio button group',
    'input type radio',
    'radio buttons react',
    'radio group component',
    'custom radio button',
  ],
  lede: 'A single-select radio group as quiet rows or selectable cards, with a marker that glides. For picking one of a few.',
  faq: [
    {
      q: 'How do I switch between the rows and cards layout?',
      a: "Set variant to 'rows' (the default, a quiet stacked list) or 'cards' (bordered, selectable tiles). orientation then lays either one out 'vertical' (default) or 'horizontal', and an option's icon only renders in the cards variant.",
    },
    {
      q: 'How does the selected marker move between options?',
      a: "It's one shared dot with a layout id, so picking a different option glides the marker across to it instead of it popping in and out; the 'cards' variant animates its selected-tile fill the same way.",
    },
    {
      q: "How do I show a 'pick one to continue' validation error?",
      a: 'Pass error as the message itself, not a boolean - <RadioGroup error="Pick a plan to continue." ... /> recolors the unselected dots to the danger token and reveals your message under the options through a Collapse.',
    },
    {
      q: 'Is RadioGroup keyboard accessible?',
      a: 'Yes, natively - every option is a real <input type="radio"> sharing one name, inside a <fieldset>/<legend>, so the browser\'s own arrow-key roving and Tab behavior apply with no custom key handling in the component.',
    },
  ],
};

export default seo;
