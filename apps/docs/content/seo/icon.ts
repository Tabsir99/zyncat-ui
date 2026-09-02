import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'React Icon Component Pattern',
  description:
    'How icons work in Zyncat UI: no bundled icon set, so components take any icon as a ReactNode, demonstrated here with a small Phosphor registry pattern.',
  keywords: [
    'react icon',
    'react icons',
    'icon component',
    'react icon component',
    'phosphor icons',
    'svg icon react',
    'icon library react',
  ],
  lede: 'No bundled icon set - components take any icon as a ReactNode. This page shows the registry pattern.',
  faq: [
    {
      q: 'How do I add an icon to a Zyncat UI component?',
      a: "Pass any node to that component's icon prop - Badge, Tag and Avatar all take icon as a plain ReactNode. There is nothing to import for the icon itself: you bring your own, typically a component from a library like @phosphor-icons/react.",
    },
    {
      q: 'Does Zyncat UI ship its own icon set?',
      a: 'No - there is no @zyncat/ui/icon export. What this page demonstrates instead is the pattern its own components and docs use internally: a small object that maps short string names to individually imported Phosphor glyphs, so a project only ever imports the icons it actually uses.',
    },
    {
      q: "What does a 'semantic alias' mean for an icon name?",
      a: 'One imported glyph registered under more than one name, so each call site can use whichever reads clearer. The library\'s own internal icon registry, for example, maps both "x" and "close" to the same glyph.',
    },
    {
      q: 'How do I mark an icon as active or selected?',
      a: 'Switch its weight to "fill" - Phosphor ships a filled variant of every glyph, and the convention this page documents is using that fill weight for an active or selected state instead of adding a second icon.',
    },
  ],
};

export default seo;
