import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Support Rail Component',
  description:
    'A React support rail - an edge tab that expands into an action panel with drag-to-dismiss, a live status dot and a pinned footer, without covering the screen.',
  keywords: [
    'support rail',
    'react support rail',
    'support rail component',
    'react support rail component',
    'support panel',
    'edge tab',
  ],
  lede: 'An edge tab that grows a support panel from its measured box - use it over Sheet when the tab must stay visible.',
  faq: [
    {
      q: 'How do I add rows to the SupportRail panel?',
      a: 'Pass actions - each item renders a row with a label, an optional description line and optional meta text. Selecting one calls onSelect(id, action) and the panel stays open, so you render what happens next - a form, a confirmation - in children rather than the rail navigating away for you.',
    },
    {
      q: 'How do I dismiss the panel?',
      a: 'Drag the grabber outward past 88px, or flick it faster than 500px/s, and it snaps closed; let go short of that and it springs back. Escape and the visible close button do the same thing without a pointer.',
    },
    {
      q: 'Can I show a live indicator or a status line on the tab?',
      a: 'live adds a small availability dot with an ambient halo on the needle itself, and status renders a small mono line under the panel\'s title - e.g. status="Open · closes 20:00" in the component\'s own example.',
    },
    {
      q: 'Which edge does the rail pin to?',
      a: 'side is "right" (the default) or "left", and it flips more than which edge the needle sits on - the collapse origin, the drag axis and the vertical needle label all mirror with it, so a left rail isn\'t just a right rail nudged over.',
    },
  ],
};

export default seo;
