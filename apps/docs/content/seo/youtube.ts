import type { PageSeo } from './types';

const seo: PageSeo = {
  title: 'YouTube Clone UI - React Feed & Shorts',
  description:
    "A YouTube clone UI for React: the feed grid card, the Shorts watch page and the community post, at YouTube's own pixel metrics. No YouTube API, no login.",
  keywords: [
    'youtube clone',
    'youtube ui',
    'youtube mockup',
    'youtube clones',
    'youtube shorts ui',
    'youtube shorts overlay',
    'youtube interface',
    'youtube clone site',
    'youtube shorts layout',
    'video ui',
    'youtube video mockup',
    'youtube ui design',
    'youtube short overlay',
  ],
  lede: 'A React YouTube UI component - the feed card, the Short and the community post. For clones and mockups.',
  faq: [
    {
      q: 'How do I build a YouTube clone UI in React?',
      a: 'Import YouTube from \'@zyncat/ui/youtube\' and pick a surface: <YouTube surface="video" title="Building a design system from zero" channel="Zyncat" views="184K views" age="3 weeks ago" duration="14:22" media={thumb} verified />. surface takes video, short or post, and one prop set spans all three - title, channel, views, age, duration, verified, likes, comments, remixes and text. Each instance is a single card, so the grid in a YouTube clone project is your own array mapped over it, and the data, routing and auth stay yours.',
    },
    {
      q: 'Does this YouTube component use the YouTube API or play real videos?',
      a: 'No. There is no YouTube API, no Google login, no network request and no real videos in it - it never fetches and it never plays. media and avatar take a URL string or your own node, so the thumbnail is exactly what you hand it. On the Shorts surface the play control only flips its own glyph and fires onPausedChange, and progress is a 0-100 number you drive; the component never touches a media element and runs no timer.',
    },
    {
      q: 'How do I embed a YouTube video in React with this?',
      a: 'You do not - it is not an embed wrapper, and it does not play YouTube content. Playing a real video still needs the YouTube iframe player, whether that is an <iframe src="https://www.youtube.com/embed/ID"> of your own or a package like react-youtube. This component draws the interface around the video instead, and media accepts your node, so passing that iframe or a <video> as media puts something playing inside the replica frame.',
    },
    {
      q: 'Which YouTube surfaces does the replica cover?',
      a: 'Three video UI surfaces, behind one surface prop. video is the feed grid card - a 533px column with a 16:9 thumbnail, the duration badge, the 36px channel avatar, a two-line title and the verified tick. short is the Shorts watch page around a 477px 9:16 stage, with the play control, the cc and expand pill, the progress track and the like, comment, share and remix rail - the whole Shorts overlay at its real metrics. post is the community post, a 638px card whose 508px square frame becomes a draggable carousel once carousel gets an array of images.',
    },
    {
      q: 'Can I use it as a YouTube mockup instead of a screenshot?',
      a: 'Yes - a mockup is what a replica is for. Searching "youtube mockup" mostly returns PSDs, Figma community files and vector packs; this draws a live YouTube card in the DOM at the platform\'s own metrics, so it stays sharp at any zoom and never ages out of date the way a downloaded template or an old screenshot does. It is a React component, not a fake-channel image generator: nothing is submitted anywhere, and every value on screen is a prop you pass.',
    },
    {
      q: 'Can I use this YouTube UI clone in Next.js?',
      a: "Yes. @zyncat/ui/youtube ships compiled ESM with its 'use client' directive intact, so it drops into the Next.js App Router with no transpilePackages config and zero runtime dependencies. Being a replica, its metrics are pinned constants your theme cannot move - only the type reads --font-body - and under prefers-reduced-motion the carousel and the Shorts progress bar snap into place instead of easing.",
    },
  ],
};

export default seo;
