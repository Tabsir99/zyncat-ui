import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Collapse / Accordion Component',
  description:
    'A React collapse primitive - grid-template-rows eases between 0fr and 1fr, never height:auto, and closed children stay mounted for a smooth accordion base.',
  keywords: [
    'accordion',
    'react accordion',
    'accordion component',
    'collapse',
    'react collapse',
    'collapsible',
    'expand collapse',
    'collapsible component',
  ],
  lede: 'A layout-transition primitive that eases height open and closed with CSS grid - the base for accordions.',
  faq: [
    {
      q: 'Does Collapse measure content height in JavaScript?',
      a: 'No - it transitions the CSS grid-template-rows property between 0fr and 1fr (grid-template-columns for axis="width"), so the browser interpolates the track size natively. Children stay mounted in the DOM the entire time; closed content is only hidden through visibility, not removed, which keeps it present in the markup rather than unmounted.',
    },
    {
      q: 'Can I build an accordion out of Collapse?',
      a: 'Yes, but as the primitive underneath, not a pre-built accordion widget - there\'s no group-exclusivity prop for a single open panel. Render one Collapse per section, track which section id is open in your own state, and toggle each Collapse\'s open prop; axis="height", the default, is what an accordion needs.',
    },
    {
      q: 'How do I control the open/close animation timing?',
      a: "animation takes motion-scale tokens only: duration (fast|base|slow|slower|slowest) and ease (standard|entrance|exit|spring|glide), each as one token or split per direction, e.g. { duration: { close: 'fast' }, ease: { close: 'exit' } }. Pass animation={null} to snap instantly, and prefers-reduced-motion collapses every transition to 1ms automatically.",
    },
    {
      q: 'What does the fade prop add?',
      a: "fade cross-fades the content's opacity alongside the size transition - on open it fades in about 60ms after the size starts, so the reveal doesn't read as a flat wipe, and on close it fades out immediately rather than waiting for the size to finish.",
    },
  ],
};

export default seo;
