import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Removable Tag Component',
  description:
    'A React tag component for removable labels and applied filters: an optional icon, a remove button, and an animated TagGroup that reflows on change.',
  keywords: [
    'tag component',
    'react tag',
    'removable tag',
    'tag chip',
    'filter chip',
    'react chip component',
    'removable label',
  ],
  lede: 'A React tag component for removable labels and applied filters - TagGroup animates adds, removes and reflow.',
  faq: [
    {
      q: 'How do I make a tag removable?',
      a: 'Pass onRemove - Tag then renders a remove button. removeLabel sets its accessible name; without it, a string label becomes "Remove {label}" automatically. Tag itself is stateless: onRemove only reports the click, and the parent removes the item from its own list.',
    },
    {
      q: 'How do I animate tags being added or removed from a list?',
      a: 'Wrap the Tags in a TagGroup. It renders a role="group" wrapper, and each Tag inside animates in and out while the remaining tags reflow with a layout transition - pass animation to retime that, or null to turn it off.',
    },
    {
      q: 'Can I add an icon to a tag, or dim it when disabled?',
      a: "icon takes any node, sized small and tinted to the tag's own text color. disabled marks the tag data-disabled, which dims its label, icon and remove glyph to a muted color and disables the remove button.",
    },
    {
      q: "What's the difference between Tag and Badge?",
      a: "Tag is a user-owned, removable label - for applied filters or entries someone added themselves - while Badge communicates ambient status. Tag has no tone prop; its size is only 'md' (28px) or 'sm' (24px).",
    },
  ],
};

export default seo;
