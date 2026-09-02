import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Drawer / Sheet Component',
  description:
    'A React sheet component docked to an edge - right by default, bottom for a true bottom sheet - with drag-to-dismiss, a coupled scrim and scroll lock.',
  keywords: [
    'sheet',
    'react sheet',
    'sheet component',
    'bottom sheet',
    'react bottom sheet',
    'drawer',
    'react drawer',
    'side sheet',
  ],
  lede: 'An edge-docked modal panel - a side drawer by default, or a bottom sheet with side="bottom" - with drag-to-dismiss.',
  faq: [
    {
      q: 'Does Sheet actually render as a bottom sheet?',
      a: 'Yes, when you set side="bottom" - the panel docks flush to the bottom edge at full width with drag-down-to-dismiss. It\'s a prop you set rather than an automatic viewport switch: side defaults to "right", and picking "bottom" on narrow viewports is a decision your own code makes, not something Sheet does on its own.',
    },
    {
      q: 'How does drag-to-dismiss work?',
      a: "Grab anywhere on the panel and drag toward its docked edge - past 40% of the panel's own span, or faster than 500px/s, releases it closed; short of that it springs back. Dragging inside a scrolled list doesn't fight the scroll - the drag only takes over once that content is back at its own top edge.",
    },
    {
      q: 'What happens to the rest of the page while a Sheet is open?',
      a: "It scroll-locks the page, or the container prop's own box if you pass one - overflow is hidden, the scrollbar gutter is compensated so nothing shifts width, and every sibling outside the sheet gets the inert attribute so it can't be tabbed into or clicked. Closing restores all of it and returns focus to whatever opened the sheet.",
    },
    {
      q: 'Does clicking the trigger again close the Sheet, like a toggle?',
      a: "No - the trigger only opens it; unlike Popover's trigger, which toggles, Sheet's click handler always sets it open. Close it via the scrim, Escape, the drag gesture, or your own control inside, driving open and onOpenChange if you need it controlled.",
    },
  ],
};

export default seo;
